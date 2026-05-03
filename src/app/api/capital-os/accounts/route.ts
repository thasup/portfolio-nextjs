/**
 * CapitalOS — Accounts API
 * GET  /api/capital-os/accounts  → list user's accounts
 * POST /api/capital-os/accounts  → create a new account
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

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;

  try {
    const accounts = await prisma.capitalAccount.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deletedAccounts = await prisma.capitalAccount.findMany({
      where: {
        userId,
        archivedAt: { gte: twentyFourHoursAgo },
      },
      orderBy: { archivedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        accounts: accounts.map((a) => ({
          ...a,
          balance: Number(a.balance),
        })),
        deletedAccounts: deletedAccounts.map((a) => ({
          ...a,
          balance: Number(a.balance),
        })),
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch accounts:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch accounts",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;

  try {
    const body = await req.json();

    // Validate request with Zod schema
    const validated = validateRequest(AccountRequestSchema, body);

    const account = await prisma.capitalAccount.create({
      data: {
        userId,
        name: validated.name,
        balance: validated.balance,
        type: validated.type,
        source: validated.source ?? "MANUAL",
        externalId: validated.externalId ?? null,
        icon: validated.icon ?? null,
        color: validated.color ?? null,
      },
    });

    // Log the creation
    await prisma.capitalSyncLog.create({
      data: {
        userId,
        source: "MANUAL",
        action: "CREATE",
        entityType: "ACCOUNT",
        entityId: account.id,
        after: {
          ...account,
          balance: Number(account.balance),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...account,
          balance: Number(account.balance),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CapitalOS] Failed to create account:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(formatValidationError(error), { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create account",
      },
      { status: 500 }
    );
  }
}
