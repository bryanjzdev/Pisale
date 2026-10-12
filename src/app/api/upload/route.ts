import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen (JPG, PNG, WebP)" }, { status: 400 });
    }

    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Asegurar directorio destino
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "races");
    await mkdir(uploadsDir, { recursive: true });

    // Generar nombre de archivo único y seguro
    const extension = file.name.split(".").pop() || "jpg";
    const cleanFileName = `race-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/races/${cleanFileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}
