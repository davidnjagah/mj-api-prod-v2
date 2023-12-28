"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidjourneyApi = void 0;
var interfaces_1 = require("./interfaces");
var utils_1 = require("./utils");
var command_1 = require("./command");
var async = require("async");
var MidjourneyApi = /** @class */ (function (_super) {
    __extends(MidjourneyApi, _super);
    function MidjourneyApi(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        _this.UpId = Date.now() % 10; // upload id
        _this.safeIteractions = function (request) {
            return new Promise(function (resolve, reject) {
                _this.queue.push({
                    request: request,
                    callback: function (any) {
                        resolve(any);
                    },
                }, function (error, result) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        };
        _this.processRequest = function (_a) {
            var request = _a.request, callback = _a.callback;
            return __awaiter(_this, void 0, void 0, function () {
                var httpStatus;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.interactions(request)];
                        case 1:
                            httpStatus = _b.sent();
                            callback(httpStatus);
                            return [4 /*yield*/, (0, utils_1.sleep)(this.config.ApiInterval)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        _this.queue = async.queue(_this.processRequest, 1);
        _this.interactions = function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var headers, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        headers = {
                            "Content-Type": "application/json",
                            Authorization: this.config.SalaiToken,
                        };
                        return [4 /*yield*/, this.config.fetch("".concat(this.config.DiscordBaseUrl, "/api/v9/interactions"), {
                                method: "POST",
                                body: JSON.stringify(payload),
                                headers: headers,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.status >= 400) {
                            console.error("api.error.config", {
                                payload: JSON.stringify(payload),
                                config: this.config,
                            });
                        }
                        return [2 /*return*/, response.status];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, 500];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    MidjourneyApi.prototype.ImagineApi = function (prompt, nonce) {
        if (nonce === void 0) { nonce = (0, utils_1.nextNonce)(); }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imaginePayload(prompt, nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.saveIdApi = function (idname, image, nonce) {
        if (nonce === void 0) { nonce = (0, utils_1.nextNonce)(); }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveIdPayload(idname, image, nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.swapIdApi = function (idname, image, nonce) {
        if (nonce === void 0) { nonce = (0, utils_1.nextNonce)(); }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.swapIdPayload(idname, image, nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.SwitchRemixApi = function (nonce) {
        if (nonce === void 0) { nonce = (0, utils_1.nextNonce)(); }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.PreferPayload(nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.ShortenApi = function (prompt, nonce) {
        if (nonce === void 0) { nonce = (0, utils_1.nextNonce)(); }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shortenPayload(prompt, nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.VariationApi = function (_a) {
        var index = _a.index, msgId = _a.msgId, hash = _a.hash, _b = _a.nonce, nonce = _b === void 0 ? (0, utils_1.nextNonce)() : _b, _c = _a.flags, flags = _c === void 0 ? 0 : _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                return [2 /*return*/, this.CustomApi({
                        msgId: msgId,
                        customId: "MJ::JOB::variation::".concat(index, "::").concat(hash),
                        flags: flags,
                        nonce: nonce,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.UpscaleApi = function (_a) {
        var index = _a.index, msgId = _a.msgId, hash = _a.hash, _b = _a.nonce, nonce = _b === void 0 ? (0, utils_1.nextNonce)() : _b, flags = _a.flags;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                console.log("variables in upscale:", msgId, index, hash, flags, nonce);
                return [2 /*return*/, this.CustomApi({
                        msgId: msgId,
                        customId: "MJ::JOB::upsample::".concat(index, "::").concat(hash),
                        flags: flags,
                        nonce: nonce,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.RerollApi = function (_a) {
        var msgId = _a.msgId, hash = _a.hash, _b = _a.nonce, nonce = _b === void 0 ? (0, utils_1.nextNonce)() : _b, flags = _a.flags;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this.CustomApi({
                        msgId: msgId,
                        customId: "MJ::JOB::reroll::0::".concat(hash, "::SOLO"),
                        flags: flags,
                        nonce: nonce,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.CustomApi = function (_a) {
        var msgId = _a.msgId, customId = _a.customId, flags = _a.flags, _b = _a.nonce, nonce = _b === void 0 ? (0, utils_1.nextNonce)() : _b;
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_c) {
                if (!msgId)
                    throw new Error("msgId is empty");
                if (flags === undefined)
                    throw new Error("flags is undefined");
                payload = {
                    type: 3,
                    nonce: nonce,
                    guild_id: this.config.ServerId,
                    channel_id: this.config.ChannelId,
                    message_flags: flags,
                    message_id: msgId,
                    application_id: this.config.BotId,
                    session_id: this.config.SessionId,
                    data: {
                        component_type: 2,
                        custom_id: customId,
                    },
                };
                console.log("This is the payload:", payload);
                return [2 /*return*/, this.safeIteractions(payload)];
            });
        });
    };
    //FIXME: get SubmitCustomId from discord api
    MidjourneyApi.prototype.ModalSubmitApi = function (_a) {
        var nonce = _a.nonce, msgId = _a.msgId, customId = _a.customId, prompt = _a.prompt, submitCustomId = _a.submitCustomId;
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_b) {
                payload = {
                    type: 5,
                    application_id: this.config.BotId,
                    channel_id: this.config.ChannelId,
                    guild_id: this.config.ServerId,
                    data: {
                        id: msgId,
                        custom_id: customId,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 4,
                                        custom_id: submitCustomId,
                                        value: prompt,
                                    },
                                ],
                            },
                        ],
                    },
                    session_id: this.config.SessionId,
                    nonce: nonce,
                };
                console.log("submitCustomId", JSON.stringify(payload));
                return [2 /*return*/, this.safeIteractions(payload)];
            });
        });
    };
    MidjourneyApi.prototype.RemixApi = function (_a) {
        var nonce = _a.nonce, msgId = _a.msgId, customId = _a.customId, prompt = _a.prompt;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.ModalSubmitApi({
                        nonce: nonce,
                        msgId: msgId,
                        customId: customId,
                        prompt: prompt,
                        submitCustomId: interfaces_1.RemixModalSubmitID,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.ShortenImagineApi = function (_a) {
        var nonce = _a.nonce, msgId = _a.msgId, customId = _a.customId, prompt = _a.prompt;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.ModalSubmitApi({
                        nonce: nonce,
                        msgId: msgId,
                        customId: customId,
                        prompt: prompt,
                        submitCustomId: interfaces_1.ShortenModalSubmitID,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.DescribeImagineApi = function (_a) {
        var nonce = _a.nonce, msgId = _a.msgId, customId = _a.customId, prompt = _a.prompt;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.ModalSubmitApi({
                        nonce: nonce,
                        msgId: msgId,
                        customId: customId,
                        prompt: prompt,
                        submitCustomId: interfaces_1.DescribeModalSubmitID,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.CustomZoomImagineApi = function (_a) {
        var nonce = _a.nonce, msgId = _a.msgId, customId = _a.customId, prompt = _a.prompt;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                customId = customId.replace("MJ::CustomZoom", "MJ::OutpaintCustomZoomModal");
                return [2 /*return*/, this.ModalSubmitApi({
                        nonce: nonce,
                        msgId: msgId,
                        customId: customId,
                        prompt: prompt,
                        submitCustomId: interfaces_1.CustomZoomModalSubmitID,
                    })];
            });
        });
    };
    MidjourneyApi.prototype.InfoApi = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.infoPayload(nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.SettingsApi = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsPayload(nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.FastApi = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fastPayload(nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.RelaxApi = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.relaxPayload(nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    /**
     *
     * @param fileUrl http file path
     * @returns
     */
    MidjourneyApi.prototype.UploadImageByUri = function (fileUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, fileData, mimeType, filename, file_size, attachments, UploadSlot, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.config.fetch(fileUrl)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        fileData = _a.sent();
                        mimeType = response.headers.get("content-type");
                        filename = fileUrl.split("/").pop() || "image.png";
                        file_size = fileData.byteLength;
                        if (!mimeType) {
                            throw new Error("Unknown mime type");
                        }
                        return [4 /*yield*/, this.attachments({
                                filename: filename,
                                file_size: file_size,
                                id: this.UpId++,
                            })];
                    case 3:
                        attachments = (_a.sent()).attachments;
                        UploadSlot = attachments[0];
                        return [4 /*yield*/, this.uploadImage(UploadSlot, fileData, mimeType)];
                    case 4:
                        _a.sent();
                        resp = {
                            id: UploadSlot.id,
                            filename: UploadSlot.upload_filename.split("/").pop() || "image.png",
                            upload_filename: UploadSlot.upload_filename,
                        };
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    MidjourneyApi.prototype.UploadImageByBole = function (blob, filename) {
        if (filename === void 0) { filename = (0, utils_1.nextNonce)() + ".png"; }
        return __awaiter(this, void 0, void 0, function () {
            var fileData, mimeType, file_size, attachments, UploadSlot, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blob.arrayBuffer()];
                    case 1:
                        fileData = _a.sent();
                        mimeType = blob.type;
                        file_size = fileData.byteLength;
                        if (!mimeType) {
                            throw new Error("Unknown mime type");
                        }
                        return [4 /*yield*/, this.attachments({
                                filename: filename,
                                file_size: file_size,
                                id: this.UpId++,
                            })];
                    case 2:
                        attachments = (_a.sent()).attachments;
                        UploadSlot = attachments[0];
                        return [4 /*yield*/, this.uploadImage(UploadSlot, fileData, mimeType)];
                    case 3:
                        _a.sent();
                        resp = {
                            id: UploadSlot.id,
                            filename: UploadSlot.upload_filename.split("/").pop() || "image.png",
                            upload_filename: UploadSlot.upload_filename,
                        };
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    /**
     * prepare an attachement to upload an image.
     */
    MidjourneyApi.prototype.attachments = function () {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, SalaiToken, DiscordBaseUrl, ChannelId, headers, url, body, response, error, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.config, SalaiToken = _a.SalaiToken, DiscordBaseUrl = _a.DiscordBaseUrl, ChannelId = _a.ChannelId;
                        headers = {
                            Authorization: SalaiToken,
                            "content-type": "application/json",
                        };
                        url = new URL("".concat(DiscordBaseUrl, "/api/v9/channels/").concat(ChannelId, "/attachments"));
                        body = { files: files };
                        return [4 /*yield*/, this.config.fetch(url, {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        response = _d.sent();
                        if (!(response.status === 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, (_d.sent())];
                    case 3:
                        _c = (_b = "Attachments return ".concat(response.status, " ").concat(response.statusText, " ")).concat;
                        return [4 /*yield*/, response.text()];
                    case 4:
                        error = _c.apply(_b, [_d.sent()]);
                        throw new Error(error);
                }
            });
        });
    };
    MidjourneyApi.prototype.uploadImage = function (slot, data, contentType) {
        return __awaiter(this, void 0, void 0, function () {
            var body, headers, response, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        body = new Uint8Array(data);
                        headers = { "content-type": contentType };
                        return [4 /*yield*/, this.config.fetch(slot.upload_url, {
                                method: "PUT",
                                headers: headers,
                                body: body,
                            })];
                    case 1:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = Error.bind;
                        _c = (_b = "uploadImage return ".concat(response.status, " ").concat(response.statusText, " ")).concat;
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_d.sent()])]))();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MidjourneyApi.prototype.DescribeApi = function (image, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.describePayload(image, nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, this.safeIteractions(payload)];
                }
            });
        });
    };
    MidjourneyApi.prototype.upImageApi = function (image, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, SalaiToken, DiscordBaseUrl, ChannelId, fetch, payload, url, headers, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.config, SalaiToken = _a.SalaiToken, DiscordBaseUrl = _a.DiscordBaseUrl, ChannelId = _a.ChannelId, fetch = _a.fetch;
                        payload = {
                            content: "",
                            nonce: nonce,
                            channel_id: ChannelId,
                            type: 0,
                            sticker_ids: [],
                            attachments: [image],
                        };
                        url = new URL("".concat(DiscordBaseUrl, "/api/v9/channels/").concat(ChannelId, "/messages"));
                        headers = {
                            Authorization: SalaiToken,
                            "content-type": "application/json",
                        };
                        return [4 /*yield*/, fetch(url, {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify(payload),
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.status];
                }
            });
        });
    };
    return MidjourneyApi;
}(command_1.Command));
exports.MidjourneyApi = MidjourneyApi;
