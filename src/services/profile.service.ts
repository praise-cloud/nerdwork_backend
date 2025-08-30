// services/profileService.ts
import { db } from "../config/db";
import jwt from "jsonwebtoken";
import { authUsers } from "../model/auth";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/envs";

export const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Google SignUp (with profiles attached)
export const signupWithGoogle = async ({
  email,
  fullName,
  picture,
  googleId,
}: {
  email: string;
  fullName: string;
  picture: string;
  googleId: string;
}) => {
  // Check if user already exists
  let [existingUser] = await db
    .select()
    .from(authUsers)
    .where(eq(authUsers.email, email));

  if (!existingUser) {
    // create a username from email prefix
    const username = email.split("@")[0] + "_" + Date.now();

    // store a placeholder password hash since Google handles auth
    const fakePassword = await bcrypt.hash(googleId, 10);

    [existingUser] = await db
      .insert(authUsers)
      .values({
        email,
        username,
        passwordHash: fakePassword,
        emailVerified: true, // Google verified emails are trusted
      })
      .returning();
  }
  // Generate JWT
  const token = generateToken(existingUser);

  return { token, user: existingUser };
};

// Google Login
export const loginWithGoogle = async (googleUser: { email: string }) => {
  const { email } = googleUser;

  const [user] = await db
    .select()
    .from(authUsers)
    .where(eq(authUsers.email, email));
  if (!user) {
    throw new Error("User not found");
  }

  const token = generateToken(user);

  return { token, user };
};

// verify google token
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
