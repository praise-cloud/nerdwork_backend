import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { authUsers } from "../model/schema";
import { loginWithGoogle } from "../services/profile.service";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { JWT_SECRET } from "../config/envs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthController = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Google ID token required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Client id is not defined" });
    }

    // ✅ Verify token with Google
    // const ticket = await client.verifyIdToken({
    //   idToken,
    //   audience: process.env.GOOGLE_CLIENT_ID,
    // });
    // const payload = ticket.getPayload();

    const payload: any = jwt.decode(idToken);
    console.log("🔎 Decoded Google payload:", payload);

    if (!payload) throw new Error("Invalid Google token");

    const { email, sub: googleId, picture } = payload;

    // ✅ Check if user already exists
    // const users = await db
    //   .select()
    //   .from(authUsers)
    //   .where(eq(authUsers.email, email));
    // const existingUser = users[0] ?? null;

    let user;
    let isNewUser = false;

    // if (existingUser) {
    //   user = existingUser;
    // } else {
    // ✅ Create new user
    const [newUser] = await db
      .insert(authUsers)
      .values({
        email,
        username: email.split("@")[0],
        passwordHash: "secret",
        emailVerified: true,
        twoFactorEnabled: false,
        lastLoginAt: new Date(), // provide value
        loginAttempts: 0,
        lockedUntil: new Date(), // provide value
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    user = newUser;
    isNewUser = true;
    // }

    // ✅ Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token, user, isNewUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
};

console.log(jwt?.sign);

export const googleLoginController = async (req: any, res: any) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token required" });
    }

    // ✅ verify token with Google
    const googleUser = await verifyGoogleToken(idToken);

    // proceed with login
    const { token, user } = await loginWithGoogle(googleUser);
    return res.status(200).json({ token, user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export async function verifyGoogleToken(idToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    return {
      email: payload.email!,
      fullName: payload.name || "",
      picture: payload.picture || "",
      googleId: payload.sub,
    };
  } catch (error) {
    throw new Error("Failed to verify Google token");
  }
}
