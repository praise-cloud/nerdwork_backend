import { Router } from "express";
import {
  googleLoginController,
  googleSignup,
} from "../controller/auth.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GoogleSignupRequest:
 *       type: object
 *       required:
 *         - idToken
 *       properties:
 *         idToken:
 *           type: string
 *           description: Google ID token obtained from the frontend after Google Sign-In
 *           example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4OT..."
 *
 *     GoogleLoginRequest:
 *       type: object
 *       required:
 *         - idToken
 *       properties:
 *         idToken:
 *           type: string
 *           description: Google ID token obtained from the frontend after Google Sign-In
 *           example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4OT..."
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             email:
 *               type: string
 *               example: user@example.com
 *             username:
 *               type: string
 *               example: comicfan2024
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Invalid Google token"
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up with Google
 *     description: Create a new user account using Google authentication. Returns a JWT and user info.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleSignupRequest'
 *     responses:
 *       201:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid Google token or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/signup", googleSignup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with Google
 *     description: Authenticate an existing user using Google Sign-In. Returns a JWT and user info.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: User not found or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Missing Google ID token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", googleLoginController);

export default router;
