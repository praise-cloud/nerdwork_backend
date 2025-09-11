import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { comics } from "../model/comic";
import jwt from "jsonwebtoken";
import { creatorProfile } from "../model/profile";
import { library } from "../model/library";
import { generateFileUrl } from "./file.controller";

export const createComic = async (req, res) => {
  try {
    const { title, language, ageRating, description, image, genre, tags } =
      req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, userId));

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Extract only the file path (if frontend sends full CloudFront URL)
    let imagePath = image;
    if (image && image.startsWith("http")) {
      try {
        const url = new URL(image);
        imagePath = url.pathname.startsWith("/")
          ? url.pathname.substring(1) // remove leading "/"
          : url.pathname;
      } catch (err) {
        console.warn("Invalid image URL provided, storing raw value:", image);
      }
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${
      creator.creatorName
    }`;

    const [comic] = await db
      .insert(comics)
      .values({
        title,
        language,
        ageRating,
        description,
        image: imagePath,
        slug,
        genre,
        tags,
        comicStatus: "draft",
        creatorId: creator.id,
      })
      .returning();

    return res.status(200).json({ comic, slug });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to create comic" });
  }
};

export const fetchAllComicByJwt = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.userId;

    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, userId));
    if (!creator) {
      return res.status(404).json({ message: "Creator With Jwt not found" });
    }

    const userComics = await db
      .select()
      .from(comics)
      .where(eq(comics.creatorId, creator.id));

    const data = userComics.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      language: chapter.language,
      ageRating: chapter.ageRating,
      noOfChapters: chapter.noOfChapters,
      noOfDrafts: chapter.noOfDrafts,
      description: chapter.description,
      image: generateFileUrl(chapter.image),
      comicStatus: chapter.comicStatus,
      genre: chapter.genre,
      tags: chapter.tags,
      slug: chapter.slug,
      creatorName: creator.creatorName,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    }));

    return res.json({ comics: data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch comics" });
  }
};

export const fetchComicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [comic] = await db.select().from(comics).where(eq(comics.slug, slug));

    if (!comic) return res.status(404).json({ message: "Comic not found" });

    const data = {
      id: comic.id,
      title: comic.title,
      language: comic.language,
      ageRating: comic.ageRating,
      noOfChapters: comic.noOfChapters,
      noOfDrafts: comic.noOfDrafts,
      description: comic.description,
      image: generateFileUrl(comic.image),
      comicStatus: comic.comicStatus,
      genre: comic.genre,
      tags: comic.tags,
      slug: comic.slug,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
    };

    return res.json({ data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch comic" });
  }
};

export const fetchComicBySlugForReaders = async (req, res) => {
  try {
    const { slug } = req.params;

    const [comic] = await db.select().from(comics).where(eq(comics.slug, slug));
    if (!comic) return res.status(404).json({ message: "Comic not found" });

    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.id, comic.creatorId));

    const [libraries] = await db
      .select()
      .from(library)
      .where(eq(library.comicId, comic.id));

    const inLibrary = !!libraries;

    const data = {
      id: comic.id,
      title: comic.title,
      language: comic.language,
      ageRating: comic.ageRating,
      noOfChapters: comic.noOfChapters,
      noOfDrafts: comic.noOfDrafts,
      description: comic.description,
      image: generateFileUrl(comic.image),
      comicStatus: comic.comicStatus,
      genre: comic.genre,
      tags: comic.tags,
      slug: comic.slug,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
      creatorName: creator.creatorName,
      inLibrary,
    };

    return res.json({
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch comic" });
  }
};

export const fetchAllComics = async (req, res) => {
  try {
    const publishedComics = await db
      .select()
      .from(comics)
      .where(eq(comics.comicStatus, "published"));

    const data = await Promise.all(
      publishedComics.map(async (chapter) => {
        const [creator] = await db
          .select()
          .from(creatorProfile)
          .where(eq(creatorProfile.id, chapter.creatorId));

        return {
          ...chapter,
          image: generateFileUrl(chapter.image),
          creatorName: creator?.creatorName || "Unknown",
        };
      })
    );

    return res.json({ comics: data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch comics" });
  }
};

export const deleteComicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [comic] = await db.select().from(comics).where(eq(comics.slug, slug));

    if (!comic) return res.status(404).json({ message: "Comic not found" });

    await db.delete(comics).where(eq(comics.slug, slug));

    return res.json({ message: "Comic deleted Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch comic" });
  }
};

// ✅ Search comics by title
// export const searchComics = async (req, res) => {
//   try {
//     const { q } = req.query; // frontend sends /comics/search?q=title
//     if (!q) return res.status(400).json({ message: "Search query required" });

//     const results = await db
//       .select()
//       .from(comics)
//       .where(ilike(comics.title, `%${q}%`));

//     return res.json({ results });
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({ message: "Failed to search comics" });
//   }
// };
