"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalNotFoundHandler = void 0;
var globalNotFoundHandler = function (req, res, next) {
    res.status(404).json({ message: "Route not found" });
};
exports.globalNotFoundHandler = globalNotFoundHandler;
