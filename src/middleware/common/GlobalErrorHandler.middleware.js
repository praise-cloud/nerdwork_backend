"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
var globalErrorHandler = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
};
exports.globalErrorHandler = globalErrorHandler;
