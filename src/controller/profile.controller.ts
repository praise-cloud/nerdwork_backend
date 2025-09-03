import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { creatorProfile, readerProfile } from "../model/profile";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const addCreatorProfile = async (req, res) => {
  try {
    const { userId, fullName, creatorName, phoneNumber, bio, genres } =
      req.body;

    const [profile] = await db
      .insert(creatorProfile)
      .values({
        userId,
        fullName,
        creatorName,
        phoneNumber,
        bio,
        genres,
      })
      .returning();

    return res.json({ profile });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: "Failed to create creator profile" });
  }
};

export const addReaderProfile = async (req, res) => {
  try {
    const { userId, genres, pin } = req.body;

    // Generate walletId (12 chars)
    const walletId = crypto.randomBytes(12).toString("hex");

    // Hash pin
    const pinHash = crypto.createHash("sha256").update(pin).digest("hex");

    const [profile] = await db
      .insert(readerProfile)
      .values({
        userId,
        genres,
        walletId,
        pinHash,
      })
      .returning();

    return res.json({ profile });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to create reader profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.userId;

    // Try fetching creator profile
    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, userId));

    if (creator) {
      return res.json({ role: "creator", profile: creator });
    }

    // Try fetching reader profile
    const [reader] = await db
      .select()
      .from(readerProfile)
      .where(eq(readerProfile.userId, userId));

    if (reader) {
      return res.json({ role: "reader", profile: reader });
    }

    return res.status(404).json({ message: "Profile not found" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
