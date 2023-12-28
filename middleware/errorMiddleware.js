"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
// Middleware for unsupported (404) routes
var notFound = function (req, res, next) {
    var error = new Error("Not Found - ".concat(req.originalUrl));
    res.status(404);
    next(error);
};
exports.notFound = notFound;
// Middleware to handle errors
var errorHandler = function (error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    var statusCode = 'code' in error ? error.code : 500;
    var message = error.message || "An unknown error occurred";
    res.status(statusCode).json({ message: message });
};
exports.errorHandler = errorHandler;
