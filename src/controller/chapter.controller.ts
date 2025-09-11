import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../config/db";
import { chapters, chapterTypeEnum, paidChapters } from "../model/chapter";
import { comics } from "../model/comic";
import { creatorProfile, readerProfile } from "../model/profile";
import { processContentPurchase } from "./transaction.controller";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { mapFilesToUrls } from "./file.controller";

// helper function to strip URL
function extractFilePath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith("/")
      ? urlObj.pathname.slice(1)
      : urlObj.pathname;
  } catch (err) {
    // fallback in case url is not a valid URL
    return url;
  }
}

export const createChapter = async (req, res) => {
  try {
    const { title, chapterType, price, summary, pages, comicId } = req.body;

    const finalPrice = chapterType === "free" ? 0 : price;
    const uniqueCode = Math.floor(1000 + Math.random() * 9000).toString();

    // clean up the pages array
    const cleanedPages = Array.isArray(pages)
      ? pages.map((p) => extractFilePath(p))
      : [];

    const [lastChapter] = await db
      .select({ maxSerial: sql<number>`MAX(${chapters.serialNo})` })
      .from(chapters)
      .where(
        and(
          eq(chapters.comicId, comicId),
          eq(chapters.chapterStatus, "published")
        )
      );

    const nextSerial = (lastChapter?.maxSerial || 0) + 1;

    const [newChapter] = await db
      .insert(chapters)
      .values({
        title,
        chapterType,
        price: finalPrice,
        summary,
        chapterStatus: "published",
        pages: cleanedPages,
        serialNo: nextSerial,
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

    // clean up the pages array
    const cleanedPages = Array.isArray(pages)
      ? pages.map((p) => extractFilePath(p))
      : [];

    const [newChapter] = await db
      .insert(chapters)
      .values({
        title,
        chapterType,
        price: finalPrice,
        summary,
        pages: cleanedPages,
        comicId,
        chapterStatus: "draft",
        uniqueCode,
      })
      .returning();

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

export const fetchChaptersByComicSlugForReaders = async (req, res) => {
  try {
    const { slug } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

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

    const paid = await db
      .select({ chapterId: paidChapters.chapterId })
      .from(paidChapters)
      .where(eq(paidChapters.readerId, userId));

    const paidChapterIds = new Set(paid.map((p) => p.chapterId));

    console.log("Paid Chapters", paidChapterIds);

    const data = allChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      chapterType: chapter.chapterType,
      chapterStatus: chapter.chapterStatus,
      price: chapter.price,
      summary: chapter.summary,
      pages: mapFilesToUrls(chapter.pages),
      serialNo: chapter.serialNo,
      uniqueCode: chapter.uniqueCode,
      createdAt: chapter.createdAt,
      updateAt: chapter.updatedAt,
      creatorName: creator.creatorName,
      comicSlug: comic.slug,
      comicTitle: comic.title,
      hasPaid: paidChapterIds.has(chapter.id),
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

    const data = allChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      chapterType: chapter.chapterType,
      chapterStatus: chapter.chapterStatus,
      price: chapter.price,
      summary: chapter.summary,
      pages: mapFilesToUrls(chapter.pages),
      serialNo: chapter.serialNo,
      uniqueCode: chapter.uniqueCode,
      createdAt: chapter.createdAt,
      updateAt: chapter.updatedAt,
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

    const data = {
      id: chapter.id,
      title: chapter.title,
      chapterType: chapter.chapterType,
      chapterStatus: chapter.chapterStatus,
      price: chapter.price,
      summary: chapter.summary,
      pages: mapFilesToUrls(chapter.pages),
      serialNo: chapter.serialNo,
      uniqueCode: chapter.uniqueCode,
      createdAt: chapter.createdAt,
      updateAt: chapter.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Fetch Chapter by Code Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const publishDraft = async (req, res) => {
  try {
    const { draftUniqCode, comicId } = req.body;

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueCode, draftUniqCode));

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    const [lastChapter] = await db
      .select({ maxSerial: sql<number>`MAX(${chapters.serialNo})` })
      .from(chapters)
      .where(
        and(
          eq(chapters.comicId, comicId),
          eq(chapters.chapterStatus, "published")
        )
      );

    const nextSerial = (lastChapter?.maxSerial || 0) + 1;

    await db
      .update(chapters)
      .set({
        chapterStatus: "published",
        serialNo: nextSerial,
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
      message: "Draft published successfully",
    });
  } catch (err: any) {
    console.error("Publish Draft Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

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
      data: mapFilesToUrls(chapter.pages),
    });
  } catch (err: any) {
    console.error("Fetch Pages Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const deleteChapter = async (req, res) => {
  try {
    const { code } = req.params;

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueCode, code));
    if (!chapter) {
      return res.status(404).json({ message: "Chapter with code not found" });
    }

    const [comic] = await db
      .select()
      .from(comics)
      .where(eq(comics.id, chapter.comicId));
    if (!comic) {
      return res.status(404).json({ message: "comic not found for chapter" });
    }

    await db.delete(chapters).where(eq(chapters.uniqueCode, code));

    const publishedChapters = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.comicId, comic.id),
          eq(chapters.chapterStatus, "published")
        )
      )
      .orderBy(chapters.serialNo);

    for (let i = 0; i < publishedChapters.length; i++) {
      await db
        .update(chapters)
        .set({ serialNo: i + 1 })
        .where(eq(chapters.id, publishedChapters[i].id));
    }

    await db
      .update(comics)
      .set({
        noOfChapters: sql`${comics.noOfChapters} - 1`,
      })
      .where(eq(comics.id, comic.id));

    return res.status(200).json({
      success: true,
      message: "Chapter deleted and serial numbers resequenced",
    });
  } catch (err: any) {
    console.error("Delete Chapter Error:", err);
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
      reader.id,
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

export const fetchAllPaidChapters = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const [reader] = await db
      .select()
      .from(readerProfile)
      .where(eq(readerProfile.userId, userId));
    if (!reader) {
      return res.status(404).json({ message: "Reader With Jwt not found" });
    }

    // 2️⃣ Fetch all paid chapters for this reader
    const paid = await db
      .select({
        chapterId: paidChapters.chapterId,
        paidAt: paidChapters.paidAt,
        title: chapters.title,
        serialNo: chapters.serialNo,
        comicId: chapters.comicId,
        comicTitle: comics.title,
        comicSlug: comics.slug,
      })
      .from(paidChapters)
      .innerJoin(chapters, eq(paidChapters.chapterId, chapters.id))
      .innerJoin(comics, eq(chapters.comicId, comics.id))
      .where(eq(paidChapters.readerId, reader.id));

    // 3️⃣ Map chapter pages with signed URLs (optional)
    const data = paid.map((record) => ({
      chapterId: record.chapterId,
      title: record.title,
      serialNo: record.serialNo,
      comicId: record.comicId,
      comicTitle: record.comicTitle,
      comicSlug: record.comicSlug,
      paidAt: record.paidAt,
      // optional: if you want to return the full pages with signed urls
      // pages: mapFilesToUrls(record.pages),
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Fetch Paid Chapters Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
