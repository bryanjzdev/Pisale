import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado para subir archivos" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo" }, { status: 400 });
    }

    // Validar tamaño de archivo (Anti-DoS por agotamiento de disco)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "La imagen excede el límite permitido de 5 MB" }, { status: 400 });
    }

    // Validar tipo de archivo y extensión en lista blanca estricta
    const extension = (file.name.split(".").pop() || "").toLowerCase();
    if (!file.type.startsWith("image/") || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: "Formato no permitido. Solo se aceptan imágenes JPG, PNG o WebP" }, { status: 400 });
    }

    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Asegurar directorio destino
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "races");
    await mkdir(uploadsDir, { recursive: true });

    // Generar nombre de archivo único, sanitizado y seguro
    const cleanFileName = `race-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/races/${cleanFileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}
