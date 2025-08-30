"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/common/auth");
var router = (0, express_1.Router)();
router.get("/me", auth_1.authenticate, function (req, res) {
    var userId = req.userId;
    res.json({
        message: "User profile for user ".concat(userId),
    });
});
exports.default = router;
