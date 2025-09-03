import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { loyaltyPoints } from "../model/schema";

export async function addLoyaltyPoints(userId: string, purchaseAmount: number) {
  // Example: earn 10 points per purchase, or you can use amount-based logic
  const pointsToAdd = Math.floor(purchaseAmount * 0.1); // 🎉 10% cashback as points

  const existing = await db
    .select()
    .from(loyaltyPoints)
    .where(eq(loyaltyPoints.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(loyaltyPoints)
      .set({
        points: existing[0].points + pointsToAdd,
        lastUpdated: new Date(),
      })
      .where(eq(loyaltyPoints.userId, userId));
  } else {
    await db.insert(loyaltyPoints).values({
      userId,
      points: pointsToAdd,
    });
  }
}

export async function getLoyaltyPoints(userId: string) {
  const record = await db
    .select()
    .from(loyaltyPoints)
    .where(eq(loyaltyPoints.userId, userId))
    .limit(1);

  return record.length > 0 ? record[0].points : 0;
}
