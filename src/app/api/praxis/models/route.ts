/**
 * GET /api/praxis/models
 * POST /api/praxis/models
 *
 * Manage per-learner LLM model preferences.
 * GET returns current preferences + available models list.
 * POST updates preferences (authenticated learners only).
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  AVAILABLE_MODELS,
  ModelPreferences,
  ModelTask,
  createModelResolver,
  getUniversalModel,
} from "@/lib/praxis/openrouter/models";

export const runtime = "nodejs";

interface ModelInfo {
  task: ModelTask;
  current: string;
  available: typeof AVAILABLE_MODELS;
}

interface GetResponse {
  universalDefault: string;
  preferences: ModelPreferences | null;
  tasks: ModelInfo[];
}

export async function GET(): Promise<
  NextResponse<GetResponse | { error: string }>
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch learner preferences
  const { data: learner, error: learnerErr } = await supabase
    .from("nexus_users")
    .select("model_preferences")
    .eq("id", user.id)
    .maybeSingle();

  if (learnerErr) {
    console.error("[praxis/models] Failed to fetch preferences:", learnerErr);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 },
    );
  }

  const preferences =
    (learner?.model_preferences as ModelPreferences | null) ?? null;
  const resolver = createModelResolver(preferences);

  const tasks: ModelInfo[] = [
    {
      task: ModelTask.GUARDRAIL,
      current: resolver(ModelTask.GUARDRAIL),
      available: AVAILABLE_MODELS,
    },
    {
      task: ModelTask.CURRICULUM,
      current: resolver(ModelTask.CURRICULUM),
      available: AVAILABLE_MODELS,
    },
    {
      task: ModelTask.UNIT,
      current: resolver(ModelTask.UNIT),
      available: AVAILABLE_MODELS,
    },
    {
      task: ModelTask.ONBOARDING,
      current: resolver(ModelTask.ONBOARDING),
      available: AVAILABLE_MODELS,
    },
    {
      task: ModelTask.JUDGE,
      current: resolver(ModelTask.JUDGE),
      available: AVAILABLE_MODELS,
    },
  ];

  return NextResponse.json({
    universalDefault: getUniversalModel(),
    preferences,
    tasks,
  });
}

interface PostBody {
  preferences: ModelPreferences;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<{ success: true } | { error: string }>> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate model slugs are from allowed list
  const validSlugs = new Set(AVAILABLE_MODELS.map((m) => m.slug));
  const prefs = body.preferences;

  for (const [task, slug] of Object.entries(prefs)) {
    if (slug && !validSlugs.has(slug)) {
      return NextResponse.json(
        { error: `Invalid model slug "${slug}" for task "${task}"` },
        { status: 400 },
      );
    }
  }

  // Update preferences
  const { error: updateErr } = await supabase
    .from("nexus_users")
    .update({ model_preferences: prefs })
    .eq("id", user.id);

  if (updateErr) {
    console.error("[praxis/models] Failed to update preferences:", updateErr);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
