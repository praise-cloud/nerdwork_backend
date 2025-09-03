import { Router } from "express";
import {
  createApiCollection,
  getAssetData,
  mintApiNFT,
  upload,
} from "../controller/nft.controller";

const router = Router();

// Payment routes
// This route creates a payment link using the Helio API
// It requires the user to be authenticated
// The payment link can be used for various payment methods like card, bank transfer, etc.
// The webhook is set up to listen for payment events
router.post("/mint", upload.single("image"), mintApiNFT);
router.post("/collection/create", createApiCollection);
router.post("/asset/:assetId", getAssetData);
router.post("/asset/owner/:ownerAddress", getAssetData);

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Comic NFT Minting API is running" });
});

export default router;
