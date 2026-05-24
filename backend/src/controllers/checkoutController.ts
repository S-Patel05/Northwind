import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { getAuth } from "@clerk/express";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { getLocalUser } from "../lib/users";
import {
  products,
  orders,
  orderItems,
} from "../db/schema";

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function createCheckout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Only signed-in users
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Validate cart
    const parsed = cartSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid cart",
        details: parsed.error.flatten(),
      });
    }

    // Get logged in user
    const localUser = await getLocalUser(userId);

    if (!localUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const ids = parsed.data.items.map(
      (item) => item.productId
    );

    // Get products from database
    const prodRows = await db
      .select()
      .from(products)
      .where(
        and(
          inArray(products.id, ids),
          eq(products.active, true)
        )
      );

    if (prodRows.length !== ids.length) {
      return res.status(400).json({
        error: "One or more products are invalid",
      });
    }

    const byId = new Map(
      prodRows.map((p) => [p.id, p])
    );

    let totalCents = 0;

    // Calculate total
    for (const item of parsed.data.items) {
      const product = byId.get(item.productId);

      if (!product) continue;

      totalCents +=
        product.priceCents * item.quantity;
    }

    // Create order
const [order] = await db
  .insert(orders)
  .values({
    userId: localUser.id,
    totalCents,
  })
  .returning();

    // Create order items
    await db.insert(orderItems).values(
      parsed.data.items.map((item) => {
        const product = byId.get(item.productId)!;

        return {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
        };
      })
    );

    // Success response
    return res.status(200).json({
      success: true,
      message: "Order confirmed",
      orderId: order.id,
      totalCents,
    });
  } catch (error) {
    next(error);
  }
}