import { type NextRequest, NextResponse } from "next/server";
import { upload3DModel, uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    if (type === "model") {
      const validModelTypes = [
        "model/gltf-binary",
        "model/gltf+json",
        "application/octet-stream",
      ];
      const validExtensions = [".glb", ".gltf"];
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!validModelTypes.includes(file.type) && !hasValidExtension)
        return NextResponse.json(
          { error: "Invalid file type. Please upload a GLB or GLTF file." },
          { status: 400 }
        );

      // Check file size (max 50MB for 3D models)
      if (file.size > 50 * 1024 * 1024)
        return NextResponse.json(
          { error: "File too large. Maximum size is 50MB." },
          { status: 400 }
        );

      const result = await upload3DModel(file);
      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        type: "model",
        size: result.bytes,
      });
    } else if (type === "image") {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!validImageTypes.includes(file.type))
        return NextResponse.json(
          {
            error:
              "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
          },
          { status: 400 }
        );

      // Check file size (max 10MB for images)
      if (file.size > 10 * 1024 * 1024)
        return NextResponse.json(
          { error: "File too large. Maximum size is 10MB." },
          { status: 400 }
        );

      const result = await uploadImage(file);
      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        type: "image",
        size: result.bytes,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
