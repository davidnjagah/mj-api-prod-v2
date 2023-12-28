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
exports.WsMessage = void 0;
var utils_1 = require("./utils");
var verify_human_1 = require("./verify.human");
var WsMessage = /** @class */ (function () {
    function WsMessage(config, MJApi) {
        this.config = config;
        this.MJApi = MJApi;
        this.closed = false;
        this.event = [];
        this.waitMjEvents = new Map();
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
    WsMessage.prototype.heartbeat = function (num) {
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
    WsMessage.prototype.close = function () {
        this.closed = true;
        this.ws.close();
    };
    WsMessage.prototype.checkWs = function () {
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
    WsMessage.prototype.onceReady = function () {
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
    WsMessage.prototype.reconnect = function () {
        if (this.closed)
            return;
        this.ws = new this.config.WebSocket(this.config.WsBaseUrl);
        this.heartbeatInterval = 0;
        this.ws.addEventListener("open", this.open.bind(this));
    };
    // After opening ws
    WsMessage.prototype.open = function () {
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
    WsMessage.prototype.auth = function () {
        this.ws.send(JSON.stringify({
            op: 2,
            d: {
                token: this.config.SalaiToken,
                capabilities: 8189,
                properties: {
                    os: "Mac OS X",
                    browser: "Chrome",
                    device: "",
                },
                compress: false,
            },
        }));
    };
    WsMessage.prototype.timeout = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    WsMessage.prototype.messageCreate = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var embeds, id, nonce, components, attachments, _a, color, description, title, _b, error, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        embeds = message.embeds, id = message.id, nonce = message.nonce, components = message.components, attachments = message.attachments;
                        if (!nonce) return [3 /*break*/, 6];
                        // this.log("waiting start image or info or error");
                        this.updateMjEventIdByNonce(id, nonce);
                        if (!(embeds === null || embeds === void 0 ? void 0 : embeds[0])) return [3 /*break*/, 6];
                        _a = embeds[0], color = _a.color, description = _a.description, title = _a.title;
                        this.log("embeds[0].color", color);
                        _b = color;
                        switch (_b) {
                            case 16711680: return [3 /*break*/, 1];
                            case 16776960: return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 3];
                    case 1:
                        if (title == "Action needed to continue") {
                            return [2 /*return*/, this.continue(message)];
                        }
                        else if (title == "Pending mod message") {
                            return [2 /*return*/, this.continue(message)];
                        }
                        error = new Error(description);
                        this.EventError(id, error);
                        return [2 /*return*/];
                    case 2:
                        console.warn(description);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!((title === null || title === void 0 ? void 0 : title.includes("continue")) &&
                            (description === null || description === void 0 ? void 0 : description.includes("verify you're human")))) return [3 /*break*/, 5];
                        //verify human
                        return [4 /*yield*/, this.verifyHuman(message)];
                    case 4:
                        //verify human
                        _c.sent();
                        return [2 /*return*/];
                    case 5:
                        if (title === null || title === void 0 ? void 0 : title.includes("Invalid")) {
                            error_1 = new Error(description);
                            this.EventError(id, error_1);
                            return [2 /*return*/];
                        }
                        _c.label = 6;
                    case 6:
                        if (!nonce && (attachments === null || attachments === void 0 ? void 0 : attachments.length) > 0 && (components === null || components === void 0 ? void 0 : components.length) > 0) {
                            this.done(message);
                            return [2 /*return*/];
                        }
                        this.messageUpdate(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    WsMessage.prototype.messageUpdate = function (message) {
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
    WsMessage.prototype.onInteractionSuccess = function (_a) {
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
    WsMessage.prototype.onReady = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.UserId = user.id;
                return [2 /*return*/];
            });
        });
    };
    WsMessage.prototype.onMessageCreate = function (message) {
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
    WsMessage.prototype.onMessageUpdate = function (message) {
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
    WsMessage.prototype.onMessageDelete = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var channel_id, id, waitMjIter, nextEntry, _a, key, value;
            return __generator(this, function (_b) {
                channel_id = message.channel_id, id = message.id;
                if (channel_id !== this.config.ChannelId)
                    return [2 /*return*/];
                waitMjIter = this.waitMjEvents.entries();
                nextEntry = waitMjIter.next();
                while (!nextEntry.done) {
                    _a = nextEntry.value, key = _a[0], value = _a[1];
                    console.log("Key: ".concat(key, ", Value: ").concat(value));
                    if (value.id === id) {
                        this.waitMjEvents.set(key, __assign(__assign({}, value), { del: true }));
                    }
                    nextEntry = waitMjIter.next();
                }
                return [2 /*return*/];
            });
        });
    };
    // parse message from ws
    WsMessage.prototype.parseMessage = function (data) {
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
    //continue click appeal or Acknowledged
    WsMessage.prototype.continue = function (message) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var components, id, flags, nonce, appeal, newnonce, httpStatus;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        components = message.components, id = message.id, flags = message.flags, nonce = message.nonce;
                        appeal = (_a = components[0]) === null || _a === void 0 ? void 0 : _a.components[0];
                        this.log("appeal", appeal);
                        if (!appeal) return [3 /*break*/, 2];
                        newnonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.CustomApi({
                                msgId: id,
                                customId: appeal.custom_id,
                                flags: flags,
                                nonce: newnonce,
                            })];
                    case 1:
                        httpStatus = _b.sent();
                        this.log("appeal.httpStatus", httpStatus);
                        if (httpStatus == 204) {
                            //todo
                            this.on(newnonce, function (data) {
                                _this.emit(nonce, data);
                            });
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WsMessage.prototype.verifyHuman = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var HuggingFaceToken, embeds, components, id, flags, nonce, uri, categories, classify, verifyClient, category, custom_id, newnonce, httpStatus;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        HuggingFaceToken = this.config.HuggingFaceToken;
                        if (HuggingFaceToken === "" || !HuggingFaceToken) {
                            this.log("HuggingFaceToken is empty");
                            return [2 /*return*/];
                        }
                        embeds = message.embeds, components = message.components, id = message.id, flags = message.flags, nonce = message.nonce;
                        uri = embeds[0].image.url;
                        categories = components[0].components;
                        classify = categories.map(function (c) { return c.label; });
                        verifyClient = new verify_human_1.VerifyHuman(this.config);
                        return [4 /*yield*/, verifyClient.verify(uri, classify)];
                    case 1:
                        category = _a.sent();
                        if (!category) return [3 /*break*/, 3];
                        custom_id = categories.find(function (c) { return c.label === category; }).custom_id;
                        newnonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.CustomApi({
                                msgId: id,
                                customId: custom_id,
                                flags: flags,
                                nonce: newnonce,
                            })];
                    case 2:
                        httpStatus = _a.sent();
                        if (httpStatus == 204) {
                            this.on(newnonce, function (data) {
                                _this.emit(nonce, data);
                            });
                        }
                        this.log("verifyHumanApi", httpStatus, custom_id, message.id);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WsMessage.prototype.EventError = function (id, error) {
        var event = this.getEventById(id);
        if (!event) {
            return;
        }
        var eventMsg = {
            error: error,
        };
        this.emit(event.nonce, eventMsg);
    };
    WsMessage.prototype.done = function (message) {
        var content = message.content, id = message.id, attachments = message.attachments, components = message.components, flags = message.flags;
        var _a = attachments[0], url = _a.url, proxy_url = _a.proxy_url, width = _a.width, height = _a.height;
        var uri = url;
        if (this.config.ImageProxy !== "") {
            uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
        }
        var MJmsg = {
            id: id,
            flags: flags,
            content: content,
            hash: (0, utils_1.uriToHash)(url),
            progress: "done",
            uri: uri,
            proxy_url: proxy_url,
            options: (0, utils_1.formatOptions)(components),
            width: width,
            height: height,
        };
        this.filterMessages(MJmsg);
        return;
    };
    WsMessage.prototype.processingImage = function (message) {
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
        var MJmsg = {
            uri: uri,
            proxy_url: attachments[0].proxy_url,
            content: content,
            flags: flags,
            progress: (0, utils_1.content2progress)(content),
        };
        var eventMsg = {
            message: MJmsg,
        };
        this.emitImage(event.nonce, eventMsg);
    };
    WsMessage.prototype.filterMessages = function (MJmsg) {
        return __awaiter(this, void 0, void 0, function () {
            var event, eventMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // delay 300ms for discord message delete
                    return [4 /*yield*/, this.timeout(300)];
                    case 1:
                        // delay 300ms for discord message delete
                        _a.sent();
                        event = this.getEventByContent(MJmsg.content);
                        console.log("Event:", event);
                        if (!event) {
                            this.log("FilterMessages not found", MJmsg, this.waitMjEvents);
                            return [2 /*return*/];
                        }
                        eventMsg = {
                            message: MJmsg,
                        };
                        this.emitImage(event.nonce, eventMsg);
                        return [2 /*return*/];
                }
            });
        });
    };
    WsMessage.prototype.getEventByContent = function (content) {
        var prompt = (0, utils_1.content2prompt)(content);
        //fist del message
        var waitMjIter = this.waitMjEvents.entries();
        var nextEntry1 = waitMjIter.next();
        while (!nextEntry1.done) {
            var _a = nextEntry1.value, key = _a[0], value = _a[1];
            console.log("Key: ".concat(key, ", Value: ").concat(value));
            if (value.del === true &&
                prompt === (0, utils_1.content2prompt)(value.prompt)) {
                return value;
            }
            nextEntry1 = waitMjIter.next();
        }
        var nextEntry2 = waitMjIter.next();
        while (!nextEntry2.done) {
            var _b = nextEntry2.value, key = _b[0], value = _b[1];
            if (prompt === (0, utils_1.content2prompt)(value.prompt)) {
                return value;
            }
            nextEntry2 = waitMjIter.next();
        }
    };
    WsMessage.prototype.getEventById = function (id) {
        var waitMjIter = this.waitMjEvents.entries();
        var nextEntry = waitMjIter.next();
        while (!nextEntry.done) {
            var _a = nextEntry.value, key = _a[0], value = _a[1];
            console.log("Key: ".concat(key, ", Value: ").concat(value));
            if (value.id === id) {
                return value;
            }
            nextEntry = waitMjIter.next();
        }
    };
    WsMessage.prototype.getEventByNonce = function (nonce) {
        var waitMjIter = this.waitMjEvents.entries();
        var nextEntry = waitMjIter.next();
        while (!nextEntry.done) {
            var _a = nextEntry.value, key = _a[0], value = _a[1];
            console.log("Key: ".concat(key, ", Value: ").concat(value));
            if (value.nonce === nonce) {
                return value;
            }
            nextEntry = waitMjIter.next();
        }
    };
    WsMessage.prototype.updateMjEventIdByNonce = function (id, nonce) {
        if (nonce === "" || id === "")
            return;
        var event = this.waitMjEvents.get(nonce);
        if (!event)
            return;
        event.id = id;
        this.log("updateMjEventIdByNonce success", this.waitMjEvents.get(nonce));
    };
    WsMessage.prototype.log = function () {
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
    WsMessage.prototype.emit = function (event, message) {
        this.event
            .filter(function (e) { return e.event === event; })
            .forEach(function (e) { return e.callback(message); });
    };
    WsMessage.prototype.emitImage = function (type, message) {
        this.emit(type, message);
    };
    //FIXME: emitMJ rename
    WsMessage.prototype.emitMJ = function (id, data) {
        var event = this.getEventById(id);
        if (!event)
            return;
        this.emit(event.nonce, data);
    };
    WsMessage.prototype.on = function (event, callback) {
        this.event.push({ event: event, callback: callback });
    };
    WsMessage.prototype.onSystem = function (event, callback) {
        this.on(event, callback);
    };
    WsMessage.prototype.emitSystem = function (type, message) {
        this.emit(type, message);
    };
    WsMessage.prototype.once = function (event, callback) {
        var _this = this;
        var once = function (message) {
            _this.remove(event, once);
            callback(message);
        };
        this.event.push({ event: event, callback: once });
    };
    WsMessage.prototype.remove = function (event, callback) {
        this.event = this.event.filter(function (e) { return e.event !== event && e.callback !== callback; });
    };
    WsMessage.prototype.removeEvent = function (event) {
        this.event = this.event.filter(function (e) { return e.event !== event; });
    };
    //FIXME: USE ONCE
    WsMessage.prototype.onceInfo = function (callback) {
        var _this = this;
        var once = function (message) {
            _this.remove("info", once);
            callback(message);
        };
        this.event.push({ event: "info", callback: once });
    };
    //FIXME: USE ONCE
    WsMessage.prototype.onceSettings = function (callback) {
        var _this = this;
        var once = function (message) {
            _this.remove("settings", once);
            callback(message);
        };
        this.event.push({ event: "settings", callback: once });
    };
    WsMessage.prototype.onceMJ = function (nonce, callback) {
        var _this = this;
        var once = function (message) {
            _this.remove(nonce, once);
            //FIXME: removeWaitMjEvent
            _this.removeWaitMjEvent(nonce);
            callback(message);
        };
        //FIXME: addWaitMjEvent
        this.waitMjEvents.set(nonce, { nonce: nonce });
        this.event.push({ event: nonce, callback: once });
    };
    WsMessage.prototype.removeSkipMessageId = function (messageId) {
        var index = this.skipMessageId.findIndex(function (id) { return id !== messageId; });
        if (index !== -1) {
            this.skipMessageId.splice(index, 1);
        }
    };
    WsMessage.prototype.removeWaitMjEvent = function (nonce) {
        this.waitMjEvents.delete(nonce);
    };
    WsMessage.prototype.onceImage = function (nonce, callback) {
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
    WsMessage.prototype.waitImageMessage = function (_a) {
        var nonce = _a.nonce, prompt = _a.prompt, imageUri = _a.imageUri, idname = _a.idname, onmodal = _a.onmodal, messageId = _a.messageId, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (messageId)
                    this.skipMessageId.push(messageId);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var handleImageMessage = function (_a) {
                            var message = _a.message, error = _a.error;
                            if (error) {
                                _this.removeWaitMjEvent(nonce);
                                reject(error);
                                return;
                            }
                            if (message && message.progress === "done") {
                                _this.removeWaitMjEvent(nonce);
                                messageId && _this.removeSkipMessageId(messageId);
                                resolve(message);
                                return;
                            }
                            message && loading && loading(message.uri, message.progress || "");
                        };
                        if (prompt) {
                            console.log("This is waitMjEvents", _this.waitMjEvents);
                            _this.waitMjEvents.set(nonce, {
                                nonce: nonce,
                                prompt: prompt + " " + nonce,
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
                                                this.removeWaitMjEvent(oldnonce);
                                                this.waitMjEvents.set(nonce, { nonce: nonce });
                                                this.onceImage(nonce, handleImageMessage);
                                                return [2 /*return*/, nonce];
                                        }
                                    });
                                }); },
                            });
                        }
                        if (idname) {
                            _this.waitMjEvents.set(nonce, {
                                nonce: nonce,
                                idname: idname,
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
                                                this.removeWaitMjEvent(oldnonce);
                                                this.waitMjEvents.set(nonce, { nonce: nonce });
                                                this.onceImage(nonce, handleImageMessage);
                                                return [2 /*return*/, nonce];
                                        }
                                    });
                                }); },
                            });
                        }
                        _this.onceImage(nonce, handleImageMessage);
                    })];
            });
        });
    };
    WsMessage.prototype.waitDescribe = function (nonce) {
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
    WsMessage.prototype.waitShorten = function (nonce) {
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
    WsMessage.prototype.waitContent = function (event) {
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
    WsMessage.prototype.waitInfo = function () {
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
    WsMessage.prototype.waitSettings = function () {
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
    return WsMessage;
}());
exports.WsMessage = WsMessage;
