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
exports.IFS = void 0;
var interfaces_1 = require("./interfaces");
var midjourney_api_1 = require("./midjourney.api");
var insightfaceswap_api_1 = require("./insightfaceswap.api");
var utils_1 = require("./utils");
var discord_ifsws_1 = require("./discord.ifsws");
var discord_ifsmessage_1 = require("./discord.ifsmessage");
var IFS = /** @class */ (function (_super) {
    __extends(IFS, _super);
    function IFS(defaults) {
        var _this = this;
        var SalaiToken = defaults.SalaiToken;
        if (!SalaiToken) {
            throw new Error("SalaiToken are required");
        }
        _this = _super.call(this, defaults) || this;
        _this.config = __assign(__assign({}, interfaces_1.DefaultMJConfig), defaults);
        _this.MJApi = new midjourney_api_1.MidjourneyApi(_this.config);
        _this.IFSApi = new insightfaceswap_api_1.InsightFaceSwapApi(_this.config);
        return _this;
    }
    IFS.prototype.Connect = function () {
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
                        this.wsClient = new discord_ifsws_1.IFSWsMessage(this.config, this.IFSApi);
                        return [4 /*yield*/, this.wsClient.onceReady()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    IFS.prototype.init = function () {
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
    IFS.prototype.SaveId = function (imageUri, loading) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, nonce, DcImage, nonceid, rid, saveIdRes, httpStatus, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.config.Ws) return [3 /*break*/, 1];
                        seed = (0, utils_1.random)(1000000000, 9999999999);
                        imageUri = "[".concat(seed, "] ").concat(imageUri);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getWsClient()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        nonce = (0, utils_1.nextNonce)();
                        return [4 /*yield*/, this.MJApi.UploadImageByUri(imageUri)];
                    case 4:
                        DcImage = _a.sent();
                        nonceid = nonce.split(' ')[0];
                        console.log("This is nonceid", nonceid);
                        rid = "".concat(Math.trunc(Math.random() * 10000000000));
                        //const rid = '4997180084';
                        this.log("SaveId", rid, DcImage, "nonce", nonce);
                        saveIdRes = "idname ".concat(rid, " created");
                        return [4 /*yield*/, this.IFSApi.saveIdApi(rid, DcImage, nonce)];
                    case 5:
                        httpStatus = _a.sent();
                        //console.log(httpStatus);
                        if (httpStatus !== 204) {
                            throw new Error("savedIdApi failed with status ".concat(httpStatus));
                        }
                        if (!this.wsClient) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.wsClient.waitSaveIdMessage({ nonce: nonce, rid: rid, saveidres: saveIdRes, loading: loading })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        this.log("await generate image");
                        return [4 /*yield*/, this.WaitIFSMessage(saveIdRes, loading)];
                    case 8:
                        msg = _a.sent();
                        this.log("image generated", imageUri);
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    IFS.prototype.SwapId = function (imageUri, rid, loading) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, nonce, regex, match, DcImage, httpStatus, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.config.Ws) return [3 /*break*/, 1];
                        seed = (0, utils_1.random)(1000000000, 9999999999);
                        imageUri = "[".concat(seed, "] ").concat(imageUri);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getWsClient()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        nonce = (0, utils_1.nextNonce)();
                        regex = /^(.*\.(png|jpg))/;
                        match = imageUri.match(regex);
                        if (match && match[1]) {
                            // Return the part of the URL up to the .png or .jpg
                            imageUri = match[1];
                        }
                        else {
                            // Return the original URL if no match is found (or if it doesn't end with .png)
                            imageUri = imageUri;
                        }
                        console.log(imageUri);
                        return [4 /*yield*/, this.MJApi.UploadImageByUri(imageUri)];
                    case 4:
                        DcImage = _a.sent();
                        this.log("SwapId", rid, DcImage, "nonce", nonce);
                        return [4 /*yield*/, this.IFSApi.swapIdApi(rid, DcImage, nonce)];
                    case 5:
                        httpStatus = _a.sent();
                        //console.log(httpStatus);
                        if (httpStatus !== 204) {
                            throw new Error("swapIdApi failed with status ".concat(httpStatus));
                        }
                        if (!this.wsClient) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.wsClient.waitSwapIdMessage({ nonce: nonce, loading: loading, rid: rid })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        this.log("await generate image");
                        return [4 /*yield*/, this.WaitSwapIdMessage(imageUri, loading)];
                    case 8:
                        msg = _a.sent();
                        this.log("image generated", imageUri);
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    IFS.prototype.delId = function (idname) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, httpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = (0, utils_1.nextNonce)();
                        this.log("DelId", idname, "nonce", nonce);
                        return [4 /*yield*/, this.IFSApi.delIdApi(idname, nonce)];
                    case 1:
                        httpStatus = _a.sent();
                        if (httpStatus !== 204) {
                            throw new Error("delIdApi failed with status ".concat(httpStatus));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // check ws enabled && connect
    IFS.prototype.getWsClient = function () {
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
    IFS.prototype.Settings = function () {
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
    IFS.prototype.Reset = function () {
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
    IFS.prototype.Info = function () {
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
    IFS.prototype.Fast = function () {
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
    IFS.prototype.Relax = function () {
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
    IFS.prototype.Close = function () {
        if (this.wsClient) {
            this.wsClient.close();
            this.wsClient = undefined;
        }
    };
    return IFS;
}(discord_ifsmessage_1.IFSDiscordMessage));
exports.IFS = IFS;
