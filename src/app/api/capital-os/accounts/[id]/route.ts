/**
 * CapitalOS — Single Account API
 * PATCH  /api/capital-os/accounts/[id]  → update account
 * DELETE /api/capital-os/accounts/[id]  → soft-delete (archive)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import {
  AccountRequestSchema,
  validateRequest,
  ValidationError,
  formatValidationError,
} from "@/lib/capital-os/schemas";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;
  const { id } = await ctx.params;

  try {
    const existing = await prisma.capitalAccount.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Validate request with Zod schema (partial for PATCH)
    const validated = validateRequest(AccountRequestSchema.partial(), body);

    const updateData: Record<string, unknown> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.balance !== undefined) updateData.balance = validated.balance;
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.icon !== undefined) updateData.icon = validated.icon;
    if (validated.color !== undefined) updateData.color = validated.color;

    const account = await prisma.capitalAccount.update({
      where: { id },
      data: updateData,
    });

    // Log the update
    await prisma.capitalSyncLog.create({
      data: {
        userId,
        source: "MANUAL",
        action: "UPDATE",
        entityType: "ACCOUNT",
        entityId: id,
        before: {
          ...existing,
          balance: Number(existing.balance),
        },
        after: {
          ...account,
          balance: Number(account.balance),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...account, balance: Number(account.balance) },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to update account:", {
      userId,
      accountId: id,
      error: error instanceof Error ? error.message : String(error),
    });

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(formatValidationError(error), { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update account",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;
  const { id } = await ctx.params;

  try {
    const existing = await prisma.capitalAccount.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    // Check if we are doing an UNDO (restoring)
    const { searchParams } = new URL(req.url);
    const undo = searchParams.get("undo") === "true";

    const updated = await prisma.capitalAccount.update({
      where: { id },
      data: { archivedAt: undo ? null : new Date() },
    });

    // Log the action
    await prisma.capitalSyncLog.create({
      data: {
        userId,
        source: "MANUAL",
        action: undo ? "RESTORE" : "DELETE",
        entityType: "ACCOUNT",
        entityId: id,
        before: { ...existing, balance: Number(existing.balance) },
        after: { ...updated, balance: Number(updated.balance) },
      },
    });

    return NextResponse.json({
      success: true,
      data: { archived: !undo },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to delete/restore account:", {
      userId,
      accountId: id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete account",
      },
      { status: 500 }
    );
  }
}
