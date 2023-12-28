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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Midjourney = void 0;
var interfaces_1 = require("./interfaces");
var midjourney_api_1 = require("./midjourney.api");
var discord_message_1 = require("./discord.message");
var utils_1 = require("./utils");
var discord_ws_1 = require("./discord.ws");
var Midjourney = /** @class */ (function (_super) {
    __extends(Midjourney, _super);
    function Midjourney(defaults) {
        var _this = this;
        var SalaiToken = defaults.SalaiToken;
        if (!SalaiToken) {
            throw new Error("SalaiToken are required");
        }
        _this = _super.call(this, defaults) || this;
        _this.config = __assign(__assign({}, interfaces_1.DefaultMJConfig), defaults);
        _this.MJApi = new midjourney_api_1.MidjourneyApi(_this.config);
        return _this;
    }
    Midjourney.prototype.Connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.Ws) {
                            return [2 /*return*/, this];
                        }
                        if (!this.config.ServerId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.MJApi.getCommand("settings")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.MJApi.allCommand()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.wsClient)
                            return [2 /*return*/, this];
                        this.wsClient = new discord_ws_1.WsMessage(this.config, this.MJApi);
                        return [4 /*yield*/, this.wsClient.onceReady()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Midjourney.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, remix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.Settings()];
                    case 2:
                        settings = _a.sent();
                        if (settings) {
                            remix = settings.options.find(function (o) { return o.label === "Remix mode"; });
                            if ((remix === null || remix === void 0 ? void 0 : remix.style) == 3) {
                                this.config.Remix = true;
                                this.log("Remix mode enabled");
                            }
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Midjourney.prototype.Imagine = function (prompt, loading) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, nonce, httpStatus, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = prompt.trim();
                        if (!!this.config.Ws) return [3 /*break*/, 1];
                        seed = (0, utils_1.random)(1000000000, 9999999999);
                        prompt = "[".concat(seed, "] ").concat(prompt);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getWsClient()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        nonce = (0, utils_1.nextNonce)();
                        this.log("Imagine", prompt, "nonce", nonce);
                        return [4 /*yield*/, this.MJApi.ImagineApi(prompt, nonce)];
                    case 4:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("ImagineApi failed with status ".concat(httpStatus));
                        }
                        if (!this.wsClient) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.wsClient.waitImageMessage({ nonce: nonce, loading: loading, prompt: prompt })];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        this.log("await generate image");
                        return [4 /*yield*/, this.WaitMessage(prompt, loading)];
                    case 7:
                        msg = _a.sent();
                        this.log("image generated", prompt, msg === null || msg === void 0 ? void 0 : msg.uri);
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    // check ws enabled && connect
    Midjourney.prototype.getWsClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.Ws) {
                            throw new Error("ws not enabled");
                        }
                        if (!!this.wsClient) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.wsClient) {
                            throw new Error("ws not connected");
                        }
                        return [2 /*return*/, this.wsClient];
                }
            });
        });
    };
    Midjourney.prototype.Settings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.SettingsApi(nonce)];
                    case 2:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("ImagineApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitSettings()];
                }
            });
        });
    };
    Midjourney.prototype.Reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, reset, httpstatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Settings()];
                    case 1:
                        settings = _a.sent();
                        if (!settings) {
                            throw new Error("Settings not found");
                        }
                        reset = settings.options.find(function (o) { return o.label === "Reset Settings"; });
                        if (!reset) {
                            throw new Error("Reset Settings not found");
                        }
                        return [4 /*yield*/, this.MJApi.CustomApi({
                                msgId: settings.id,
                                customId: reset.custom,
                                flags: settings.flags,
                            })];
                    case 2:
                        httpstatus = _a.sent();
                        if (httpstatus !== 204) {
                            throw new Error("Reset failed with status ".concat(httpstatus));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Midjourney.prototype.Info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.InfoApi(nonce)];
                    case 2:
                        httpStatus = _a.sent();
                        console.log(httpStatus);
                        if (httpStatus !== 204) {
                            throw new Error("InfoApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitInfo()];
                }
            });
        });
    };
    Midjourney.prototype.Fast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.FastApi(nonce)];
                    case 1:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("FastApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Midjourney.prototype.Relax = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.RelaxApi(nonce)];
                    case 1:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("RelaxApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Midjourney.prototype.SwitchRemix = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.SwitchRemixApi(nonce)];
                    case 2:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("RelaxApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitContent("prefer-remix")];
                }
            });
        });
    };
    Midjourney.prototype.Describe = function (imgUri) {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, DcImage, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.UploadImageByUri(imgUri)];
                    case 2:
                        DcImage = _a.sent();
                        this.log("Describe", DcImage);
                        return [4 /*yield*/, this.MJApi.DescribeApi(DcImage, nonce)];
                    case 3:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("DescribeApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitDescribe(nonce)];
                }
            });
        });
    };
    Midjourney.prototype.DescribeByBlob = function (blob) {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, DcImage, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.UploadImageByBole(blob)];
                    case 2:
                        DcImage = _a.sent();
                        this.log("Describe", DcImage);
                        return [4 /*yield*/, this.MJApi.DescribeApi(DcImage, nonce)];
                    case 3:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("DescribeApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitDescribe(nonce)];
                }
            });
        });
    };
    Midjourney.prototype.Shorten = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var wsClient, nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        wsClient = _a.sent();
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.ShortenApi(prompt, nonce)];
                    case 2:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("ShortenApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/, wsClient.waitShorten(nonce)];
                }
            });
        });
    };
    Midjourney.prototype.Variation = function (_a) {
        var index = _a.index, msgId = _a.msgId, hash = _a.hash, content = _a.content, flags = _a.flags, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Custom({
                            customId: "MJ::JOB::variation::".concat(index, "::").concat(hash),
                            msgId: msgId,
                            content: content,
                            flags: flags,
                            loading: loading,
                        })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Midjourney.prototype.Upscale = function (_a) {
        var index = _a.index, msgId = _a.msgId, hash = _a.hash, content = _a.content, flags = _a.flags, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Custom({
                            customId: "MJ::JOB::upsample::".concat(index, "::").concat(hash),
                            msgId: msgId,
                            content: content,
                            flags: flags,
                            loading: loading,
                        })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Midjourney.prototype.Custom = function (_a) {
        var msgId = _a.msgId, customId = _a.customId, content = _a.content, flags = _a.flags, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var nonce, httpStatus;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.config.Ws) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getWsClient()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.CustomApi({
                                msgId: msgId,
                                customId: customId,
                                flags: flags,
                                nonce: nonce,
                            })];
                    case 3:
                        httpStatus = _b.sent();
                        if (httpStatus !== 204) {
                            throw new Error("CustomApi failed with status ".concat(httpStatus));
                        }
                        if (!this.wsClient) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.wsClient.waitImageMessage({
                                nonce: nonce,
                                loading: loading,
                                messageId: msgId,
                                prompt: content,
                                onmodal: function (nonde, id) { return __awaiter(_this, void 0, void 0, function () {
                                    var newNonce, _a, httpStatus_1, remixHttpStatus;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (content === undefined || content === "") {
                                                    return [2 /*return*/, ""];
                                                }
                                                newNonce = (0, utils_1.nextNonce)();
                                                _a = (0, utils_1.custom2Type)(customId);
                                                switch (_a) {
                                                    case "customZoom": return [3 /*break*/, 1];
                                                    case "variation": return [3 /*break*/, 3];
                                                }
                                                return [3 /*break*/, 5];
                                            case 1: return [4 /*yield*/, this.MJApi.CustomZoomImagineApi({
                                                    msgId: id,
                                                    customId: customId,
                                                    prompt: content,
                                                    nonce: newNonce,
                                                })];
                                            case 2:
                                                httpStatus_1 = _b.sent();
                                                if (httpStatus_1 !== 204) {
                                                    throw new Error("CustomZoomImagineApi failed with status ".concat(httpStatus_1));
                                                }
                                                return [2 /*return*/, newNonce];
                                            case 3:
                                                if (this.config.Remix !== true) {
                                                    return [2 /*return*/, ""];
                                                }
                                                customId = (0, utils_1.toRemixCustom)(customId);
                                                return [4 /*yield*/, this.MJApi.RemixApi({
                                                        msgId: id,
                                                        customId: customId,
                                                        prompt: content,
                                                        nonce: newNonce,
                                                    })];
                                            case 4:
                                                remixHttpStatus = _b.sent();
                                                if (remixHttpStatus !== 204) {
                                                    throw new Error("RemixApi failed with status ".concat(remixHttpStatus));
                                                }
                                                return [2 /*return*/, newNonce];
                                            case 5: return [2 /*return*/, ""];
                                        }
                                    });
                                }); },
                            })];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        if (content === undefined || content === "") {
                            throw new Error("content is required");
                        }
                        return [4 /*yield*/, this.WaitMessage(content, loading)];
                    case 6: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Midjourney.prototype.ZoomOut = function (_a) {
        var level = _a.level, msgId = _a.msgId, hash = _a.hash, content = _a.content, flags = _a.flags, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            var customId;
            return __generator(this, function (_b) {
                switch (level) {
                    case "high":
                        customId = "MJ::JOB::high_variation::1::".concat(hash, "::SOLO");
                        break;
                    case "low":
                        customId = "MJ::JOB::low_variation::1::".concat(hash, "::SOLO");
                        break;
                    case "2x":
                        customId = "MJ::Outpaint::50::1::".concat(hash, "::SOLO");
                        break;
                    case "1.5x":
                        customId = "MJ::Outpaint::75::1::".concat(hash, "::SOLO");
                        break;
                }
                return [2 /*return*/, this.Custom({
                        msgId: msgId,
                        customId: customId,
                        content: content,
                        flags: flags,
                        loading: loading,
                    })];
            });
        });
    };
    Midjourney.prototype.Reroll = function (_a) {
        var msgId = _a.msgId, hash = _a.hash, content = _a.content, flags = _a.flags, loading = _a.loading;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Custom({
                            customId: "MJ::JOB::reroll::0::".concat(hash, "::SOLO"),
                            msgId: msgId,
                            content: content,
                            flags: flags,
                            loading: loading,
                        })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Midjourney.prototype.Close = function () {
        if (this.wsClient) {
            this.wsClient.close();
            this.wsClient = undefined;
        }
    };
    return Midjourney;
}(discord_message_1.MidjourneyMessage));
exports.Midjourney = Midjourney;
