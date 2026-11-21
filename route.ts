import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; import { residents } from "@/db/schema"; import { eq } from "drizzle-orm";
import { requireAuth, logActivity } from "@/lib/auth";
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error, status } = await requireAuth(); if (!user) return NextResponse.json({ error }, { status });
  const { id } = await params; const [r] = await db.select().from(residents).where(eq(residents.id, Number(id))).limit(1);
  if (!r) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 }); return NextResponse.json({ data: r });
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error, status } = await requireAuth(["SUPER_ADMIN", "OPERATOR", "KADUS", "PETUGAS"]); if (!user) return NextResponse.json({ error }, { status });
  const { id } = await params; const b = await req.json();
  if (b.nik && !/^\d{16}$/.test(b.nik)) return NextResponse.json({ error: "NIK harus 16 digit" }, { status: 400 });
  const [row] = await db.update(residents).set({ ...b, updatedAt: new Date() }).where(eq(residents.id, Number(id))).returning();
  await logActivity(user, "UPDATE", "penduduk", `Memperbarui data ${row?.fullName}`);
  return NextResponse.json({ data: row, message: "Data berhasil diperbarui" });
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error, status } = await requireAuth(["SUPER_ADMIN", "OPERATOR"]); if (!user) return NextResponse.json({ error }, { status });
  const { id } = await params; const [old] = await db.select().from(residents).where(eq(residents.id, Number(id))).limit(1);
  await db.update(residents).set({ isArchived: true }).where(eq(residents.id, Number(id)));
  await logActivity(user, "ARCHIVE", "penduduk", `Mengarsipkan ${old?.fullName}`);
  return NextResponse.json({ message: "Data diarsipkan (tidak dihapus permanen demi audit)" });
}
