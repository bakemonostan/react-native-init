import { generateProjectZip, safeZipFilename } from "@/lib/generator";
import { scaffoldConfigSchema } from "@/lib/config/schema";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = scaffoldConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid wizard payload",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const buf = await generateProjectZip(parsed.data);
    const name = safeZipFilename(parsed.data.slug);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${name}.zip"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg.startsWith("ZIP_TEMPLATE_SOURCE") ? 503 : 500;
    return NextResponse.json(
      { error: "ZIP_GENERATE_FAILED", message: msg },
      { status },
    );
  }
}
