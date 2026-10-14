"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No autenticado");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isOwnerEmail = session.user.email.toLowerCase() === "bjm.dev.soft@gmail.com";
  const isAdmin = dbUser?.role === "ADMIN" || isOwnerEmail;

  if (!isAdmin) {
    throw new Error("No tienes permisos de Administrador.");
  }

  // Si es el correo del dueño y aún no es ADMIN en BD, promoverlo automáticamente
  if (isOwnerEmail && dbUser && dbUser.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    });
  }

  return { session, dbUser };
}

export async function aprobarOrganizacion(orgId: string) {
  try {
    await verifyAdmin();

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { status: "VERIFIED" },
    });

    // Asegurar que el dueño tenga el rol ORGANIZADOR
    await prisma.user.update({
      where: { id: org.ownerId },
      data: { role: "ORGANIZADOR" },
    });

    revalidatePath("/admin");
    revalidatePath("/organizador/dashboard");
    revalidatePath("/organizador/crear");

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al aprobar la organización." };
  }
}

export async function rechazarOrganizacion(orgId: string) {
  try {
    await verifyAdmin();

    await prisma.organization.update({
      where: { id: orgId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al rechazar la organización." };
  }
}

export async function cambiarEstadoCarrera(raceId: string, status: "PUBLISHED" | "DRAFT" | "COMPLETED") {
  try {
    await verifyAdmin();

    await prisma.race.update({
      where: { id: raceId },
      data: { status },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/carreras");
    revalidatePath(`/carrera/${raceId}`);

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al actualizar la carrera." };
  }
}

export async function cambiarRolUsuario(userId: string, role: "CORREDOR" | "ORGANIZADOR" | "ADMIN") {
  try {
    await verifyAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Error al cambiar el rol del usuario." };
  }
}

export async function generarDemo3Dias() {
  try {
    const { dbUser } = await verifyAdmin();

    // 1. Obtener o crear usuario demo
    const demoEmail = `demo.organizador.${Date.now().toString().slice(-4)}@pisale.mx`;
    const demoOwner = await prisma.user.create({
      data: {
        name: "Organizador Demo Písale",
        email: demoEmail,
        role: "ORGANIZADOR",
      },
    });

    // 2. Crear organización demo verificada
    const demoOrg = await prisma.organization.create({
      data: {
        name: `Club Deportivo Demo #${Math.floor(100 + Math.random() * 900)} (Trial 72h)`,
        ownerId: demoOwner.id,
        status: "VERIFIED",
        type: "CLUB",
        description: "Organización temporal generada por el SuperAdmin para prueba comercial de 3 días.",
      },
    });

    // 3. Crear carrera demo completa
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 72 horas
    const raceDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 días adelante

    const demoRace = await prisma.race.create({
      data: {
        title: `Demo 10K & 21K Experiencia Písale #${Math.floor(100 + Math.random() * 900)}`,
        date: raceDate,
        location: "Parque La Mexicana / Santa Fe, CDMX",
        category: "RUTA",
        status: "PUBLISHED",
        organizationId: demoOrg.id,
        imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200",
        surface: "Asfalto certificado",
        startPoint: "Arco Central Parque La Mexicana",
        endPoint: "Meta Principal La Mexicana",
        distances: {
          create: [
            { name: "10K Express", distanceMeters: 10000, price: 450, maxParticipants: 300, currentParticipants: 24 },
            { name: "21K Medio Maratón", distanceMeters: 21097, price: 650, maxParticipants: 200, currentParticipants: 16 },
          ],
        },
      },
      include: {
        distances: true,
      },
    });

    // 4. Crear corredores de prueba simulados con boletos y QR
    const SAMPLE_NAMES = [
      { name: "Carlos Mendoza García", email: "carlos.mendoza@gmail.com", shirt: "M", bib: "DEMO-101", distIdx: 0, price: 450 },
      { name: "Valeria Soto Beltrán", email: "valeria.soto@gmail.com", shirt: "CH", bib: "DEMO-102", distIdx: 1, price: 650 },
      { name: "Rodrigo Alarcón Paz", email: "rodrigo.alarcon@gmail.com", shirt: "G", bib: "DEMO-103", distIdx: 0, price: 450 },
      { name: "Mariana Fuentes Ruiz", email: "mariana.fuentes@gmail.com", shirt: "M", bib: "DEMO-104", distIdx: 1, price: 650 },
      { name: "Diego Zambrano Silva", email: "diego.zambrano@gmail.com", shirt: "XL", bib: "DEMO-105", distIdx: 0, price: 450 },
      { name: "Fernanda Ortiz Lara", email: "fernanda.ortiz@gmail.com", shirt: "CH", bib: "DEMO-106", distIdx: 1, price: 650 },
      { name: "Alejandro Treviño Peña", email: "alejandro.trevino@gmail.com", shirt: "M", bib: "DEMO-107", distIdx: 0, price: 450 },
      { name: "Sofía Villalobos Cruz", email: "sofia.villalobos@gmail.com", shirt: "CH", bib: "DEMO-108", distIdx: 1, price: 650 },
      { name: "Emiliano Garza Solís", email: "emiliano.garza@gmail.com", shirt: "G", bib: "DEMO-109", distIdx: 0, price: 450 },
      { name: "Camila Cárdenas Mora", email: "camila.cardenas@gmail.com", shirt: "M", bib: "DEMO-110", distIdx: 1, price: 650 },
    ];

    for (const sample of SAMPLE_NAMES) {
      let runnerUser = await prisma.user.findUnique({ where: { email: sample.email } });
      if (!runnerUser) {
        runnerUser = await prisma.user.create({
          data: {
            name: sample.name,
            email: sample.email,
            role: "CORREDOR",
          },
        });
      }

      const dist = demoRace.distances[sample.distIdx];

      await prisma.registration.create({
        data: {
          userId: runnerUser.id,
          raceId: demoRace.id,
          raceTitle: demoRace.title,
          raceDistanceId: dist?.id,
          distanceName: dist?.name || "10K",
          amountPaid: sample.price,
          status: "CONFIRMED",
          bibNumber: sample.bib,
          shirtSize: sample.shirt,
          stripeSessionId: `demo_sess_${sample.bib}_${Date.now()}`,
          registeredAt: new Date(now.getTime() - Math.floor(Math.random() * 86400000)),
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/organizador/dashboard");
    revalidatePath("/carreras");
    revalidatePath(`/carrera/${demoRace.id}`);

    return {
      success: true,
      raceId: demoRace.id,
      raceTitle: demoRace.title,
      orgName: demoOrg.name,
      demoEmail: demoOwner.email,
      expiresAt: expiresAt.toISOString(),
      runnersCount: SAMPLE_NAMES.length,
      simulatedGMV: SAMPLE_NAMES.reduce((acc, s) => acc + s.price, 0),
      raceUrl: `/carrera/${demoRace.id}`,
      dashboardUrl: `/organizador/dashboard`,
      checkinUrl: `/organizador/checkin`,
    };
  } catch (err: any) {
    console.error("Error al generar demo de 3 días:", err);
    return { error: err?.message || "Error al crear la carrera demo." };
  }
}

