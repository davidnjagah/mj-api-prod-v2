"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFSWsMessage = void 0;
var utils_1 = require("./utils");
var IFSWsMessage = /** @class */ (function () {
    function IFSWsMessage(config, MJApi) {
        this.config = config;
        this.MJApi = MJApi;
        this.closed = false;
        this.event = [];
        this.waitIFSEvents = new Map();
        this.skipMessageId = [];
        this.reconnectTime = [];
        this.heartbeatInterval = 0;
        this.UserId = "";
        this.ws = new this.config.WebSocket(this.config.WsBaseUrl);
        this.ws.addEventListener("open", this.open.bind(this));
        this.onSystem("messageCreate", this.onMessageCreate.bind(this));
        this.onSystem("messageUpdate", this.onMessageUpdate.bind(this));
        this.onSystem("messageDelete", this.onMessageDelete.bind(this));
        this.onSystem("ready", this.onReady.bind(this));
        this.onSystem("interactionSuccess", this.onInteractionSuccess.bind(this));
    }
    IFSWsMessage.prototype.heartbeat = function (num) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.reconnectTime[num])
                            return [2 /*return*/];
                        //check if ws is closed
                        if (this.closed)
                            return [2 /*return*/];
                        if (this.ws.readyState !== this.ws.OPEN) {
                            this.reconnect();
                            return [2 /*return*/];
                        }
                        this.log("heartbeat", this.heartbeatInterval);
                        this.heartbeatInterval++;
                        this.ws.send(JSON.stringify({
                            op: 1,
                            d: this.heartbeatInterval,
                        }));
                        return [4 /*yield*/, this.timeout(1000 * 40)];
                    case 1:
                        _a.sent();
                        this.heartbeat(num);
                        return [2 /*return*/];
                }
            });
        });
    };
    IFSWsMessage.prototype.close = function () {
        this.closed = true;
        this.ws.close();
    };
    IFSWsMessage.prototype.checkWs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.closed)
                            return [2 /*return*/];
                        if (!(this.ws.readyState !== this.ws.OPEN)) return [3 /*break*/, 2];
                        this.reconnect();
                        return [4 /*yield*/, this.onceReady()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IFSWsMessage.prototype.onceReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.once("ready", function (user) {
                            //print user nickname
                            console.log("\uD83C\uDF8A ws ready!!! Hi: ".concat(user.global_name));
                            resolve(_this);
                        });
                    })];
            });
        });
    };
    //try reconnect
    IFSWsMessage.prototype.reconnect = function () {
        if (this.closed)
            return;
        this.ws = new this.config.WebSocket(this.config.WsBaseUrl);
        this.heartbeatInterval = 0;
        this.ws.addEventListener("open", this.open.bind(this));
    };
    // After opening ws
    IFSWsMessage.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var num;
            var _this = this;
            return __generator(this, function (_a) {
                num = this.reconnectTime.length;
                this.log("open.time", num);
                this.reconnectTime.push(false);
                this.auth();
                this.ws.addEventListener("message", function (event) {
                    _this.parseMessage(event.data);
                });
                this.ws.addEventListener("error", function (event) {
                    _this.reconnectTime[num] = true;
                    _this.reconnect();
                });
                this.ws.addEventListener("close", function (event) {
                    _this.reconnectTime[num] = true;
                    _this.reconnect();
                });
                setTimeout(function () {
                    _this.heartbeat(num);
                }, 1000 * 10);
                return [2 /*return*/];
            });
        });
    };
    // auth
    IFSWsMessage.prototype.auth = function () {
        this.ws.send(JSON.stringify({
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
        }));
    };
    IFSWsMessage.prototype.timeout = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    IFSWsMessage.prototype.messageCreate = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var id, nonce, components, attachments, content;
            return __generator(this, function (_a) {
                id = message.id, nonce = message.nonce, components = message.components, attachments = message.attachments, content = message.content;
                if (nonce) {
                    // this.log("waiting start image or info or error");
                    this.updateMjEventIdByNonce(id, nonce);
                    console.log("This is MjEvents", this.waitIFSEvents);
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
                if (!nonce && (attachments === null || attachments === void 0 ? void 0 : attachments.length) > 0 && (components === null || components === void 0 ? void 0 : components.length) > 0) {
                    this.done(message);
                    return [2 /*return*/];
                }
                this.messageUpdate(message);
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.messageUpdate = function (message) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        //this.log("messageUpdate: ", message);
        var content = message.content, embeds = message.embeds, _j = message.interaction, interaction = _j === void 0 ? {} : _j, nonce = message.nonce, id = message.id, components = message.components;
        if (!nonce) {
            var name_1 = interaction.name;
            switch (name_1) {
                case "settings":
                    this.emit("settings", message);
                    return;
                case "describe":
                    var uri = (_b = (_a = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.url;
                    if (this.config.ImageProxy !== "") {
                        uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
                    }
                    var describe = {
                        id: id,
                        flags: message.flags,
                        descriptions: (_c = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _c === void 0 ? void 0 : _c.description.split("\n\n"),
                        uri: uri,
                        proxy_url: (_e = (_d = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.proxy_url,
                        options: (0, utils_1.formatOptions)(components),
                    };
                    this.emitMJ(id, describe);
                    break;
                case "prefer remix":
                    if (content != "") {
                        this.emit("prefer-remix", content);
                    }
                    break;
                case "shorten":
                    var shorten = {
                        description: (_f = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _f === void 0 ? void 0 : _f.description,
                        prompts: (0, utils_1.formatPrompts)((_g = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _g === void 0 ? void 0 : _g.description),
                        options: (0, utils_1.formatOptions)(components),
                        id: id,
                        flags: message.flags,
                    };
                    this.emitMJ(id, shorten);
                    break;
                case "info":
                    this.emit("info", (_h = embeds === null || embeds === void 0 ? void 0 : embeds[0]) === null || _h === void 0 ? void 0 : _h.description);
                    return;
            }
        }
        if (embeds === null || embeds === void 0 ? void 0 : embeds[0]) {
            var _k = embeds[0], description = _k.description, title = _k.title;
            if (title === "Duplicate images detected") {
                var error = new Error(description);
                this.EventError(id, error);
                return;
            }
        }
        if (content) {
            this.processingImage(message);
        }
    };
    //interaction success
    IFSWsMessage.prototype.onInteractionSuccess = function (_a) {
        var nonce = _a.nonce, id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_b) {
                event = this.getEventByNonce(nonce);
                if (!event) {
                    return [2 /*return*/];
                }
                event.onmodal && event.onmodal(nonce, id);
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.onReady = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.UserId = user.id;
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.onMessageCreate = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var channel_id, author, interaction;
            return __generator(this, function (_a) {
                channel_id = message.channel_id, author = message.author, interaction = message.interaction;
                if (channel_id !== this.config.ChannelId)
                    return [2 /*return*/];
                if ((author === null || author === void 0 ? void 0 : author.id) !== this.config.BotId)
                    return [2 /*return*/];
                if (interaction && interaction.user.id !== this.UserId)
                    return [2 /*return*/];
                // this.log("[messageCreate]", JSON.stringify(message));
                this.messageCreate(message);
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.onMessageUpdate = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var channel_id, author, interaction;
            return __generator(this, function (_a) {
                channel_id = message.channel_id, author = message.author, interaction = message.interaction;
                if (channel_id !== this.config.ChannelId)
                    return [2 /*return*/];
                if ((author === null || author === void 0 ? void 0 : author.id) !== this.config.BotId)
                    return [2 /*return*/];
                if (interaction && interaction.user.id !== this.UserId)
                    return [2 /*return*/];
                // this.log("[messageUpdate]", JSON.stringify(message));
                this.messageUpdate(message);
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.onMessageDelete = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var channel_id, id, waitIFSIter, nextEntry, _a, key, value;
            return __generator(this, function (_b) {
                channel_id = message.channel_id, id = message.id;
                if (channel_id !== this.config.ChannelId)
                    return [2 /*return*/];
                waitIFSIter = this.waitIFSEvents.entries();
                nextEntry = waitIFSIter.next();
                while (!nextEntry.done) {
                    _a = nextEntry.value, key = _a[0], value = _a[1];
                    console.log("Key: ".concat(key, ", Value: ").concat(value));
                    if (value.id === id) {
                        this.waitIFSEvents.set(key, __assign(__assign({}, value), { del: true }));
                    }
                    nextEntry = waitIFSIter.next();
                }
                return [2 /*return*/];
            });
        });
    };
    // parse message from ws
    IFSWsMessage.prototype.parseMessage = function (data) {
        var _this = this;
        var msg = JSON.parse(data);
        if (!msg.t) {
            return;
        }
        var message = msg.d;
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
                    this.waitIFSEvents.forEach(function (value, index) {
                        if (message.content === "idname ".concat(value.rid, " created")) {
                            console.log("Has been found", value.rid);
                            var event_1 = _this.getEventByNonce(value.nonce);
                            if (!event_1) {
                                return;
                            }
                            console.log("This is the event", event_1);
                            var IFSmsg = {
                                id: value.id,
                                rid: value.rid,
                                flags: message.flags,
                                content: message.content
                            };
                            var eventMsg = {
                                message: IFSmsg,
                            };
                            _this.emitImage(event_1.nonce, eventMsg);
                            _this.removeEvent(event_1.nonce);
                            _this.removeWaitIFSEvent(value.nonce);
                        }
                    });
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
    };
    IFSWsMessage.prototype.EventError = function (id, error) {
        var event = this.getEventById(id);
        if (!event) {
            return;
        }
        var eventMsg = {
            error: error,
        };
        this.emit(event.nonce, eventMsg);
    };
    IFSWsMessage.prototype.done = function (message) {
        var content = message.content, id = message.id, attachments = message.attachments, components = message.components, flags = message.flags;
        if ((attachments === null || attachments === void 0 ? void 0 : attachments.length) > 0) {
            var _a = attachments[0], url = _a.url, proxy_url = _a.proxy_url;
            var uri = url;
            if (this.config.ImageProxy !== "") {
                uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
            }
            var IFSmsg_1 = {
                id: id,
                rid: content,
                flags: flags,
                content: content,
                hash: (0, utils_1.uriToHash)(url),
                progress: "done",
                proxy_url: proxy_url,
                options: (0, utils_1.formatOptions)(components)
            };
            this.filterMessages(IFSmsg_1);
            return;
        }
        var IFSmsg = {
            id: id,
            flags: flags,
            rid: content,
            content: content,
            progress: "done"
        };
        this.filterMessages(IFSmsg);
        return;
    };
    IFSWsMessage.prototype.processingImage = function (message) {
        var content = message.content, id = message.id, attachments = message.attachments, flags = message.flags;
        if (!content) {
            return;
        }
        var event = this.getEventById(id);
        if (!event) {
            return;
        }
        event.prompt = content;
        //not image
        if (!attachments || attachments.length === 0) {
            return;
        }
        var uri = attachments[0].url;
        if (this.config.ImageProxy !== "") {
            uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
        }
        var IFSmsg = {
            proxy_url: attachments[0].proxy_url,
            content: content,
            flags: flags,
            progress: (0, utils_1.content2progress)(content),
            id: id,
            rid: event.rid,
        };
        var eventMsg = {
            message: IFSmsg,
        };
        this.emitImage(event.nonce, eventMsg);
    };
    IFSWsMessage.prototype.filterMessages = function (IFSmsg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                //delay 300ms for discord message delete
                //await this.timeout(300);
                this.waitIFSEvents.forEach(function (value, index) {
                    if (IFSmsg.content && IFSmsg.content.includes("[SaveID: '".concat(value.rid, "']"))) {
                        var event_2 = _this.getEventByNonce(value.nonce);
                        if (!event_2) {
                            _this.log("FilterMessages not found", IFSmsg, _this.waitIFSEvents);
                            return;
                        }
                        var eventMsg = {
                            message: IFSmsg,
                        };
                        _this.emitImage(event_2.nonce, eventMsg);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.getEventById = function (id) {
        var waitIFSIter = this.waitIFSEvents.entries();
        var nextEntry = waitIFSIter.next();
        while (!nextEntry.done) {
            var _a = nextEntry.value, key = _a[0], value = _a[1];
            console.log("Key: ".concat(key, ", Value: ").concat(value));
            if (value.id === id) {
                return value;
            }
            nextEntry = waitIFSIter.next();
        }
    };
    IFSWsMessage.prototype.getEventByNonce = function (nonce) {
        var waitIFSIter = this.waitIFSEvents.entries();
        var nextEntry = waitIFSIter.next();
        while (!nextEntry.done) {
            var _a = nextEntry.value, key = _a[0], value = _a[1];
            console.log("Key: ".concat(key, ", Value: ").concat(value));
            if (value.nonce === nonce) {
                return value;
            }
            nextEntry = waitIFSIter.next();
        }
    };
    IFSWsMessage.prototype.updateMjEventIdByNonce = function (id, nonce) {
        if (nonce === "" || id === "")
            return;
        var event = this.waitIFSEvents.get(nonce);
        if (!event)
            return;
        event.id = id;
        this.log("updateMjEventIdByNonce success", this.waitIFSEvents.get(nonce));
    };
    IFSWsMessage.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.config.Debug && console.info.apply(console, __spreadArray(__spreadArray([], args, false), [new Date().toISOString()], false));
                return [2 /*return*/];
            });
        });
    };
    IFSWsMessage.prototype.emit = function (event, message) {
        this.event
            .filter(function (e) { return e.event === event; })
            .forEach(function (e) { return e.callback(message); });
    };
    IFSWsMessage.prototype.emitImage = function (type, message) {
        this.emit(type, message);
    };
    //FIXME: emitMJ rename
    IFSWsMessage.prototype.emitMJ = function (id, data) {
        var event = this.getEventById(id);
        if (!event)
            return;
        this.emit(event.nonce, data);
    };
    IFSWsMessage.prototype.on = function (event, callback) {
        this.event.push({ event: event, callback: callback });
    };
    IFSWsMessage.prototype.onSystem = function (event, callback) {
        this.on(event, callback);
    };
    IFSWsMessage.prototype.emitSystem = function (type, message) {
        this.emit(type, message);
    };
    IFSWsMessage.prototype.once = function (event, callback) {
        var _this = this;
        var once = function (message) {
            _this.remove(event, once);
            callback(message);
        };
        this.event.push({ event: event, callback: once });
    };
    IFSWsMessage.prototype.remove = function (event, callback) {
        this.event = this.event.filter(function (e) { return e.event !== event && e.callback !== callback; });
    };
    IFSWsMessage.prototype.removeEvent = function (event) {
        this.event = this.event.filter(function (e) { return e.event !== event; });
    };
    //FIXME: USE ONCE
    IFSWsMessage.prototype.onceInfo = function (callback) {
        var _this = this;
        var once = function (message) {
            _this.remove("info", once);
            callback(message);
        };
        this.event.push({ event: "info", callback: once });
    };
    //FIXME: USE ONCE
    IFSWsMessage.prototype.onceSettings = function (callback) {
        var _this = this;
        var once = function (message) {
            _this.remove("settings", once);
            callback(message);
        };
        this.event.push({ event: "settings", callback: once });
    };
    IFSWsMessage.prototype.onceMJ = function (nonce, callback) {
        var _this = this;
        var once = function (message) {
            _this.remove(nonce, once);
            //FIXME: removeWaitIFSEvent
            _this.removeWaitIFSEvent(nonce);
            callback(message);
        };
        //FIXME: addWaitMjEvent
        this.waitIFSEvents.set(nonce, { nonce: nonce, rid: "" });
        this.event.push({ event: nonce, callback: once });
    };
    IFSWsMessage.prototype.removeWaitIFSEvent = function (nonce) {
        this.waitIFSEvents.delete(nonce);
    };
    IFSWsMessage.prototype.onceImage = function (nonce, callback) {
        var _this = this;
        var once = function (data) {
            var message = data.message, error = data.error;
            if (error || (message && message.progress === "done")) {
                _this.remove(nonce, once);
            }
            callback(data);
        };
        this.event.push({ event: nonce, callback: once });
    };
    IFSWsMessage.prototype.onceSaveid = function (nonce, saveidres, callback) {
        var _this = this;
        var once = function (data) {
            var message = data.message, error = data.error;
            if (error || (message && message.content == saveidres)) {
                _this.remove(nonce, once);
            }
            callback(data);
        };
        this.event.push({ event: nonce, callback: once });
    };
    IFSWsMessage.prototype.onceSwapid = function (nonce, rid, callback) {
        var _this = this;
        var once = function (data) {
            var message = data.message, error = data.error;
            if (error || (message && message.content.includes("[SaveID: '".concat(rid, "']")))) {
                _this.remove(nonce, once);
            }
            callback(data);
        };
        this.event.push({ event: nonce, callback: once });
    };
    IFSWsMessage.prototype.waitSaveIdMessage = function (_a) {
        var nonce = _a.nonce, rid = _a.rid, imageUri = _a.imageUri, saveidres = _a.saveidres, onmodal = _a.onmodal, messageId = _a.messageId, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (messageId)
                    this.skipMessageId.push(messageId);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handleSaveIdMessage = function (_a) {
                            var message = _a.message, error = _a.error;
                            console.log("This is the message ", message);
                            if (error) {
                                _this.removeWaitIFSEvent(nonce);
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
                            _this.waitIFSEvents.set(nonce, {
                                nonce: nonce,
                                rid: rid,
                                onmodal: function (oldnonce, id) { return __awaiter(_this, void 0, void 0, function () {
                                    var nonce;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (onmodal === undefined) {
                                                    // reject(new Error("onmodal is not defined"))
                                                    return [2 /*return*/, ""];
                                                }
                                                return [4 /*yield*/, onmodal(oldnonce, id)];
                                            case 1:
                                                nonce = _a.sent();
                                                if (nonce === "") {
                                                    // reject(new Error("onmodal return empty nonce"))
                                                    return [2 /*return*/, ""];
                                                }
                                                this.removeWaitIFSEvent(oldnonce);
                                                this.waitIFSEvents.set(nonce, { nonce: nonce, rid: rid });
                                                this.onceSaveid(nonce, saveidres, handleSaveIdMessage);
                                                return [2 /*return*/, nonce];
                                        }
                                    });
                                }); },
                            });
                        }
                        _this.onceSaveid(nonce, saveidres, handleSaveIdMessage);
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitSwapIdMessage = function (_a) {
        var nonce = _a.nonce, rid = _a.rid, onmodal = _a.onmodal, messageId = _a.messageId, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (messageId)
                    this.skipMessageId.push(messageId);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handleSwapIdMessage = function (_a) {
                            var message = _a.message, error = _a.error;
                            console.log("This is the message ", message);
                            if (error) {
                                _this.removeWaitIFSEvent(nonce);
                                reject(error);
                                return;
                            }
                            if (message && message.content.includes("[SaveID: '".concat(rid, "']"))) {
                                console.log("The message has been found");
                                resolve(message);
                                return;
                            }
                            message && loading && loading(message.rid, message.content || "");
                        };
                        if (rid) {
                            _this.waitIFSEvents.set(nonce, {
                                nonce: nonce,
                                rid: rid,
                                onmodal: function (oldnonce, id) { return __awaiter(_this, void 0, void 0, function () {
                                    var nonce;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (onmodal === undefined) {
                                                    // reject(new Error("onmodal is not defined"))
                                                    return [2 /*return*/, ""];
                                                }
                                                return [4 /*yield*/, onmodal(oldnonce, id)];
                                            case 1:
                                                nonce = _a.sent();
                                                if (nonce === "") {
                                                    // reject(new Error("onmodal return empty nonce"))
                                                    return [2 /*return*/, ""];
                                                }
                                                this.removeWaitIFSEvent(oldnonce);
                                                this.waitIFSEvents.set(nonce, { nonce: nonce, rid: rid });
                                                this.onceSwapid(nonce, rid, handleSwapIdMessage);
                                                return [2 /*return*/, nonce];
                                        }
                                    });
                                }); },
                            });
                        }
                        _this.onceSwapid(nonce, rid, handleSwapIdMessage);
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitDelIdMessage = function (_a) {
        var nonce = _a.nonce, rid = _a.rid, onmodal = _a.onmodal, messageId = _a.messageId, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (messageId)
                    this.skipMessageId.push(messageId);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handleDelIdMessage = function (_a) {
                            var message = _a.message, error = _a.error;
                            console.log("This is the message ", message);
                            if (error) {
                                _this.removeWaitIFSEvent(nonce);
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
                            _this.waitIFSEvents.set(nonce, {
                                nonce: nonce,
                                rid: rid,
                                onmodal: function (oldnonce, id) { return __awaiter(_this, void 0, void 0, function () {
                                    var nonce;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (onmodal === undefined) {
                                                    // reject(new Error("onmodal is not defined"))
                                                    return [2 /*return*/, ""];
                                                }
                                                return [4 /*yield*/, onmodal(oldnonce, id)];
                                            case 1:
                                                nonce = _a.sent();
                                                if (nonce === "") {
                                                    // reject(new Error("onmodal return empty nonce"))
                                                    return [2 /*return*/, ""];
                                                }
                                                this.removeWaitIFSEvent(oldnonce);
                                                this.waitIFSEvents.set(nonce, { nonce: nonce, rid: rid });
                                                this.onceSaveid(nonce, rid, handleDelIdMessage);
                                                return [2 /*return*/, nonce];
                                        }
                                    });
                                }); },
                            });
                        }
                        _this.onceSaveid(nonce, rid, handleDelIdMessage);
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitDescribe = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.onceMJ(nonce, function (message) {
                            resolve(message);
                        });
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitShorten = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.onceMJ(nonce, function (message) {
                            resolve(message);
                        });
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitContent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.once(event, function (message) {
                            resolve(message);
                        });
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.onceInfo(function (message) {
                            resolve((0, utils_1.formatInfo)(message));
                        });
                    })];
            });
        });
    };
    IFSWsMessage.prototype.waitSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.onceSettings(function (message) {
                            resolve({
                                id: message.id,
                                flags: message.flags,
                                content: message,
                                options: (0, utils_1.formatOptions)(message.components),
                            });
                        });
                    })];
            });
        });
    };
    return IFSWsMessage;
}());
exports.IFSWsMessage = IFSWsMessage;
