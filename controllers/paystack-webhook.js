"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = void 0;
// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
require("dotenv/config");
var paystackWebhook = function (req, res, next) {
    console.log(req);
    res.json("Webhook Success");
};
exports.paystackWebhook = paystackWebhook;
