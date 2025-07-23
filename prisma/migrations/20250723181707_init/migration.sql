-- CreateTable
CREATE TABLE "Object" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "model_url" TEXT NOT NULL,
    "model_public_id" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "thumbnail_public_id" TEXT,
    "tags" TEXT[],
    "software" TEXT,
    "render_engine" TEXT,
    "poly_count" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);
