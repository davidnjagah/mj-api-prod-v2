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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Commands = void 0;
exports.Commands = [
    "saveid",
    "swapid",
    "delid",
];
function getCommandName(name) {
    for (var _i = 0, Commands_1 = exports.Commands; _i < Commands_1.length; _i++) {
        var command = Commands_1[_i];
        if (command === name) {
            return command;
        }
    }
}
var Command = /** @class */ (function () {
    function Command(config) {
        this.config = config;
        this.cache = {};
    }
    Command.prototype.cacheCommand = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cache[name] !== undefined) {
                            return [2 /*return*/, this.cache[name]];
                        }
                        if (!this.config.ServerId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCommand(name)];
                    case 1:
                        command = _a.sent();
                        this.cache[name] = command;
                        return [2 /*return*/, command];
                    case 2:
                        this.allCommand();
                        return [2 /*return*/, this.cache[name]];
                }
            });
        });
    };
    Command.prototype.allCommand = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, url, response, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = new URLSearchParams({
                            type: "1",
                            include_applications: "true",
                        });
                        url = "".concat(this.config.DiscordBaseUrl, "/api/v9/channels/").concat(this.config.ChannelId, "/application-commands/search?").concat(searchParams);
                        return [4 /*yield*/, this.config.fetch(url, {
                                headers: { authorization: this.config.SalaiToken },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (data === null || data === void 0 ? void 0 : data.application_commands) {
                            data.application_commands.forEach(function (command) {
                                var name = getCommandName(command.name);
                                if (name) {
                                    _this.cache[name] = command;
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Command.prototype.getCommand = function (name) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, url, response, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchParams = new URLSearchParams({
                            type: "1",
                            query: name,
                            limit: "1",
                            include_applications: "true",
                            // command_ids: `${this.config.BotId}`,
                        });
                        url = "".concat(this.config.DiscordBaseUrl, "/api/v9/channels/").concat(this.config.ChannelId, "/application-commands/search?").concat(searchParams);
                        return [4 /*yield*/, this.config.fetch(url, {
                                headers: { authorization: this.config.SalaiToken },
                            })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        if ((_a = data === null || data === void 0 ? void 0 : data.application_commands) === null || _a === void 0 ? void 0 : _a[0]) {
                            return [2 /*return*/, data.application_commands[0]];
                        }
                        throw new Error("Failed to get application_commands for command ".concat(name));
                }
            });
        });
    };
    Command.prototype.saveIdPayload = function (idname, image, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var data, application_command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commandData("saveid", [
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
                        ], [
                            {
                                id: "0",
                                filename: image.filename,
                                uploaded_filename: image.upload_filename,
                            },
                        ])];
                    case 1:
                        data = _a.sent();
                        application_command = {
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
                        return [2 /*return*/, this.data2Paylod(__assign(__assign({}, data), { application_command: application_command }), nonce)];
                }
            });
        });
    };
    Command.prototype.swapIdPayload = function (idname, image, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var data, application_command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commandData("swapid", [
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
                        ], [
                            {
                                id: "0",
                                filename: image.filename,
                                uploaded_filename: image.upload_filename,
                            },
                        ])];
                    case 1:
                        data = _a.sent();
                        application_command = {
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
                        return [2 /*return*/, this.data2Paylod(__assign(__assign({}, data), { application_command: application_command }), nonce)];
                }
            });
        });
    };
    Command.prototype.delIdPayload = function (idname, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var data, application_command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commandData("delid", [
                            {
                                type: 3,
                                name: "idname",
                                value: idname,
                            }
                        ])];
                    case 1:
                        data = _a.sent();
                        application_command = {
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
                        return [2 /*return*/, this.data2Paylod(__assign(__assign({}, data), { application_command: application_command }), nonce)];
                }
            });
        });
    };
    Command.prototype.commandData = function (name, options, attachments) {
        if (options === void 0) { options = []; }
        if (attachments === void 0) { attachments = []; }
        return __awaiter(this, void 0, void 0, function () {
            var command, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheCommand(name)];
                    case 1:
                        command = _a.sent();
                        data = {
                            version: command.version,
                            id: command.id,
                            name: command.name,
                            type: command.type,
                            options: options,
                            application_command: command,
                            attachments: attachments,
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //TODO data type
    Command.prototype.data2Paylod = function (data, nonce) {
        var payload = {
            type: 2,
            application_id: data.application_command.application_id,
            guild_id: this.config.ServerId,
            channel_id: this.config.ChannelId,
            session_id: this.config.SessionId,
            nonce: nonce,
            data: data,
        };
        console.log("This is the payload ", JSON.stringify(payload));
        return payload;
    };
    Command.prototype.data2PaylodSwapId = function (data, nonce) {
        var payload = {
            type: 3,
            application_id: data.application_command.application_id,
            guild_id: this.config.ServerId,
            channel_id: this.config.ChannelId,
            session_id: this.config.SessionId,
            nonce: nonce,
            data: data,
        };
        console.log("This is the payload ", JSON.stringify(payload));
        return payload;
    };
    return Command;
}());
exports.Command = Command;
