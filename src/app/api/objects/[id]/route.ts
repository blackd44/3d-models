import { type NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

// GET - Fetch single object
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    const object = await prisma.object.findFirst({
      where: { id, status: "published" },
      orderBy: { created_at: "desc" },
    });

    if (!object)
      return NextResponse.json(
        { success: false, error: "Object not found" },
        { status: 404 }
      );

    // Increment view count
    await prisma.object.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: object });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch object" },
      { status: 500 }
    );
  }
}

// PUT - Update object
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid object ID" },
        { status: 400 }
      );
    }

    // Check if object exists
    const existingObject = await prisma.object.findFirst({
      where: { id, status: "published" },
    });
    if (!existingObject) {
      return NextResponse.json(
        { success: false, error: "Object not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updateData: any = {
      title: body.title,
      description: body.description,
      category: body.category,
      tags: body.tags
        ? body.tags.split(",").map((tag: string) => tag.trim())
        : [],
      software: body.software || null,
      render_engine: body.renderEngine || null,
      poly_count: body.polyCount || null,
    };

    // Only update URLs if new ones are provided
    if (body.modelUrl && body.modelUrl !== existingObject.model_url) {
      updateData.model_url = body.modelUrl;
      updateData.model_public_id = body.modelPublicId;
    }

    if (
      body.thumbnailUrl &&
      body.thumbnailUrl !== existingObject.thumbnail_url
    ) {
      updateData.thumbnail_url = body.thumbnailUrl;
      updateData.thumbnail_public_id = body.thumbnailPublicId;
    }

    const updatedObject = await prisma.object.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: updatedObject });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update object" },
      { status: 500 }
    );
  }
}

// DELETE - Delete object
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid object ID" },
        { status: 400 }
      );
    }

    // Get object details first to delete from Cloudinary
    const object = await prisma.object.findFirst({
      where: { id, status: "published" },
    });
    if (!object) {
      return NextResponse.json(
        { success: false, error: "Object not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      if (object.model_public_id) {
        await deleteFromCloudinary(object.model_public_id, "raw");
      }
      if (object.thumbnail_public_id) {
        await deleteFromCloudinary(object.thumbnail_public_id, "image");
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    const deleted = await prisma.object.delete({
      where: { id },
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Failed to delete object" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Object deleted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete object" },
      { status: 500 }
    );
  }
}
