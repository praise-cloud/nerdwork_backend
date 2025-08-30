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
exports.loginWithGoogle = exports.signupWithGoogle = exports.generateToken = void 0;
// services/profileService.ts
var db_1 = require("../config/db");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = require("../model/auth");
var drizzle_orm_1 = require("drizzle-orm");
var bcrypt_1 = __importDefault(require("bcrypt"));
var envs_1 = require("../config/envs");
var generateToken = function (user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, envs_1.JWT_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
// Google SignUp (with profiles attached)
var signupWithGoogle = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var existingUser, username, fakePassword, token;
    var email = _b.email, fullName = _b.fullName, picture = _b.picture, googleId = _b.googleId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .select()
                    .from(auth_1.authUsers)
                    .where((0, drizzle_orm_1.eq)(auth_1.authUsers.email, email))];
            case 1:
                existingUser = (_c.sent())[0];
                if (!!existingUser) return [3 /*break*/, 4];
                username = email.split("@")[0] + "_" + Date.now();
                return [4 /*yield*/, bcrypt_1.default.hash(googleId, 10)];
            case 2:
                fakePassword = _c.sent();
                return [4 /*yield*/, db_1.db
                        .insert(auth_1.authUsers)
                        .values({
                        email: email,
                        username: username,
                        passwordHash: fakePassword,
                        emailVerified: true, // Google verified emails are trusted
                    })
                        .returning()];
            case 3:
                existingUser = (_c.sent())[0];
                _c.label = 4;
            case 4:
                token = (0, exports.generateToken)(existingUser);
                return [2 /*return*/, { token: token, user: existingUser }];
        }
    });
}); };
exports.signupWithGoogle = signupWithGoogle;
// Google Login
var loginWithGoogle = function (googleUser) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = googleUser.email;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(auth_1.authUsers)
                        .where((0, drizzle_orm_1.eq)(auth_1.authUsers.email, email))];
            case 1:
                user = (_a.sent())[0];
                if (!user) {
                    throw new Error("User not found");
                }
                token = (0, exports.generateToken)(user);
                return [2 /*return*/, { token: token, user: user }];
        }
    });
}); };
exports.loginWithGoogle = loginWithGoogle;
// verify google token
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
