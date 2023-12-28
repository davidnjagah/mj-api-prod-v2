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
exports.MidjourneyMessage = void 0;
var interfaces_1 = require("./interfaces");
var utils_1 = require("./utils");
var async = require("async");
var MidjourneyMessage = /** @class */ (function () {
    function MidjourneyMessage(defaults) {
        var _this = this;
        this.safeRetrieveMessages = function (request) {
            if (request === void 0) { request = 50; }
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
        this.processRequest = function (_a) {
            var request = _a.request, callback = _a.callback;
            return __awaiter(_this, void 0, void 0, function () {
                var httpStatus;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.RetrieveMessages(request)];
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
        this.queue = async.queue(this.processRequest, 1);
        var SalaiToken = defaults.SalaiToken;
        if (!SalaiToken) {
            throw new Error("SalaiToken are required");
        }
        this.config = __assign(__assign({}, interfaces_1.DefaultMJConfig), defaults);
    }
    MidjourneyMessage.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.config.Debug && console.log.apply(console, __spreadArray(__spreadArray([], args, false), [new Date().toISOString()], false));
    };
    MidjourneyMessage.prototype.FilterMessages = function (timestamp, prompt, loading) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var seed, data, i, item, itemTimestamp, uri, progress, content, _b, proxy_url, width, height, msg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        seed = (_a = prompt.match(/\[(.*?)\]/)) === null || _a === void 0 ? void 0 : _a[1];
                        this.log("seed:", seed);
                        return [4 /*yield*/, this.safeRetrieveMessages(this.config.Limit)];
                    case 1:
                        data = _c.sent();
                        for (i = 0; i < data.length; i++) {
                            item = data[i];
                            if (item.author.id === this.config.BotId &&
                                item.content.includes("".concat(seed))) {
                                itemTimestamp = new Date(item.timestamp).getTime();
                                if (itemTimestamp < timestamp) {
                                    this.log("old message");
                                    continue;
                                }
                                if (item.attachments.length === 0) {
                                    this.log("no attachment");
                                    break;
                                }
                                uri = item.attachments[0].url;
                                if (this.config.ImageProxy !== "") {
                                    uri = uri.replace("https://cdn.discordapp.com/", this.config.ImageProxy);
                                } //waiting
                                if (item.attachments[0].filename.startsWith("grid") ||
                                    item.components.length === 0) {
                                    this.log("content", item.content);
                                    progress = this.content2progress(item.content);
                                    loading === null || loading === void 0 ? void 0 : loading(uri, progress);
                                    break;
                                }
                                content = item.content.split("**")[1];
                                _b = item.attachments[0], proxy_url = _b.proxy_url, width = _b.width, height = _b.height;
                                msg = {
                                    content: content,
                                    id: item.id,
                                    uri: uri,
                                    proxy_url: proxy_url,
                                    flags: item.flags,
                                    hash: this.UriToHash(uri),
                                    progress: "done",
                                    options: (0, utils_1.formatOptions)(item.components),
                                    width: width,
                                    height: height,
                                };
                                return [2 /*return*/, msg];
                            }
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    MidjourneyMessage.prototype.content2progress = function (content) {
        var spcon = content.split("**");
        if (spcon.length < 3) {
            return "";
        }
        content = spcon[2];
        var regex = /\(([^)]+)\)/; // matches the value inside the first parenthesis
        var match = content.match(regex);
        var progress = "";
        if (match) {
            progress = match[1];
        }
        return progress;
    };
    MidjourneyMessage.prototype.UriToHash = function (uri) {
        var _a, _b;
        return (_b = (_a = uri.split("_").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) !== null && _b !== void 0 ? _b : "";
    };
    MidjourneyMessage.prototype.WaitMessage = function (prompt, loading, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var i, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.config.MaxWait)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.FilterMessages(timestamp, prompt, loading)];
                    case 2:
                        msg = _a.sent();
                        if (msg !== null) {
                            return [2 /*return*/, msg];
                        }
                        this.log(i, "wait no message found");
                        return [4 /*yield*/, (0, utils_1.sleep)(1000 * 2)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    MidjourneyMessage.prototype.WaitSaveIdMessage = function (saveid, loading, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var i, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.config.MaxWait)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.FilterMessages(timestamp, saveid, loading)];
                    case 2:
                        msg = _a.sent();
                        if (msg !== null) {
                            return [2 /*return*/, msg];
                        }
                        this.log(i, "wait no message found");
                        return [4 /*yield*/, (0, utils_1.sleep)(1000 * 2)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    MidjourneyMessage.prototype.WaitSwapIdMessage = function (imageUri, loading, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var i, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.config.MaxWait)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.FilterMessages(timestamp, imageUri, loading)];
                    case 2:
                        msg = _a.sent();
                        if (msg !== null) {
                            return [2 /*return*/, msg];
                        }
                        this.log(i, "wait no message found");
                        return [4 /*yield*/, (0, utils_1.sleep)(1000 * 2)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    MidjourneyMessage.prototype.RetrieveMessages = function (limit) {
        if (limit === void 0) { limit = this.config.Limit; }
        return __awaiter(this, void 0, void 0, function () {
            var headers, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            "Content-Type": "application/json",
                            Authorization: this.config.SalaiToken,
                        };
                        return [4 /*yield*/, this.config.fetch("".concat(this.config.DiscordBaseUrl, "/api/v10/channels/").concat(this.config.ChannelId, "/messages?limit=").concat(limit), {
                                headers: headers,
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            this.log("error config", { config: this.config });
                            this.log("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return MidjourneyMessage;
}());
exports.MidjourneyMessage = MidjourneyMessage;
