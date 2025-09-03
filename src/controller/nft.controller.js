"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformNFTs = exports.transferNft = exports.getAssetByOwner = exports.getAssetData = exports.mintApiNFT = exports.createApiCollection = exports.upload = void 0;
var fs = __importStar(require("fs"));
var drizzle_orm_1 = require("drizzle-orm");
var mpl_core_1 = require("@metaplex-foundation/mpl-core");
var umi_1 = require("@metaplex-foundation/umi");
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
// import * as multer from "multer"
var schema_1 = require("../model/schema");
var db_1 = require("../config/db");
var multer_1 = __importDefault(require("multer"));
var umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
var nft_1 = require("../model/nft");
var umi = (0, umi_bundle_defaults_1.createUmi)("http://api.devnet.solana.com")
    .use((0, mpl_core_1.mplCore)())
    .use((0, umi_uploader_irys_1.irysUploader)());
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        var allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
        }
    },
});
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
// Set up signer from private key
var keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array([
    52, 52, 212, 166, 63, 87, 120, 139, 26, 57, 91, 117, 243, 1, 251, 111, 227,
    73, 73, 73, 230, 55, 67, 121, 81, 198, 187, 204, 217, 81, 252, 158, 132, 41,
    222, 69, 230, 97, 134, 202, 186, 91, 158, 218, 90, 105, 179, 241, 113, 204,
    215, 39, 54, 158, 233, 66, 129, 141, 95, 31, 203, 109, 193, 83,
]));
console.log(keypair);
var masterWallet = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)(masterWallet));
// Database helper functions
function getUserWalletByUserId(userProfileId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userWallets)
                        .where((0, drizzle_orm_1.eq)(schema_1.userWallets.userProfileId, userProfileId))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result[0]];
            }
        });
    });
}
function getUserSolanaAddress(userWalletId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.walletAddresses)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.walletAddresses.userWalletId, userWalletId), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.blockchain, "solana"), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.isVerified, true)))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result[0]];
            }
        });
    });
}
function getUserPrimarySolanaAddress(userWalletId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.walletAddresses)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.walletAddresses.userWalletId, userWalletId), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.blockchain, "solana"), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.isPrimary, true), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.isVerified, true)))];
                case 1:
                    result = _b.sent();
                    _a = result[0];
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, getUserSolanaAddress(userWalletId)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3: return [2 /*return*/, _a];
            }
        });
    });
}
// Helper function to upload metadata
function uploadMetadata(imageFile, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var imageBuffer, genericFile, imageUri, metadataJson, metadataUri, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    imageBuffer = fs.readFileSync(imageFile.path);
                    genericFile = {
                        buffer: imageBuffer,
                        fileName: imageFile.originalname || imageFile.filename || "image",
                        displayName: imageFile.originalname || imageFile.filename || "image",
                        uniqueName: Date.now() +
                            "-" +
                            (imageFile.originalname || imageFile.filename || "image"),
                        contentType: imageFile.mimetype || "image/png",
                        extension: (imageFile.originalname || imageFile.filename || "image")
                            .split(".")
                            .pop() || "png",
                        tags: [],
                    };
                    return [4 /*yield*/, umi.uploader.upload([genericFile])];
                case 1:
                    imageUri = (_a.sent())[0];
                    metadataJson = {
                        name: metadata.name,
                        description: metadata.description,
                        image: imageUri,
                        attributes: metadata.attributes || [],
                        properties: __assign({ category: "image", creators: metadata.creators || [] }, metadata.properties),
                        // Comic-specific metadata
                        comic: {
                            issue: metadata.issue || 1,
                            series: metadata.series || "",
                            author: metadata.author || "",
                            genre: metadata.genre || "",
                            publishDate: metadata.publishDate || new Date().toISOString(),
                            pages: metadata.pages || 1,
                        },
                    };
                    return [4 /*yield*/, umi.uploader.uploadJson(metadataJson)];
                case 2:
                    metadataUri = _a.sent();
                    // Clean up uploaded file
                    fs.unlinkSync(imageFile.path);
                    return [2 /*return*/, metadataUri];
                case 3:
                    error_1 = _a.sent();
                    // Clean up file on error
                    if (fs.existsSync(imageFile.path)) {
                        fs.unlinkSync(imageFile.path);
                    }
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// API Roter
// Create a new collection
var createApiCollection = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, description, image, userProfileId, metadataJson, amount, _b, _c, metadataUri, collectionSigner, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, description = _a.description, image = _a.image, userProfileId = _a.userProfileId;
                if (!name_1 || !description || !image) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Name, description, and image URL are required" })];
                }
                metadataJson = {
                    name: name_1,
                    description: description,
                    image: image,
                    attributes: [],
                    properties: {
                        category: "image",
                        creators: [
                            {
                                address: masterWallet.publicKey,
                                percentage: 100,
                            },
                        ],
                    },
                };
                amount = {
                    basisPoints: BigInt(9),
                    identifier: "SOL",
                    decimals: 9,
                };
                _c = (_b = console).log;
                return [4 /*yield*/, umi.rpc.airdrop(masterWallet.publicKey, amount)];
            case 1:
                _c.apply(_b, [_d.sent()]);
                return [4 /*yield*/, umi.uploader.uploadJson(metadataJson)];
            case 2:
                metadataUri = _d.sent();
                console.log(metadataUri);
                collectionSigner = (0, umi_1.generateSigner)(umi);
                return [4 /*yield*/, (0, mpl_core_1.createCollection)(umi, {
                        collection: collectionSigner,
                        name: name_1,
                        uri: metadataUri,
                    }).sendAndConfirm(umi)];
            case 3:
                _d.sent();
                // add crea
                res.json({
                    success: true,
                    collectionId: collectionSigner.publicKey,
                    message: "Collection created successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _d.sent();
                console.error("Collection creation error:", error_2);
                res
                    .status(500)
                    .json({ error: "Failed to create collection", details: error_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createApiCollection = createApiCollection;
var defaultCollection;
var mintApiNFT = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userProfileId, name_2, description, author, series, issue, genre, pages, publishDate, collectionId, attributes, _b, transferImmediately, userWallet, userSolanaWallet, parsedAttributes, comicAttributes, metadata, metadataUri, assetSigner, mintParams, collection, error_3, createResult, transferResult, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: "Image file is required" })];
                }
                _a = req.body, userProfileId = _a.userProfileId, name_2 = _a.name, description = _a.description, author = _a.author, series = _a.series, issue = _a.issue, genre = _a.genre, pages = _a.pages, publishDate = _a.publishDate, collectionId = _a.collectionId, attributes = _a.attributes, _b = _a.transferImmediately, transferImmediately = _b === void 0 ? true : _b;
                // Validate required fields
                if (!userProfileId || !name_2 || !description) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "userProfileId, name, and description are required" })];
                }
                userWallet = "await getUserWalletByUserId(userProfileId);";
                if (!userWallet) {
                    return [2 /*return*/, res.status(404).json({ error: "User wallet not found" })];
                }
                userSolanaWallet = "await getUserPrimarySolanaAddress(userWallet.id);";
                if (!userSolanaWallet) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "User has no verified Solana wallet address" })];
                }
                parsedAttributes = [];
                if (attributes) {
                    try {
                        parsedAttributes = JSON.parse(attributes);
                    }
                    catch (error) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid attributes format" })];
                    }
                }
                comicAttributes = __spreadArray([
                    { trait_type: "Author", value: author || "Unknown" },
                    { trait_type: "Series", value: series || "Standalone" },
                    { trait_type: "Issue", value: issue || "1" },
                    { trait_type: "Genre", value: genre || "Comic" },
                    { trait_type: "Pages", value: pages || "1" },
                    { trait_type: "Platform", value: "YourPlatformName" },
                    { trait_type: "Minted By", value: "Platform" }
                ], parsedAttributes, true);
                metadata = {
                    name: name_2,
                    description: description,
                    author: author,
                    series: series,
                    issue: issue,
                    genre: genre,
                    pages: pages,
                    publishDate: publishDate,
                    attributes: comicAttributes,
                    creators: [
                        {
                            address: masterWallet.publicKey,
                            percentage: 100,
                        },
                    ],
                };
                return [4 /*yield*/, uploadMetadata(req.file, metadata)];
            case 1:
                metadataUri = _c.sent();
                assetSigner = (0, umi_1.generateSigner)(umi);
                mintParams = {
                    asset: assetSigner,
                    name: name_2,
                    uri: metadataUri,
                    owner: masterWallet.publicKey, // Mint to master wallet first
                };
                if (!collectionId) return [3 /*break*/, 5];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, mpl_core_1.fetchCollection)(umi, (0, umi_1.publicKey)(collectionId))];
            case 3:
                collection = _c.sent();
                mintParams["collection"] = collection;
                return [3 /*break*/, 5];
            case 4:
                error_3 = _c.sent();
                console.log("Collection not found, minting without collection");
                return [3 /*break*/, 5];
            case 5:
                // const userPublicKey = publicKey(userSolanaWallet.address)
                // Add royalties plugin (platform gets royalties)
                mintParams["plugins"] = [
                    {
                        type: "Royalties",
                        basisPoints: 500, // 5% royalty to platform
                        creators: [
                            {
                                address: masterWallet.publicKey,
                                percentage: 100,
                            },
                        ],
                        ruleSet: { type: "None" },
                    },
                ];
                // Create the asset
                console.log("Creating NFT...");
                return [4 /*yield*/, (0, mpl_core_1.create)(umi, mintParams).sendAndConfirm(umi)];
            case 6:
                createResult = _c.sent();
                //save nft to database
                return [4 /*yield*/, db_1.db.insert(nft_1.nft).values({
                        owner: userWallet, // UUID from the user wallet
                        colection: collectionId !== null && collectionId !== void 0 ? collectionId : "standalone", // optional or default string
                        isLimitedEdition: false, // or true if it's a limited edition
                        amount: 1, // assume 1 NFT minted
                        metadata: {
                            name: name_2,
                            description: description,
                            author: author,
                            image: req.file.path,
                            uri: metadataUri,
                            assetId: assetSigner.publicKey,
                            attributes: comicAttributes,
                            mintSignature: createResult.signature,
                        },
                        status: "completed", // or 'pending' if there's more flow
                    })];
            case 7:
                //save nft to database
                _c.sent();
                transferResult = null;
                // Transfer to user immediately if requested
                // if (transferImmediately) {
                //   console.log('Transferring NFT to user...');
                //   try {
                //    if (collectionId){
                //      transferResult = await transferV1(umi, {
                //       asset: assetSigner.publicKey,
                //       newOwner: publicKey(userSolanaWallet.address),
                //     }).sendAndConfirm(umi);
                //    }else{
                //      transferResult = await transferV1(umi, {
                //       asset: assetSigner.publicKey,
                //       newOwner: publicKey(userSolanaWallet.address),
                //       collection: collectionId
                //     }).sendAndConfirm(umi);
                //    }
                //   } catch (transferError) {
                //     console.error('Transfer failed:', transferError);
                //     // NFT was minted but transfer failed - you might want to handle this differently
                //     return res.status(500).json({
                //       error: 'NFT minted but transfer failed',
                //       details: transferError.message,
                //       assetId: assetSigner.publicKey,
                //       mintSignature: createResult.signature,
                //       metadataUri
                //     });
                //   }
                // }
                // Log the transaction for your records
                console.log("NFT minted successfully:\n      Asset ID: ".concat(assetSigner.publicKey, "\n      User: ").concat(userProfileId, "\n      User Wallet: ").concat(userSolanaWallet, "\n      Mint Signature: ").concat(createResult.signature, "\n      Transfer Signature: ").concat((transferResult === null || transferResult === void 0 ? void 0 : transferResult.signature) || "N/A", "\n    "));
                res.json({
                    success: true,
                    assetId: assetSigner.publicKey,
                    mintSignature: createResult.signature,
                    transferSignature: transferResult === null || transferResult === void 0 ? void 0 : transferResult.signature,
                    metadataUri: metadataUri,
                    // userWalletAddress: userSolanaWallet.address,
                    transferred: transferImmediately,
                    message: transferImmediately
                        ? "Comic NFT minted and transferred to user successfully"
                        : "Comic NFT minted successfully (transfer pending)",
                });
                return [3 /*break*/, 9];
            case 8:
                error_4 = _c.sent();
                console.error("Minting error:", error_4);
                // Clean up uploaded file on error
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).json({
                    error: "Failed to mint NFT",
                    details: error_4.message,
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.mintApiNFT = mintApiNFT;
// Get NFT details
var getAssetData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assetId, asset, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                assetId = req.params.assetId;
                return [4 /*yield*/, (0, mpl_core_1.fetchAsset)(umi, (0, umi_1.publicKey)(assetId))];
            case 1:
                asset = _a.sent();
                res.json({
                    success: true,
                    asset: {
                        id: asset.publicKey,
                        name: asset.name,
                        uri: asset.uri,
                        owner: asset.owner,
                        updateAuthority: asset.updateAuthority,
                        plugins: asset["plugins"] || null,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Fetch error:", error_5);
                res
                    .status(500)
                    .json({ error: "Failed to fetch NFT", details: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAssetData = getAssetData;
// Get NFTs by owner
var getAssetByOwner = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userProfileId, userWallet, userAddresses, allAssets, _i, userAddresses_1, address, fetchAssetsByOwner_1, assets, error_6, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                userProfileId = req.params.userProfileId;
                return [4 /*yield*/, getUserWalletByUserId(userProfileId)];
            case 1:
                userWallet = _a.sent();
                if (!userWallet) {
                    return [2 /*return*/, res.status(404).json({ error: "User wallet not found" })];
                }
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.walletAddresses)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.walletAddresses.userWalletId, userWallet.id), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.blockchain, "solana"), (0, drizzle_orm_1.eq)(schema_1.walletAddresses.isVerified, true)))];
            case 2:
                userAddresses = _a.sent();
                if (userAddresses.length === 0) {
                    return [2 /*return*/, res.json({ success: true, assets: [] })];
                }
                allAssets = [];
                _i = 0, userAddresses_1 = userAddresses;
                _a.label = 3;
            case 3:
                if (!(_i < userAddresses_1.length)) return [3 /*break*/, 8];
                address = userAddresses_1[_i];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                fetchAssetsByOwner_1 = require("@metaplex-foundation/mpl-core").fetchAssetsByOwner;
                return [4 /*yield*/, fetchAssetsByOwner_1(umi, (0, umi_1.publicKey)(address.address))];
            case 5:
                assets = _a.sent();
                allAssets.push.apply(allAssets, assets);
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                console.error("Failed to fetch assets for address ".concat(address.address, ":"), error_6);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8:
                res.json({
                    success: true,
                    assets: allAssets.map(function (asset) { return ({
                        id: asset.publicKey,
                        name: asset.name,
                        uri: asset.uri,
                        owner: asset.owner,
                        updateAuthority: asset.updateAuthority,
                    }); }),
                });
                return [3 /*break*/, 10];
            case 9:
                error_7 = _a.sent();
                console.error("Fetch user NFTs error:", error_7);
                res.status(500).json({
                    error: "Failed to fetch user NFTs",
                    details: error_7.message,
                });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getAssetByOwner = getAssetByOwner;
var transferNft = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, assetId, userProfileId, userWallet, userSolanaWallet, asset, transferResult, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, assetId = _a.assetId, userProfileId = _a.userProfileId;
                if (!assetId || !userProfileId) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "assetId and userProfileId are required" })];
                }
                return [4 /*yield*/, getUserWalletByUserId(userProfileId)];
            case 1:
                userWallet = _b.sent();
                if (!userWallet) {
                    return [2 /*return*/, res.status(404).json({ error: "User wallet not found" })];
                }
                return [4 /*yield*/, getUserPrimarySolanaAddress(userWallet.id)];
            case 2:
                userSolanaWallet = _b.sent();
                if (!userSolanaWallet) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "User has no verified Solana wallet address" })];
                }
                return [4 /*yield*/, (0, mpl_core_1.fetchAsset)(umi, (0, umi_1.publicKey)(assetId))];
            case 3:
                asset = _b.sent();
                if (asset.owner !== masterWallet.publicKey) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Asset is not owned by platform wallet" })];
                }
                return [4 /*yield*/, (0, mpl_core_1.transfer)(umi, {
                        asset: (0, umi_1.publicKey)(assetId),
                        newOwner: (0, umi_1.publicKey)(userSolanaWallet.address),
                    }).sendAndConfirm(umi)];
            case 4:
                transferResult = _b.sent();
                res.json({
                    success: true,
                    assetId: assetId,
                    transferSignature: transferResult.signature,
                    userWalletAddress: userSolanaWallet.address,
                    message: "NFT transferred to user successfully",
                });
                return [3 /*break*/, 6];
            case 5:
                error_8 = _b.sent();
                console.error("Transfer error:", error_8);
                res.status(500).json({
                    error: "Failed to transfer NFT",
                    details: error_8.message,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.transferNft = transferNft;
var getPlatformNFTs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fetchAssetsByOwner_2, assets, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                fetchAssetsByOwner_2 = require("@metaplex-foundation/mpl-core").fetchAssetsByOwner;
                return [4 /*yield*/, fetchAssetsByOwner_2(umi, masterWallet.publicKey)];
            case 1:
                assets = _a.sent();
                res.json({
                    success: true,
                    assets: assets.map(function (asset) { return ({
                        id: asset.publicKey,
                        name: asset.name,
                        uri: asset.uri,
                        owner: asset.owner,
                        updateAuthority: asset.updateAuthority,
                    }); }),
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error("Fetch platform NFTs error:", error_9);
                res.status(500).json({
                    error: "Failed to fetch platform NFTs",
                    details: error_9.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPlatformNFTs = getPlatformNFTs;
