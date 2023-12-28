import { DiscordImage, MJConfig } from "./interfaces";

export const Commands = [
  "saveid",
  "swapid",
  "delid",
] as const;
export type CommandName = (typeof Commands)[number];
function getCommandName(name: string): CommandName | undefined {
  for (const command of Commands) {
    if (command === name) {
      return command;
    }
  }
}

export class Command {
  constructor(public config: MJConfig) {}
  cache: Partial<Record<CommandName, Command>> = {};

  async cacheCommand(name: CommandName) {
    if (this.cache[name] !== undefined) {
      return this.cache[name];
    }
    if (this.config.ServerId) {
      const command = await this.getCommand(name);
      this.cache[name] = command;
      return command;
    }
    this.allCommand();
    return this.cache[name];
  }
  async allCommand() {
    const searchParams = new URLSearchParams({
      type: "1",
      include_applications: "true",
    });
    const url = `${this.config.DiscordBaseUrl}/api/v9/channels/${this.config.ChannelId}/application-commands/search?${searchParams}`;

    const response = await this.config.fetch(url, {
      headers: { authorization: this.config.SalaiToken },
    });

    const data = await response.json();
    if (data?.application_commands) {
      data.application_commands.forEach((command: any) => {
        const name = getCommandName(command.name);
        if (name) {
          this.cache[name] = command;
        }
      });
    }
  }

  async getCommand(name: CommandName) {
    const searchParams = new URLSearchParams({
      type: "1",
      query: name,
      limit: "1",
      include_applications: "true",
      // command_ids: `${this.config.BotId}`,
    });
    const url = `${this.config.DiscordBaseUrl}/api/v9/channels/${this.config.ChannelId}/application-commands/search?${searchParams}`;
    const response = await this.config.fetch(url, {
      headers: { authorization: this.config.SalaiToken },
    });
    const data = await response.json();
    if (data?.application_commands?.[0]) {
      return data.application_commands[0];
    }
    throw new Error(`Failed to get application_commands for command ${name}`);
  }
  
  async saveIdPayload( idname: string, image: DiscordImage, nonce?: string) {
    const data = await this.commandData("saveid", [
      {
        type: 3,
        name: "idname",
        value: idname,
      },
      {
        type: 11,
        name: "image",
        value: 0,
      },
    ],
    [
      {
        id: "0",
        filename: image.filename,
        uploaded_filename: image.upload_filename,
      },
    ]
    );

  const application_command = {
      id: "1097018209481261127",
      application_id: "1090660574196674713",
      version: "1097018209481261130",
      name: "saveid",
      type: 1,
      description: "Save Identity Feature by Name and Image",
      options: [
        {
          type: 3,
          name: "idname",
          description: "idname to save",
          required: true,
          description_localized: "idname to save",
          name_localized: "idname"
        },
        {
          type: 11,
          name: "image",
          description: "id image",
          required: true,
          description_localized: "id image",
          name_localized: "image"
        }
      ],
      integration_types: [0],
      description_localized: "Save Identity Feature by Name and Image",
      name_localized: "saveid"
    };


    //Add the attachments to the payload
    return this.data2Paylod({
        ...data,
        application_command,
    }, nonce);

  }

  async swapIdPayload( idname: string, image: DiscordImage, nonce?: string) {
    const data = await this.commandData("swapid", [
      {
        type: 3,
        name: "idname",
        value: idname,
      },
      {
        type: 11,
        name: "image",
        value: 0,
      },
    ],
    [
      {
        id: "0",
        filename: image.filename,
        uploaded_filename: image.upload_filename,
      },
    ]
    );

  const application_command = {
      id: "1097030226204184646",
      application_id: "1090660574196674713",
      version: "1097030226204184647",
      name: "swapid",
      type: 1,
      description: "Apply Identity Feature to Target Image, use comma splitter for multiple identities",
      options: [
        {
          type: 3,
          name: "idname",
          description: "idname(s) to apply",
          required: true,
          description_localized: "idname(s) to apply",
          name_localized: "idname"
        },
        {
          type: 11,
          name: "image",
          description: "target image",
          required: true,
          description_localized: "id image",
          name_localized: "image"
        }
      ],
      integration_types: [0],
      description_localized: "Apply Identity Feature to Target Image, use comma splitter for multiple identities",
      name_localized: "swapid"
    };


    //Add the attachments to the payload
    return this.data2Paylod({
        ...data,
        application_command,
    }, nonce);

  }

  async delIdPayload( idname: string, nonce?: string) {
    const data = await this.commandData("delid", [
      {
        type: 3,
        name: "idname",
        value: idname,
      }
    ]
    );

  const application_command = {
      id: "1097020382013300907",
      type: 1,
      application_id: "1090660574196674713",
      version: "1097020382013300910",
      name: "delid",
      description: "Delete specific idname",
      options: [
        {
          type: 3,
          name: "idname",
          description: "idname to delete",
          required: true,
          description_localized: "idname to delete",
          name_localized: "idname"
        }
      ],
      integration_types: [0],
      description_localized: "Delete specific idname",
      name_localized: "delid"
    };


    //Add the attachments to the payload
    return this.data2Paylod({
        ...data,
        application_command,
    }, nonce);

  }

  protected async commandData(
    name: CommandName,
    options: any[] = [],
    attachments: any[] = [],
  ) {
    const command = await this.cacheCommand(name);
    const data = {
      version: command.version,
      id: command.id,
      name: command.name,
      type: command.type,
      options,
      application_command: command,
      attachments,
    };
    return data;
  }
  //TODO data type
  protected data2Paylod(data: any, nonce?: string) {
    const payload = {
      type: 2,
      application_id: data.application_command.application_id,
      guild_id: this.config.ServerId,
      channel_id: this.config.ChannelId,
      session_id: this.config.SessionId,
      nonce,
      data,
    };
    console.log("This is the payload ", JSON.stringify(payload))
    return payload;
  }

  protected data2PaylodSwapId(data: any, nonce?: string) {
    const payload = {
      type: 3,
      application_id: data.application_command.application_id,
      guild_id: this.config.ServerId,
      channel_id: this.config.ChannelId,
      session_id: this.config.SessionId,
      nonce,
      data,
    };
    console.log("This is the payload ", JSON.stringify(payload))
    return payload;
  }
}
