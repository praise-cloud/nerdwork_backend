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
exports.login = exports.signup = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = require("../config/db");
var schema_1 = require("../model/schema");
var JWT_SECRET = process.env.JWT_SECRET;
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, username, existingUser, hashedPassword, newUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password, username = _a.username;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.authUsers)
                        .where((0, drizzle_orm_1.eq)(schema_1.authUsers.email, email))];
            case 1:
                existingUser = _b.sent();
                if (existingUser.length > 0)
                    return [2 /*return*/, res.status(400).json({ message: "User already exists" })];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.authUsers)
                        .values({
                        email: email,
                        username: username,
                        passwordHash: hashedPassword,
                    })
                        .returning()];
            case 3:
                newUser = (_b.sent())[0];
                token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
                    expiresIn: "7d",
                });
                return [2 /*return*/, res.status(201).json({ token: token, user: newUser })];
            case 4:
                error_1 = _b.sent();
                console.error("Signup error:", error_1); // <-- Add this
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.authUsers)
                        .where((0, drizzle_orm_1.eq)(schema_1.authUsers.email, email))];
            case 1:
                user = (_b.sent())[0];
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.passwordHash)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                    expiresIn: "7d",
                });
                return [2 /*return*/, res.status(200).json({ token: token, user: user })];
        }
    });
}); };
exports.login = login;
