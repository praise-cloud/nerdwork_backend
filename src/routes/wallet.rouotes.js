"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/common/auth");
var router = (0, express_1.Router)();
router.get("/my-wallet", auth_1.authenticate, function (req, res) {
    var userId = req.userId;
    res.json({
        message: "Fetching wallet for user ".concat(userId),
    });
});
exports.default = router;
