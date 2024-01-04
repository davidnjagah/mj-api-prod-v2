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
exports.paystackWebhook = void 0;
var client_1 = require("@prisma/client");
var crypto_1 = require("crypto");
var dotenv = require("dotenv");
dotenv.config();
// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
require("dotenv/config");
function addOneMonth(date) {
    // Get the current day (of the month)
    var currentDay = date.getDate();
    // Add one month
    date.setMonth(date.getMonth() + 1);
    // Check if the day has changed (month overflow case)
    // If so, set the date to the last day of the previous month
    if (date.getDate() !== currentDay) {
        date.setDate(0);
    }
}
var paystackWebhook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prisma, secret, hash, event_1, date, amount, paystackSubscription;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prisma = new client_1.PrismaClient();
                secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_a08750855551bcd0a4958314a950ee5989548f97";
                hash = (0, crypto_1.createHmac)('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
                if (!(hash == req.headers['x-paystack-signature'])) return [3 /*break*/, 7];
                event_1 = req.body;
                console.log("This is the req.body", event_1);
                date = new Date(event_1.data.created_at);
                amount = event_1.data.amount.toString();
                addOneMonth(date);
                return [4 /*yield*/, prisma.paystackSubscription.findUnique({
                        where: {
                            userEmail: event_1.data.customer.email,
                        }
                    })];
            case 1:
                paystackSubscription = _a.sent();
                res.json({ status: 200 });
                console.log("This is paystackSubscription", paystackSubscription);
                if (!(event_1.event === "charge.success")) return [3 /*break*/, 6];
                if (!paystackSubscription) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.paystackSubscription.update({
                        where: {
                            userEmail: event_1.data.customer.email,
                        },
                        data: {
                            paystackAmountPaid: amount,
                            paystackCurrentPeriodEnd: date,
                            plan_code: event_1.data.plan.plan_code,
                        },
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.paystackSubscription.create({
                    data: {
                        userEmail: event_1.data.customer.email,
                        paystackCustomerId: event_1.data.customer.customer_code,
                        paystackAmountPaid: amount,
                        paystackCurrentPeriodEnd: date,
                        plan_code: event_1.data.plan.plan_code,
                    },
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                ;
                _a.label = 6;
            case 6:
                ;
                _a.label = 7;
            case 7:
                ;
                return [2 /*return*/];
        }
    });
}); };
exports.paystackWebhook = paystackWebhook;
