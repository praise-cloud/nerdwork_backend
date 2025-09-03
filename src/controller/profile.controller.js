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
exports.getProfile = exports.addReaderProfile = exports.addCreatorProfile = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../config/db");
var profile_1 = require("../model/profile");
var crypto_1 = __importDefault(require("crypto"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var addCreatorProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, fullName, creatorName, phoneNumber, bio, genres, profile, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, fullName = _a.fullName, creatorName = _a.creatorName, phoneNumber = _a.phoneNumber, bio = _a.bio, genres = _a.genres;
                return [4 /*yield*/, db_1.db
                        .insert(profile_1.creatorProfile)
                        .values({
                        userId: userId,
                        fullName: fullName,
                        creatorName: creatorName,
                        phoneNumber: phoneNumber,
                        bio: bio,
                        genres: genres,
                    })
                        .returning()];
            case 1:
                profile = (_b.sent())[0];
                return [2 /*return*/, res.json({ profile: profile })];
            case 2:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: "Failed to create creator profile" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addCreatorProfile = addCreatorProfile;
var addReaderProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, genres, pin, walletId, pinHash, profile, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, genres = _a.genres, pin = _a.pin;
                walletId = crypto_1.default.randomBytes(12).toString("hex");
                pinHash = crypto_1.default.createHash("sha256").update(pin).digest("hex");
                return [4 /*yield*/, db_1.db
                        .insert(profile_1.readerProfile)
                        .values({
                        userId: userId,
                        genres: genres,
                        walletId: walletId,
                        pinHash: pinHash,
                    })
                        .returning()];
            case 1:
                profile = (_b.sent())[0];
                return [2 /*return*/, res.json({ profile: profile })];
            case 2:
                err_2 = _b.sent();
                console.error(err_2);
                return [2 /*return*/, res.status(400).json({ message: "Failed to create reader profile" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addReaderProfile = addReaderProfile;
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, userId, creator, reader, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                token = authHeader.split(" ")[1];
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(profile_1.creatorProfile)
                        .where((0, drizzle_orm_1.eq)(profile_1.creatorProfile.userId, userId))];
            case 1:
                creator = (_a.sent())[0];
                if (creator) {
                    return [2 /*return*/, res.json({ role: "creator", profile: creator })];
                }
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(profile_1.readerProfile)
                        .where((0, drizzle_orm_1.eq)(profile_1.readerProfile.userId, userId))];
            case 2:
                reader = (_a.sent())[0];
                if (reader) {
                    return [2 /*return*/, res.json({ role: "reader", profile: reader })];
                }
                return [2 /*return*/, res.status(404).json({ message: "Profile not found" })];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                return [2 /*return*/, res.status(401).json({ message: "Invalid or expired token" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
