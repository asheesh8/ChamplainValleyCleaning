import { NextResponse, type NextRequest } from "next/server";

/**
 * Chat endpoint — INTENTIONALLY NOT WIRED TO A MODEL.
 *
 * The widget in `src/components/chat/` currently answers from a local scripted
 * responder, so this route is unused at runtime. It exists as the seam: when
 * the owner is ready to pay for an LLM, this is the only file that needs real
 * work, plus swapping `scriptedReply()` for a fetch to here.
 *
 * Sketch of the real implementation:
 *
 *   import Anthropic from "@anthropic-ai/sdk";
 *   const client = new Anthropic();
 *
 *   // Ground the model in what the owner actually published, so it can't
 *   // invent services or prices for a real business.
 *   const [services, settings] = await Promise.all([
 *     prisma.service.findMany({ where: { active: true } }),
 *     prisma.siteSetting.findMany(),
 *   ]);
 *
 *   const stream = await client.messages.stream({
 *     model: "claude-sonnet-5",
 *     max_tokens: 512,
 *     system: buildSystemPrompt(services, settings),
 *     messages,
 *   });
 *
 * Then persist the turn to `conversations` / `chat_messages` (both already
 * modelled in prisma/schema.prisma) so transcripts show up in the admin.
 *
 * Guardrails to keep: never quote a firm price, always offer the phone number,
 * and hand anything binding off to the quote form.
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "The chat assistant UI is built but no language model is connected yet.",
    },
    { status: 501 },
  );
}
