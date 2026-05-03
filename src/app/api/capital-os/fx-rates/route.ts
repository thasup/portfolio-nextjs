/**
 * CapitalOS — Foreign Exchange Rates API
 * GET /api/capital-os/fx-rates → get current FX rates with smart caching
 */
import { NextRequest, NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { getFXRates, FXRateError } from "@/lib/capital-os/fx-rates";

export async function GET(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const rates = await getFXRates(userId, forceRefresh);

    return NextResponse.json({
      success: true,
      data: {
        base: rates.base,
        date: rates.date,
        rates: rates.rates,
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch FX rates:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof FXRateError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: "FX_RATE_ERROR",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch FX rates",
      },
      { status: 500 }
    );
  }
}
