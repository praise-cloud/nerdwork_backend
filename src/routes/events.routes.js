"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/common/auth");
var router = (0, express_1.Router)();
router.get("/my-events", auth_1.authenticate, function (req, res) {
    var userId = req.userId;
    res.status(200).json({ userId: userId });
});
exports.default = router;
