import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../config/db";
import { chapters, chapterTypeEnum } from "../model/chapter";
import { comics } from "../model/comic";
import { creatorProfile, readerProfile } from "../model/profile";
import { processContentPurchase } from "./transaction.controller";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createChapter = async (req, res) => {
  try {
    const { title, chapterType, price, summary, pages, comicId } = req.body;

    const finalPrice = chapterType === "free" ? 0 : price;

    const uniqueCode = Math.floor(1000 + Math.random() * 9000).toString();

    const [lastChapter] = await db
      .select({ serialNo: chapters.serialNo })
      .from(chapters)
      .where(eq(chapters.comicId, comicId))
      .orderBy(desc(chapters.serialNo)) // get the highest serialNo
      .limit(1);

    const serialNo = lastChapter ? lastChapter.serialNo + 1 : 1;

    const [newChapter] = await db
      .insert(chapters)
      .values({
        title,
        chapterType,
        price: finalPrice,
        summary,
        chapterStatus: "published",
        pages,
        serialNo,
        comicId,
        uniqueCode,
      })
      .returning();

    await db
      .update(comics)
      .set({
        noOfChapters: sql`${comics.noOfChapters} + 1`,
        comicStatus: "published",
      })
      .where(eq(comics.id, comicId));

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: newChapter,
    });
  } catch (err: any) {
    console.error("Create Chapter Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDraft = async (req, res) => {
  try {
    const { title, chapterType, price, summary, pages, comicId } = req.body;

    const finalPrice = chapterType === "free" ? 0 : price;

    const uniqueCode = Math.floor(1000 + Math.random() * 9000).toString();

    // insert chapter
    const [newChapter] = await db
      .insert(chapters)
      .values({
        title,
        chapterType,
        price: finalPrice,
        summary,
        pages,
        comicId,
        chapterStatus: "draft",
        uniqueCode,
      })
      .returning();

    // increment comic.noOfDrafts
    await db
      .update(comics)
      .set({ noOfDrafts: sql`${comics.noOfDrafts} + 1` })
      .where(eq(comics.id, comicId));

    return res.status(201).json({
      success: true,
      message: "Draft created successfully",
      data: newChapter,
    });
  } catch (err: any) {
    console.error("Create Draft Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch all chapters by Comic Slug for readers
export const fetchChaptersByComicSlugForReaders = async (req, res) => {
  try {
    const { slug } = req.params;

    const [comic] = await db.select().from(comics).where(eq(comics.slug, slug));
    if (!comic) {
      return res
        .status(404)
        .json({ success: false, message: "Comic not found" });
    }

    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.id, comic.creatorId));

    const allChapters = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.comicId, comic.id),
          eq(chapters.chapterStatus, "published")
        )
      );

    const data = allChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      chapterType: chapter.chapterType,
      chapterStatus: chapter.chapterStatus,
      price: chapter.price,
      summary: chapter.summary,
      pages: chapter.pages,
      serialNo: chapter.serialNo,
      uniqueCode: chapter.uniqueCode,
      createdAt: chapter.createdAt,
      updateAt: chapter.updatedAt,
      creatorName: creator.creatorName,
      comicSlug: comic.slug,
      comicTitle: comic.title,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Fetch Chapters Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch all chapters by Comic Slug for creators
export const fetchChaptersByComicSlugForCreators = async (req, res) => {
  try {
    const { slug } = req.params;

    const [comic] = await db.select().from(comics).where(eq(comics.slug, slug));
    if (!comic) {
      return res
        .status(404)
        .json({ success: false, message: "Comic not found" });
    }

    const allChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.comicId, comic.id));

    return res.status(200).json({
      success: true,
      data: allChapters,
    });
  } catch (err: any) {
    console.error("Fetch Chapters Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch single chapter by unique 4-digit code
export const fetchChapterByUniqueCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueCode, code));

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (err: any) {
    console.error("Fetch Chapter by Code Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const publishDraft = async (req, res) => {
  try {
    const { draftUniqCode, comicId } = req.params;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chapters)
      .where(eq(chapters.comicId, comicId));

    const serialNo = (count ?? 0) + 1;

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueCode, draftUniqCode));

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }
    await db
      .update(chapters)
      .set({
        chapterStatus: "published",
        serialNo,
      })
      .where(eq(chapters.id, chapter.id));

    await db
      .update(comics)
      .set({
        noOfChapters: sql`${comics.noOfChapters} + 1`,
        noOfDrafts: sql`${comics.noOfDrafts} - 1`,
        comicStatus: "published",
      })
      .where(eq(comics.id, comicId));

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (err: any) {
    console.error("publish draft error Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch chapter pages by chapter ID
export const fetchChapterPagesById = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId));

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    return res.status(200).json({
      success: true,
      data: chapter.pages,
    });
  } catch (err: any) {
    console.error("Fetch Pages Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const buyChapter = async (req: any, res: any) => {
  try {
    const { nwtAmount, pin, chapterId } = req.body;

    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = decoded.userId;

    const [reader] = await db
      .select()
      .from(readerProfile)
      .where(eq(readerProfile.userId, user));

    if (!reader) {
      return res.status(404).json({
        success: false,
        message: "Reader profile not found",
      });
    }

    // ✅ Verify PIN before proceeding
    const isPinValid = await bcrypt.compare(pin, reader.pinHash);
    if (!isPinValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect PIN",
      });
    }

    // Validate required fields
    if (!nwtAmount || nwtAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid NWT amount is required",
      });
    }

    // Get chapter details with comic information
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId));

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    // Get comic details
    const [comic] = await db
      .select()
      .from(comics)
      .where(eq(comics.id, chapter.comicId));

    if (!comic) {
      return res.status(404).json({
        success: false,
        message: "Comic not found",
      });
    }

    // Get creator information
    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.id, comic.creatorId));

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Process the purchase using transaction system
    const purchaseResult = await processContentPurchase(
      reader.fullName, // User making the purchase
      comic.creatorId, // Creator receiving payment
      chapterId, // Content being purchased (chapter ID)
      nwtAmount, // Amount in NWT
      "chapter_unlock", // Content type
      0.3 // Platform fee (30%)
    );

    if (!purchaseResult.success) {
      return res.status(400).json({
        success: false,
        message: purchaseResult || "Failed to process purchase",
        error: purchaseResult,
      });
    }

    // Return success response with transaction details
    return res.status(200).json({
      success: true,
      message: "Chapter purchased successfully!",
      data: {
        chapter: {
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.serialNo,
        },
        comic: {
          id: comic.id,
          title: comic.title,
          slug: comic.slug,
        },
        creator: {
          id: creator.id,
          name: creator.creatorName,
        },
        // transaction: {
        //   userTransactionId: purchaseResult.userTransaction?.id,
        //   creatorTransactionId: purchaseResult.creatorTransaction?.id,
        //   nwtAmount,
        //   userNewBalance: purchaseResult.userNewBalance,
        //   creatorNewBalance: purchaseResult.creatorNewBalance,
        // },
      },
    });
  } catch (error: any) {
    console.error("Error buying chapter:", error);

    // Handle specific error types
    if (error.message === "Insufficient balance") {
      return res.status(400).json({
        success: false,
        message: "Insufficient NWT balance. Please purchase more tokens.",
        errorCode: "INSUFFICIENT_BALANCE",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to purchase chapter",
      error: error.message,
    });
  }
};
