import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const objects = await prisma.object.findMany({
      where: { status: "published" },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ success: true, data: objects });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch objects" },
      { status: 500 }
    );
  }
}

// POST - Create new object
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const objectData = {
      title: body.title,
      description: body.description,
      category: body.category,
      model_url: body.modelUrl,
      model_public_id: body.modelPublicId,
      thumbnail_url: body.thumbnailUrl || null,
      thumbnail_public_id: body.thumbnailPublicId || null,
      tags: body.tags
        ? body.tags.split(",").map((tag: string) => tag.trim())
        : [],
      software: body.software || null,
      render_engine: body.renderEngine || null,
      poly_count: body.polyCount || null,
      status: "published",
    };

    const newObject = await prisma.object.create({
      data: objectData,
    });
    return NextResponse.json({ success: true, data: newObject });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create object" },
      { status: 500 }
    );
  }
}
