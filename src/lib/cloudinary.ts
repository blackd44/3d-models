import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  resource_type: string
  format: string
  bytes: number
}

/**
 * Upload a 3D model file to Cloudinary
 */
export async function upload3DModel(file: File, folder = "3d-models"): Promise<CloudinaryUploadResult> {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "raw", // For 3D models (GLB/GLTF files)
      public_id: `${Date.now()}-${file.name.split(".")[0]}`,
      use_filename: true,
      unique_filename: true,
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error("Error uploading 3D model to Cloudinary:", error)
    throw new Error("Failed to upload 3D model")
  }
}

/**
 * Upload an image file to Cloudinary
 */
export async function uploadImage(file: File, folder = "thumbnails"): Promise<CloudinaryUploadResult> {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      public_id: `${Date.now()}-${file.name.split(".")[0]}`,
      transformation: [{ width: 800, height: 600, crop: "fill", quality: "auto" }, { fetch_format: "auto" }],
      use_filename: true,
      unique_filename: true,
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    throw new Error("Failed to upload image")
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "raw" = "image"): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw new Error("Failed to delete file from Cloudinary")
  }
}

/**
 * Generate a thumbnail for a 3D model (if supported)
 */
export async function generateThumbnail(modelPublicId: string): Promise<string> {
  try {
    // Generate a thumbnail URL for the 3D model
    // Note: This is a placeholder - Cloudinary doesn't directly generate thumbnails for 3D models
    // You might need to use a separate service or generate thumbnails client-side
    const thumbnailUrl = cloudinary.url(modelPublicId, {
      resource_type: "raw",
      format: "jpg",
      transformation: [{ width: 400, height: 300, crop: "fill" }],
    })

    return thumbnailUrl
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return "/placeholder.svg?height=300&width=400"
  }
}

export default cloudinary
