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
exports.replicateResend = void 0;
var Replicate = require('replicate');
var uploadthing_1 = require("../server/uploadthing");
var errorModel_1 = require("../models/errorModel");
var resend_1 = require("resend");
var client_1 = require("@prisma/client");
var dotenv = require("dotenv");
dotenv.config();
var replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});
var userID = "";
var sendingEmail = "";
var generation = "";
var upload = "";
var prompt = "";
var prompturi = "";
var useremail = "";
var prismadb = new client_1.PrismaClient();
var replicateResend = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var resend, _a, template, imageUrl, email, userId, userEmail, output, uploadedFile, uploaded, myObject, outputdb, _b, data, error, error_1, err, userApiLimit;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 12]);
                if (!replicate) {
                    replicate = new Replicate({
                        auth: process.env.REPLICATE_API_TOKEN_2
                    });
                }
                resend = new resend_1.Resend(process.env.RESEND_API_TOKEN);
                _a = req.body, template = _a.template, imageUrl = _a.imageUrl, email = _a.email, userId = _a.userId, userEmail = _a.userEmail;
                if (!imageUrl && !template && !email) {
                    return [2 /*return*/, next(new errorModel_1.default("ImageUrl, template and userEmail are unavailable.", 500))];
                }
                upload = imageUrl;
                prompt = template.prompt;
                prompturi = template.uri;
                sendingEmail = email;
                useremail = userEmail;
                userID = userId;
                console.log("imageurl:", imageUrl);
                console.log("template:", template);
                console.log("email:", email);
                res.status(200);
                return [4 /*yield*/, replicate.run("catio-apps/photoaistudio-generate:1ed8b5810e1e4291699e6a43ef9c641196d660eae7cba314d83519a898a409da", {
                        input: {
                            seed: 1,
                            steps: 8,
                            width: 1080,
                            prompt: template.prompt,
                            n_prompt: "ugly, bad hair, baggy, blurry",
                            face_image: imageUrl,
                            pose_image: template.uri,
                            num_samples: 1,
                            face_resemblance: 0.5,
                            pose_resemblance: 0.8,
                            face_expanding_bbox: 0.5
                        }
                    })];
            case 1:
                output = _d.sent();
                return [4 /*yield*/, uploadthing_1.utapi.uploadFilesFromUrl(output)];
            case 2:
                uploadedFile = _d.sent();
                uploaded = "";
                console.log("uploadedFile:", uploadedFile);
                myObject = uploadedFile;
                if (Array.isArray(myObject)) {
                    // It's an array
                    if (myObject[0].data) {
                        uploaded = (_c = myObject[0].data) === null || _c === void 0 ? void 0 : _c.url; // You might want to handle the array case differently
                    }
                }
                else {
                    // It's a single object
                    if (myObject.data) {
                        uploaded = myObject.data.url;
                    }
                }
                console.log("uploaded:", uploaded);
                return [4 /*yield*/, prismadb.generations.create({
                        data: {
                            userId: userId,
                            email: email,
                            output: uploaded,
                            prompt: template.prompt,
                            prompturi: template.uri,
                            upload: imageUrl
                        }
                    })];
            case 3:
                outputdb = _d.sent();
                return [4 /*yield*/, resend.emails.send({
                        from: "Genius Ai <genius@ai.lovemylifestyle.co>",
                        to: ["".concat(email)],
                        subject: "Your Headshot Generation",
                        html: "<strong> Here is your headshot generation image ".concat(uploaded, ".</strong><p>Thank you for using Genius Ai.</p>"),
                    })];
            case 4:
                _b = _d.sent(), data = _b.data, error = _b.error;
                if (!error) return [3 /*break*/, 6];
                return [4 /*yield*/, prismadb.generations.update({
                        where: {
                            id: outputdb.id
                        },
                        data: {
                            resenderror: error.message
                        }
                    })];
            case 5:
                _d.sent();
                console.log("[RESEND_ERROR]", error);
                return [2 /*return*/, res.status(400).json({ error: error })];
            case 6:
                console.log("This is the resend data", data);
                return [2 /*return*/, res.status(200).json("Email sent successfully")];
            case 7:
                error_1 = _d.sent();
                err = "Generation failed";
                return [4 /*yield*/, prismadb.generations.create({
                        data: {
                            userId: userID,
                            email: sendingEmail,
                            prompt: prompt,
                            prompturi: prompturi,
                            upload: upload,
                            replicateerror: err
                        }
                    })];
            case 8:
                _d.sent();
                return [4 /*yield*/, prismadb.userApiLimit.findUnique({
                        where: {
                            userEmail: useremail
                        }
                    })];
            case 9:
                userApiLimit = _d.sent();
                if (!userApiLimit) return [3 /*break*/, 11];
                return [4 /*yield*/, prismadb.userApiLimit.update({
                        where: { userEmail: useremail },
                        data: { count: userApiLimit.count - 1 },
                    })];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                console.log("[REPLICATE_SERVER_ERROR]", error_1);
                return [2 /*return*/, next(new errorModel_1.default("Something went wrong.", 500))];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.replicateResend = replicateResend;
