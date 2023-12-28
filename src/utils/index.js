"use strict";
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
exports.base64ToBlob = exports.toRemixCustom = exports.custom2Type = exports.content2prompt = exports.content2progress = exports.uriToHash = exports.formatInfo = exports.formatOptions = exports.formatPrompts = exports.nextNonce = exports.random = exports.sleep = void 0;
var snowyflake_1 = require("snowyflake");
var sleep = function (ms) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.sleep = sleep;
var random = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
exports.random = random;
var snowflake = new snowyflake_1.Snowyflake({
    workerId: BigInt(0),
    processId: BigInt(0),
    epoch: snowyflake_1.Epoch.Discord, // BigInt timestamp
});
var nextNonce = function () { return snowflake.nextId().toString(); };
exports.nextNonce = nextNonce;
var formatPrompts = function (prompts) {
    var regex = /(\d️⃣ .+)/g;
    var matches = prompts.match(regex);
    if (matches) {
        var shortenedPrompts = matches.map(function (match) { return match.trim(); });
        return shortenedPrompts;
    }
    else {
        return [];
    }
};
exports.formatPrompts = formatPrompts;
var formatOptions = function (components) {
    var _a;
    var data = [];
    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        if (component.components && component.components.length > 0) {
            var item = (0, exports.formatOptions)(component.components);
            data = data.concat(item);
        }
        if (!component.custom_id)
            continue;
        data.push({
            type: component.type,
            style: component.style,
            label: component.label || ((_a = component.emoji) === null || _a === void 0 ? void 0 : _a.name),
            custom: component.custom_id,
        });
    }
    return data;
};
exports.formatOptions = formatOptions;
var formatInfo = function (msg) {
    var jsonResult = {
        subscription: "",
        jobMode: "",
        visibilityMode: "",
        fastTimeRemaining: "",
        lifetimeUsage: "",
        relaxedUsage: "",
        queuedJobsFast: "",
        queuedJobsRelax: "",
        runningJobs: "",
    }; // Initialize jsonResult with empty object
    msg.split("\n").forEach(function (line) {
        var colonIndex = line.indexOf(":");
        if (colonIndex > -1) {
            var key = line.substring(0, colonIndex).trim().replace(/\*\*/g, "");
            var value = line.substring(colonIndex + 1).trim();
            switch (key) {
                case "Subscription":
                    jsonResult.subscription = value;
                    break;
                case "Job Mode":
                    jsonResult.jobMode = value;
                    break;
                case "Visibility Mode":
                    jsonResult.visibilityMode = value;
                    break;
                case "Fast Time Remaining":
                    jsonResult.fastTimeRemaining = value;
                    break;
                case "Lifetime Usage":
                    jsonResult.lifetimeUsage = value;
                    break;
                case "Relaxed Usage":
                    jsonResult.relaxedUsage = value;
                    break;
                case "Queued Jobs (fast)":
                    jsonResult.queuedJobsFast = value;
                    break;
                case "Queued Jobs (relax)":
                    jsonResult.queuedJobsRelax = value;
                    break;
                case "Running Jobs":
                    jsonResult.runningJobs = value;
                    break;
                default:
                // Do nothing
            }
        }
    });
    return jsonResult;
};
exports.formatInfo = formatInfo;
var uriToHash = function (uri) {
    var _a, _b;
    return (_b = (_a = uri.split("_").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) !== null && _b !== void 0 ? _b : "";
};
exports.uriToHash = uriToHash;
var content2progress = function (content) {
    if (!content)
        return "";
    var spcon = content.split("<@");
    if (spcon.length < 2) {
        return "";
    }
    content = spcon[1];
    var regex = /\(([^)]+)\)/; // matches the value inside the first parenthesis
    var match = content.match(regex);
    var progress = "";
    if (match) {
        progress = match[1];
    }
    return progress;
};
exports.content2progress = content2progress;
var content2prompt = function (content) {
    if (!content)
        return "";
    var pattern = /\*\*(.*?)\*\*/; // Match **middle content
    var matches = content.match(pattern);
    if (matches && matches.length > 1) {
        return matches[1]; // Get the matched content
    }
    else {
        console.log("No match found.", content);
        return content;
    }
};
exports.content2prompt = content2prompt;
function custom2Type(custom) {
    if (custom.includes("upsample")) {
        return "upscale";
    }
    else if (custom.includes("variation")) {
        return "variation";
    }
    else if (custom.includes("reroll")) {
        return "reroll";
    }
    else if (custom.includes("CustomZoom")) {
        return "customZoom";
    }
    else if (custom.includes("Outpaint")) {
        return "variation";
    }
    else if (custom.includes("remaster")) {
        return "reroll";
    }
    return null;
}
exports.custom2Type = custom2Type;
var toRemixCustom = function (customID) {
    var parts = customID.split("::");
    var convertedString = "MJ::RemixModal::".concat(parts[4], "::").concat(parts[3], "::1");
    return convertedString;
};
exports.toRemixCustom = toRemixCustom;
function base64ToBlob(base64Image) {
    return __awaiter(this, void 0, void 0, function () {
        var base64Data, binaryData, arrayBuffer, uint8Array, i;
        return __generator(this, function (_a) {
            base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
            binaryData = atob(base64Data);
            arrayBuffer = new ArrayBuffer(binaryData.length);
            uint8Array = new Uint8Array(arrayBuffer);
            for (i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            // 使用 Uint8Array 创建 Blob 对象
            return [2 /*return*/, new Blob([uint8Array], { type: "image/png" })]; // 替换为相应的 MIME 类型
        });
    });
}
exports.base64ToBlob = base64ToBlob;
