"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var common_1 = require("./middleware/common");
var server_1 = require("./server");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return server_1.app; } });
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var payment_routes_1 = __importDefault(require("./routes/payment.routes"));
var auth_1 = require("./middleware/common/auth");
var nft_routes_1 = __importDefault(require("./routes/nft.routes"));
var wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
var profile_routes_1 = __importDefault(require("./routes/profile.routes"));
server_1.app.use("/auth", auth_routes_1.default);
server_1.app.use("/payment", auth_1.authenticate, payment_routes_1.default);
server_1.app.use("/nft", auth_1.authenticate, nft_routes_1.default);
server_1.app.use("/wallet", auth_1.authenticate, wallet_routes_1.default);
server_1.app.use("/profile", profile_routes_1.default);
var PORT = 5000;
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of users
 *     responses:
 *       200:
 *         description: Successfully retrieved list
 */
server_1.app.get("/", function (req, res) {
    res.status(200).json({ data: "Hello, world! - ".concat(PORT) });
});
server_1.app.use(common_1.globalNotFoundHandler);
server_1.app.use(common_1.globalErrorHandler);
server_1.app.listen(PORT, function () {
    console.log("Server running at http://localhost:".concat(PORT));
    console.log("Swagger docs available at http://localhost:".concat(PORT, "/api-docs"));
});
