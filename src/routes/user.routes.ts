import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/common/auth";

const router = Router();

router.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  res.json({
    message: `User profile for user ${userId}`,
  });
});

export default router;
