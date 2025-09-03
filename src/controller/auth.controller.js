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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLoginController = exports.googleSignup = void 0;
exports.verifyGoogleToken = verifyGoogleToken;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = require("../config/db");
var schema_1 = require("../model/schema");
var profile_service_1 = require("../services/profile.service");
var google_auth_library_1 = require("google-auth-library");
var drizzle_orm_1 = require("drizzle-orm");
var envs_1 = require("../config/envs");
var client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var googleSignup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, ticket, payload, email, googleId, picture, users, existingUser, user, jwtToken, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                token = req.body.token;
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: token,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    })];
            case 1:
                ticket = _b.sent();
                payload = ticket.getPayload();
                if (!payload)
                    throw new Error("Invalid Google token");
                email = payload.email, googleId = payload.sub, picture = payload.picture;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.authUsers)
                        .where((0, drizzle_orm_1.eq)(schema_1.authUsers.email, email))];
            case 2:
                users = _b.sent();
                existingUser = (_a = users[0]) !== null && _a !== void 0 ? _a : null;
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: "User already exists" })];
                }
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.authUsers)
                        .values({
                        email: email,
                        username: email.split("@")[0],
                        passwordHash: "",
                        emailVerified: true,
                        isActive: true,
                    })
                        .returning()];
            case 3:
                user = (_b.sent())[0];
                jwtToken = jsonwebtoken_1.default.sign({ id: user.id }, envs_1.JWT_SECRET, { expiresIn: "7d" });
                return [2 /*return*/, res.json({ token: jwtToken, user: user })];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, res.status(401).json({ message: "Google signup failed" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.googleSignup = googleSignup;
console.log(jsonwebtoken_1.default === null || jsonwebtoken_1.default === void 0 ? void 0 : jsonwebtoken_1.default.sign);
var googleLoginController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idToken, googleUser, _a, token, user, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                idToken = req.body.idToken;
                if (!idToken) {
                    return [2 /*return*/, res.status(400).json({ error: "Google ID token required" })];
                }
                return [4 /*yield*/, verifyGoogleToken(idToken)];
            case 1:
                googleUser = _b.sent();
                return [4 /*yield*/, (0, profile_service_1.loginWithGoogle)(googleUser)];
            case 2:
                _a = _b.sent(), token = _a.token, user = _a.user;
                return [2 /*return*/, res.status(200).json({ token: token, user: user })];
            case 3:
                err_2 = _b.sent();
                return [2 /*return*/, res.status(400).json({ message: err_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.googleLoginController = googleLoginController;
function verifyGoogleToken(idToken) {
    return __awaiter(this, void 0, void 0, function () {
        var ticket, payload, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.verifyIdToken({
                            idToken: idToken,
                            audience: process.env.GOOGLE_CLIENT_ID,
                        })];
                case 1:
                    ticket = _a.sent();
                    payload = ticket.getPayload();
                    if (!payload)
                        throw new Error("Invalid Google token");
                    return [2 /*return*/, {
                            email: payload.email,
                            fullName: payload.name || "",
                            picture: payload.picture || "",
                            googleId: payload.sub,
                        }];
                case 2:
                    error_1 = _a.sent();
                    throw new Error("Failed to verify Google token");
                case 3: return [2 /*return*/];
            }
        });
    });
}
