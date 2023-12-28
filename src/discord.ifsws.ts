import { InsightFaceSwapApi } from "./insightfaceswap.api";
import {
  MJConfig,
  LoadingHandler,
  MJInfo,
  MJSettings,
  OnModal,
  MJShorten,
  MJDescribe,
  IFSMessage,
  IFSEmit,
  WaitIFSEvent,
} from "./interfaces";
import {
  content2progress,
  formatInfo,
  formatOptions,
  formatPrompts,
  uriToHash,
} from "./utils";
// @ts-ignore
import WebSocket = require('isomorphic-ws');
export class IFSWsMessage {
  ws: WebSocket;
  private closed = false;
  private event: Array<{ event: string; callback: (message: any) => void }> =
    [];
  private waitIFSEvents: Map<string, WaitIFSEvent> = new Map();
  private skipMessageId: string[] = [];
  private reconnectTime: boolean[] = [];
  private heartbeatInterval = 0;
  public UserId = "";
  constructor(public config: MJConfig, public MJApi: InsightFaceSwapApi) {
    this.ws = new this.config.WebSocket(this.config.WsBaseUrl);
    this.ws.addEventListener("open", this.open.bind(this));
    this.onSystem("messageCreate", this.onMessageCreate.bind(this));
    this.onSystem("messageUpdate", this.onMessageUpdate.bind(this));
    this.onSystem("messageDelete", this.onMessageDelete.bind(this));
    this.onSystem("ready", this.onReady.bind(this));
    this.onSystem("interactionSuccess", this.onInteractionSuccess.bind(this));
  }

  private async heartbeat(num: number) {
    if (this.reconnectTime[num]) return;
    //check if ws is closed
    if (this.closed) return;
    if (this.ws.readyState !== this.ws.OPEN) {
      this.reconnect();
      return;
    }
    this.log("heartbeat", this.heartbeatInterval);
    this.heartbeatInterval++;
    this.ws.send(
      JSON.stringify({
        op: 1,
        d: this.heartbeatInterval,
      })
    );
    await this.timeout(1000 * 40);
    this.heartbeat(num);
  }
  close() {
    this.closed = true;
    this.ws.close();
  }
  async checkWs() {
    if (this.closed) return;
    if (this.ws.readyState !== this.ws.OPEN) {
      this.reconnect();
      await this.onceReady();
    }
  }

  async onceReady() {
    return new Promise((resolve) => {
      this.once("ready", (user) => {
        //print user nickname
        console.log(`🎊 ws ready!!! Hi: ${user.global_name}`);
        resolve(this);
      });
    });
  }
  //try reconnect
  reconnect() {
    if (this.closed) return;
    this.ws = new this.config.WebSocket(this.config.WsBaseUrl);
    this.heartbeatInterval = 0;
    this.ws.addEventListener("open", this.open.bind(this));
  }
  // After opening ws
  private async open() {
    const num = this.reconnectTime.length;
    this.log("open.time", num);
    this.reconnectTime.push(false);
    this.auth();
    this.ws.addEventListener("message", (event) => {
      this.parseMessage(event.data as string);
    });
    this.ws.addEventListener("error", (event) => {
      this.reconnectTime[num] = true;
      this.reconnect();
    });
    this.ws.addEventListener("close", (event) => {
      this.reconnectTime[num] = true;
      this.reconnect();
    });
    setTimeout(() => {
      this.heartbeat(num);
    }, 1000 * 10);
  }
  // auth
  private auth() {
    this.ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.config.SalaiToken,
          capabilities: 8189,
          properties: {
            os: "Windows",
            browser: "Chrome",
            device: "",
          },
          compress: false,
        },
      })
    );
  }
  async timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async messageCreate(message: any) {
    //this.log("This is the message from messageCreate: ", message);
    const {id, nonce, components, attachments, content } = message;
    if (nonce) {
      // this.log("waiting start image or info or error");
      this.updateMjEventIdByNonce(id, nonce);
      console.log("This is MjEvents", this.waitIFSEvents)
      //console.log("This is this", this);
      console.log("This is content in MessageCreate", content);
      // if (content) {
      // this.log("This is the content of MessageCreate", content);
      // const getcontent = this.waitIFSEvents.get(id);
      // this.log("This is the getcontent of MessageCreate", getcontent?.saveidres);
      //     if (content?.includes("idname") && content?.includes("created") || content?.includes("updated")) {
      //       this.done(message);
      //       return;
      //     }
      // }
    }

    if (!nonce && attachments?.length > 0 && components?.length > 0) {
      this.done(message);
      return;
    }

    this.messageUpdate(message);
  }

  private messageUpdate(message: any) {
    //this.log("messageUpdate: ", message);
    const {
      content,
      embeds,
      interaction = {},
      nonce,
      id,
      components,
    } = message;

    if (!nonce) {
      const { name } = interaction;

      switch (name) {
        case "settings":
          this.emit("settings", message);
          return;
        case "describe":
          let uri = embeds?.[0]?.image?.url;
          if (this.config.ImageProxy !== "") {
            uri = uri.replace(
              "https://cdn.discordapp.com/",
              this.config.ImageProxy
            );
          }
          const describe: MJDescribe = {
            id: id,
            flags: message.flags,
            descriptions: embeds?.[0]?.description.split("\n\n"),
            uri: uri,
            proxy_url: embeds?.[0]?.image?.proxy_url,
            options: formatOptions(components),
          };
          this.emitMJ(id, describe);
          break;
        case "prefer remix":
          if (content != "") {
            this.emit("prefer-remix", content);
          }
          break;
        case "shorten":
          const shorten: MJShorten = {
            description: embeds?.[0]?.description,
            prompts: formatPrompts(embeds?.[0]?.description as string),
            options: formatOptions(components),
            id,
            flags: message.flags,
          };
          this.emitMJ(id, shorten);
          break;
        case "info":
          this.emit("info", embeds?.[0]?.description);
          return;
      }
    }
    if (embeds?.[0]) {
      var { description, title } = embeds[0];
      if (title === "Duplicate images detected") {
        const error = new Error(description);
        this.EventError(id, error);
        return;
      }
    }

    if (content) {
      this.processingImage(message);
    }
  }

  //interaction success
  private async onInteractionSuccess({
    nonce,
    id,
  }: {
    nonce: string;
    id: string;
  }) {
    // this.log("interactionSuccess", nonce, id);
    const event = this.getEventByNonce(nonce);
    if (!event) {
      return;
    }
    event.onmodal && event.onmodal(nonce, id);
  }
  private async onReady(user: any) {
    this.UserId = user.id;
  }
  private async onMessageCreate(message: any) {
    const { channel_id, author, interaction } = message;
    if (channel_id !== this.config.ChannelId) return;
    if (author?.id !== this.config.BotId) return;
    if (interaction && interaction.user.id !== this.UserId) return;
    // this.log("[messageCreate]", JSON.stringify(message));
    this.messageCreate(message);
  }

  private async onMessageUpdate(message: any) {
    const { channel_id, author, interaction } = message;
    if (channel_id !== this.config.ChannelId) return;
    if (author?.id !== this.config.BotId) return;
    if (interaction && interaction.user.id !== this.UserId) return;
    // this.log("[messageUpdate]", JSON.stringify(message));
    this.messageUpdate(message);
  }
  private async onMessageDelete(message: any) {
    const { channel_id, id } = message;
    if (channel_id !== this.config.ChannelId) return;
    const waitIFSIter = this.waitIFSEvents.entries();
    let nextEntry = waitIFSIter.next();
    while (!nextEntry.done) {
    const [key, value] = nextEntry.value;
      console.log(`Key: ${key}, Value: ${value}`);      
      if (value.id === id) {
        this.waitIFSEvents.set(key, { ...value, del: true });
      }
      nextEntry = waitIFSIter.next();
    }
  }

  // parse message from ws
  private parseMessage(data: string) {
    const msg = JSON.parse(data);
    if (!msg.t) {
      return;
    }
    const message = msg.d;
    if (message.channel_id === this.config.ChannelId) {
      this.log(data);
    }
    this.log("event", msg.t);
    //console.log(data);
    switch (msg.t) {
      case "READY":
        this.emitSystem("ready", message.user);
        break;
      case "MESSAGE_CREATE":
        this.emitSystem("messageCreate", message);
        if (message.content) {
          this.waitIFSEvents.forEach((value, index) =>{
          if ( message.content === `idname ${value.rid} created`) {
            console.log("Has been found", value.rid);
            const event = this.getEventByNonce(value.nonce);
            if (!event) {
              return;
            }
            console.log("This is the event", event);
            const IFSmsg: IFSMessage = {
              id: value.id,
              rid: value.rid,
              flags: message.flags,
              content: message.content
            };
            const eventMsg: IFSEmit = {
              message: IFSmsg,
            };
            this.emitImage(event.nonce, eventMsg);
            this.removeEvent(event.nonce);
            this.removeWaitIFSEvent(value.nonce)
          }
        })
        }
        break;
      case "MESSAGE_UPDATE":
        this.emitSystem("messageUpdate", message);
        break;
      case "MESSAGE_DELETE":
        this.emitSystem("messageDelete", message);
      case "INTERACTION_SUCCESS":
        if (message.nonce) {
          this.emitSystem("interactionSuccess", message);
        }
        break;
      case "INTERACTION_CREATE":
        if (message.nonce) {
          this.emitSystem("interactionCreate", message);
        }
    }
  }

  private EventError(id: string, error: Error) {
    const event = this.getEventById(id);
    if (!event) {
      return;
    }
    const eventMsg: IFSEmit = {
      error,
    };
    this.emit(event.nonce, eventMsg);
  }

  private done(message: any) {
    const { content, id, attachments, components, flags } = message;

    if(attachments?.length > 0){
    const { url, proxy_url } = attachments[0];
    let uri = url;
    if (this.config.ImageProxy !== "") {
      uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
    }

    const IFSmsg: IFSMessage = {
      id,
      rid: content,
      flags,
      content,
      hash: uriToHash(url),
      progress: "done",
      proxy_url,
      options: formatOptions(components)
    };
    this.filterMessages(IFSmsg);
    return;
  }

  const IFSmsg: IFSMessage = {
    id,
    flags,
    rid: content,
    content,
    progress: "done"
  };
  this.filterMessages(IFSmsg);
  return;
  }

  private processingImage(message: any) {
    const { content, id, attachments, flags } = message;
    if (!content) {
      return;
    }
    const event = this.getEventById(id);
    if (!event) {
      return;
    }
    event.prompt = content;
    //not image
    if (!attachments || attachments.length === 0) {
      return;
    }

    let uri = attachments[0].url;
    if (this.config.ImageProxy !== "") {
      uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
    }
    const IFSmsg: IFSMessage = {
      proxy_url: attachments[0].proxy_url,
      content: content,
      flags: flags,
      progress: content2progress(content),
      id: id,
      rid: event.rid,
    };
    const eventMsg: IFSEmit = {
      message: IFSmsg,
    };
    this.emitImage(event.nonce, eventMsg);
  }

  private async filterMessages(IFSmsg: IFSMessage) {
    //delay 300ms for discord message delete
    //await this.timeout(300);
    this.waitIFSEvents.forEach((value, index) => {
    if (IFSmsg.content && IFSmsg.content.includes(`[SaveID: '${value.rid}']`)) {
    const event = this.getEventByNonce(value.nonce);
    if (!event) {
      this.log("FilterMessages not found", IFSmsg, this.waitIFSEvents);
      return;
    }
    const eventMsg: IFSEmit = {
      message: IFSmsg,
    };
    this.emitImage(event.nonce, eventMsg);
  }
  });
  }

  private getEventById(id: string) {
    const waitIFSIter = this.waitIFSEvents.entries();
    let nextEntry = waitIFSIter.next();
    while (!nextEntry.done) {
    const [key, value] = nextEntry.value;
      console.log(`Key: ${key}, Value: ${value}`);
      if (value.id === id) {
        return value;
      }
      nextEntry = waitIFSIter.next();
    }
  }
  private getEventByNonce(nonce: string) {
    const waitIFSIter = this.waitIFSEvents.entries();
    let nextEntry = waitIFSIter.next();
    while (!nextEntry.done) {
    const [key, value] = nextEntry.value;
      console.log(`Key: ${key}, Value: ${value}`);
      if (value.nonce === nonce) {
        return value;
      }
      nextEntry = waitIFSIter.next();
    }
  }
  private updateMjEventIdByNonce(id: string, nonce: string) {
    if (nonce === "" || id === "") return;
    let event = this.waitIFSEvents.get(nonce);
    if (!event) return;
    event.id = id;
    this.log("updateMjEventIdByNonce success", this.waitIFSEvents.get(nonce));
  }

  protected async log(...args: any[]) {
    this.config.Debug && console.info(...args, new Date().toISOString());
  }

  emit(event: string, message: any) {
    this.event
      .filter((e) => e.event === event)
      .forEach((e) => e.callback(message));
  }
  private emitImage(type: string, message: IFSEmit) {
    this.emit(type, message);
  }
  //FIXME: emitMJ rename
  private emitMJ(id: string, data: any) {
    const event = this.getEventById(id);
    if (!event) return;
    this.emit(event.nonce, data);
  }

  on(event: string, callback: (message: any) => void) {
    this.event.push({ event, callback });
  }
  onSystem(
    event:
      | "ready"
      | "messageCreate"
      | "messageUpdate"
      | "messageDelete"
      | "interactionCreate"
      | "interactionSuccess",
    callback: (message: any) => void
  ) {
    this.on(event, callback);
  }
  private emitSystem(
    type:
      | "ready"
      | "messageCreate"
      | "messageUpdate"
      | "messageDelete"
      | "interactionSuccess"
      | "interactionCreate",
    message: IFSEmit
  ) {
    this.emit(type, message);
  }
  once(event: string, callback: (message: any) => void) {
    const once = (message: any) => {
      this.remove(event, once);
      callback(message);
    };
    this.event.push({ event, callback: once });
  }
  remove(event: string, callback: (message: any) => void) {
    this.event = this.event.filter(
      (e) => e.event !== event && e.callback !== callback
    );
  }
  removeEvent(event: string) {
    this.event = this.event.filter((e) => e.event !== event);
  }
  //FIXME: USE ONCE
  onceInfo(callback: (message: any) => void) {
    const once = (message: any) => {
      this.remove("info", once);
      callback(message);
    };
    this.event.push({ event: "info", callback: once });
  }
  //FIXME: USE ONCE
  onceSettings(callback: (message: any) => void) {
    const once = (message: any) => {
      this.remove("settings", once);
      callback(message);
    };
    this.event.push({ event: "settings", callback: once });
  }
  onceMJ(nonce: string, callback: (data: any) => void) {
    const once = (message: any) => {
      this.remove(nonce, once);
      //FIXME: removeWaitIFSEvent
      this.removeWaitIFSEvent(nonce);
      callback(message);
    };
    //FIXME: addWaitMjEvent
    this.waitIFSEvents.set(nonce, { nonce, rid: "" });
    this.event.push({ event: nonce, callback: once });
  }
  private removeWaitIFSEvent(nonce: string) {
    this.waitIFSEvents.delete(nonce);
  }
  onceImage(nonce: string, callback: (data: IFSEmit) => void) {
    const once = (data: IFSEmit) => {
      const { message, error } = data;
      if (error || (message && message.progress === "done")) {
        this.remove(nonce, once);
      }
      callback(data);
    };
    this.event.push({ event: nonce, callback: once });
  }

  onceSaveid(nonce: string, saveidres: string, callback: (data: IFSEmit) => void) {
    const once = (data: IFSEmit) => {
      const { message, error } = data;
      if (error || (message && message.content == saveidres)) {
        this.remove(nonce, once);
      }
      callback(data);
    };
    this.event.push({ event: nonce, callback: once });
  }

  onceSwapid(nonce: string, rid: string, callback: (data: IFSEmit) => void) {
    const once = (data: IFSEmit) => {
      const { message, error } = data;
      if (error || (message && message.content.includes(`[SaveID: '${rid}']`))) {
        this.remove(nonce, once);
      }
      callback(data);
    };
    this.event.push({ event: nonce, callback: once });
  }


  async waitSaveIdMessage({
    nonce,
    rid,
    imageUri,
    saveidres,
    onmodal,
    messageId,
    loading,
  }: {
    nonce: string;
    imageUri?: string;
    saveidres: string;
    rid: string;
    messageId?: string;
    onmodal?: OnModal;
    loading?: LoadingHandler;
  }) {
    if (messageId) this.skipMessageId.push(messageId);
    return new Promise<IFSMessage | null>((resolve, reject) => {
      const handleSaveIdMessage = ({ message, error }: IFSEmit) => {
        console.log("This is the message ", message);
        if (error) {
          this.removeWaitIFSEvent(nonce);
          reject(error);
          return;
        }
        if (message && message.content === saveidres) {
          console.log("The message has been found");
          resolve(message);
          return;
        }
        message && loading && loading(message.rid, message.content || "");
      };
      if (rid) {
        this.waitIFSEvents.set(nonce, {
          nonce,
          rid,
          onmodal: async (oldnonce, id) => {
            if (onmodal === undefined) {
              // reject(new Error("onmodal is not defined"))
              return "";
            }
            var nonce = await onmodal(oldnonce, id);
            if (nonce === "") {
              // reject(new Error("onmodal return empty nonce"))
              return "";
            }
            this.removeWaitIFSEvent(oldnonce);
            this.waitIFSEvents.set(nonce, { nonce, rid });
            this.onceSaveid(nonce, saveidres, handleSaveIdMessage);
            return nonce;
          },
        });
        }
      this.onceSaveid(nonce, saveidres, handleSaveIdMessage);
    });
  }

  async waitSwapIdMessage({
    nonce,
    rid,
    onmodal,
    messageId,
    loading,
  }: {
    nonce: string;
    rid: string;
    messageId?: string;
    onmodal?: OnModal;
    loading?: LoadingHandler;
  }) {
    if (messageId) this.skipMessageId.push(messageId);
    return new Promise<IFSMessage | null>((resolve, reject) => {
      const handleSwapIdMessage = ({ message, error }: IFSEmit) => {
        console.log("This is the message ", message);
        if (error) {
          this.removeWaitIFSEvent(nonce);
          reject(error);
          return;
        }
        if (message && message.content.includes(`[SaveID: '${rid}']`)) {
          console.log("The message has been found");
          resolve(message);
          return;
        }
        message && loading && loading(message.rid, message.content || "");
      };
      if (rid) {
        this.waitIFSEvents.set(nonce, {
          nonce,
          rid,
          onmodal: async (oldnonce, id) => {
            if (onmodal === undefined) {
              // reject(new Error("onmodal is not defined"))
              return "";
            }
            var nonce = await onmodal(oldnonce, id);
            if (nonce === "") {
              // reject(new Error("onmodal return empty nonce"))
              return "";
            }
            this.removeWaitIFSEvent(oldnonce);
            this.waitIFSEvents.set(nonce, { nonce, rid });
            this.onceSwapid(nonce, rid, handleSwapIdMessage);
            return nonce;
          },
        });
        }
      this.onceSwapid(nonce, rid, handleSwapIdMessage);
    });
  }

  async waitDelIdMessage({
    nonce,
    rid,
    onmodal,
    messageId,
    loading,
  }: {
    nonce: string;
    rid: string;
    messageId?: string;
    onmodal?: OnModal;
    loading?: LoadingHandler;
  }) {
    if (messageId) this.skipMessageId.push(messageId);
    return new Promise<IFSMessage | null>((resolve, reject) => {
      const handleDelIdMessage = ({ message, error }: IFSEmit) => {
        console.log("This is the message ", message);
        if (error) {
          this.removeWaitIFSEvent(nonce);
          reject(error);
          return;
        }
        if (message && message.content === rid) {
          console.log("The message has been found");
          resolve(message);
          return;
        }
        message && loading && loading(message.rid, message.content || "");
      };
      if (rid) {
        this.waitIFSEvents.set(nonce, {
          nonce,
          rid,
          onmodal: async (oldnonce, id) => {
            if (onmodal === undefined) {
              // reject(new Error("onmodal is not defined"))
              return "";
            }
            var nonce = await onmodal(oldnonce, id);
            if (nonce === "") {
              // reject(new Error("onmodal return empty nonce"))
              return "";
            }
            this.removeWaitIFSEvent(oldnonce);
            this.waitIFSEvents.set(nonce, { nonce, rid });
            this.onceSaveid(nonce, rid, handleDelIdMessage);
            return nonce;
          },
        });
        }
      this.onceSaveid(nonce, rid, handleDelIdMessage);
    });
  }

  async waitDescribe(nonce: string) {
    return new Promise<MJDescribe | null>((resolve) => {
      this.onceMJ(nonce, (message) => {
        resolve(message);
      });
    });
  }
  async waitShorten(nonce: string) {
    return new Promise<MJShorten | null>((resolve) => {
      this.onceMJ(nonce, (message) => {
        resolve(message);
      });
    });
  }
  async waitContent(event: string) {
    return new Promise<string | null>((resolve) => {
      this.once(event, (message) => {
        resolve(message);
      });
    });
  }
  async waitInfo() {
    return new Promise<MJInfo | null>((resolve, reject) => {
      this.onceInfo((message) => {
        resolve(formatInfo(message));
      });
    });
  }
  async waitSettings() {
    return new Promise<MJSettings | null>((resolve, reject) => {
      this.onceSettings((message) => {
        resolve({
          id: message.id,
          flags: message.flags,
          content: message,
          options: formatOptions(message.components),
        });
      });
    });
  }
}
