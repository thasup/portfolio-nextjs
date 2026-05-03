import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.CURRENCY_FREAKS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "CURRENCY_FREAKS_TOKEN is not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${token}&symbols=THB,USD`, {
      next: { revalidate: 3600 } // Cache for 1 hour to avoid API limits
    });
    
    if (!res.ok) {
      throw new Error(`CurrencyFreaks API responded with ${res.status}`);
    }

    const data = await res.json();
    
    // The API returns rates relative to USD by default.
    // e.g. { rates: { THB: "34.5", USD: "1.0" } }
    const thbRate = parseFloat(data.rates.THB);
    
    return NextResponse.json({ rate: thbRate });
  } catch (error) {
    console.error("Failed to fetch FX rate:", error);
    return NextResponse.json({ error: "Failed to fetch FX rate" }, { status: 500 });
  }
}
