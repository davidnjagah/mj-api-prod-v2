"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
require("dotenv/config");
var check = function (req, res, next) {
    console.log(req);
    res.send('Route is working');
};
exports.check = check;
