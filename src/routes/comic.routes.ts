import { Router } from "express";
import {
  createComic,
  fetchAllComicByJwt,
  fetchComicBySlug,
  fetchAllComics,
  fetchComicBySlugForReaders,
  deleteComicBySlug,
  subscribeForcomic,
} from "../controller/comic.controller";

const router = Router();

router.post("/create", createComic);
router.get("/mine", fetchAllComicByJwt);
router.get("/all-comics", fetchAllComics);
router.get("/:slug", fetchComicBySlug);
router.get("/reader/:slug", fetchComicBySlugForReaders);
router.delete("/delete/:slug", deleteComicBySlug);
router.post("/subscribe/:comicId", subscribeForcomic);

/**
 * @swagger
 * tags:
 *   name: Comics
 *   description: Comic creation and retrieval endpoints
 */

/**
 * @swagger
 * /comics/create:
 *   post:
 *     summary: Create a new comic
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - language
 *               - ageRating
 *               - description
 *               - image
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Epic Adventure"
 *               language:
 *                 type: string
 *                 example: "English"
 *               ageRating:
 *                 type: string
 *                 example: "13+"
 *               description:
 *                 type: string
 *                 example: "A thrilling adventure story."
 *               image:
 *                 type: string
 *                 example: "https://cdn.example.com/comic-cover.jpg"
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["adventure", "fantasy"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["magic", "hero", "journey"]
 *     responses:
 *       200:
 *         description: Comic successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comic:
 *                   $ref: '#/components/schemas/Comic'
 *                 slug:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Failed to create comic
 */

/**
 * @swagger
 * /comics/mine:
 *   get:
 *     summary: Fetch all comics created by the logged-in creator
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of creator's comics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comic'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Creator not found
 */

/**
 * @swagger
 * /comics/{slug}:
 *   get:
 *     summary: Fetch a comic by its slug
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the comic
 *     responses:
 *       200:
 *         description: Comic found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comic:
 *                   $ref: '#/components/schemas/Comic'
 *       404:
 *         description: Comic not found
 *       400:
 *         description: Failed to fetch comic
 */

/**
 * @swagger
 * /comics/reader/{slug}:
 *   get:
 *     summary: Fetch a comic by its slug for readers
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the comic
 *     responses:
 *       200:
 *         description: Comic found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comic:
 *                   $ref: '#/components/schemas/Comic'
 *       404:
 *         description: Comic not found
 *       400:
 *         description: Failed to fetch comic
 */

/**
 * @swagger
 * /comics/all-comics:
 *   get:
 *     summary: Fetch all comics (reader view)
 *     tags: [Comics]
 *     responses:
 *       200:
 *         description: List of all comics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comic'
 *       400:
 *         description: Failed to fetch comics
 */

/**
 * @swagger
 * /comics/delete/{slug}:
 *   delete:
 *     summary: Delete a comic by slug
 *     tags:
 *       - Comics
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: slug of the comic
 *     responses:
 *       200:
 *         description: comic deleted
 *       404:
 *         description: comic not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comics/subscribe/{comicId}:
 *   post:
 *     summary: Subscribe or unsubscribe for a comic
 *     description: Toggles a Subscribe for the given comic. If already subscribed, it will be unsubscribed; otherwise, it will be subscribed.
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the comic
 *         example: "chap_abc123"
 *     responses:
 *       200:
 *         description: Subscribe status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Comic Subscribed" or "Comic Unsubscribed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ComicId:
 *                       type: string
 *                       example: "chap_abc123"
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                     likesCount:
 *                       type: number
 *                       example: 42
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reader or Comic not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         language:
 *           type: string
 *         ageRating:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         slug:
 *           type: string
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         creatorId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default router;
