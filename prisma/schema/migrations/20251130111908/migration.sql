-- CreateTable
CREATE TABLE "neon_auth.users_sync" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "raw_json" JSONB NOT NULL,

    CONSTRAINT "neon_auth.users_sync_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth.users_sync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth.users_sync"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth.users_sync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
