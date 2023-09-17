-- CreateTable
CREATE TABLE "User" (
    "use_id" SERIAL NOT NULL,
    "use_email" TEXT NOT NULL,
    "use_name" TEXT,
    "password" TEXT NOT NULL,
    "use_token" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("use_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_use_email_key" ON "User"("use_email");
