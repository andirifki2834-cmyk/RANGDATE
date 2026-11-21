import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, activities } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "rngdat-dev-secret-change-in-production-32chars");
export const COOKIE = "rngdat_session";

export async function hashPassword(p: string) { return bcrypt.hash(p, 12); }
export async function verifyPassword(p: string, h: string) { return bcrypt.compare(p, h); }

export type SessionUser = { id: number; username: string; fullName: string; role: string; dusun?: string | null; mustChangePassword: boolean; status: string };

export async function createSession(u: SessionUser) {
  const token = await new SignJWT({ ...u }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(SECRET);
  const c = await cookies();
  c.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return token;
}
export async function getSession(): Promise<SessionUser | null> {
  try {
    const c = await cookies();
    const t = c.get(COOKIE)?.value;
    if (!t) return null;
    const { payload } = await jwtVerify(t, SECRET);
    return payload as unknown as SessionUser;
  } catch { return null; }
}
export async function destroySession() { const c = await cookies(); c.delete(COOKIE); }

export async function requireAuth(roles?: string[]) {
  const s = await getSession();
  if (!s) return { error: "Tidak terautentikasi", status: 401 as const, user: null };
  if (s.status !== "ACTIVE") return { error: "Akun belum aktif / menunggu persetujuan admin", status: 403 as const, user: null };
  if (roles && !roles.includes(s.role)) return { error: "Anda tidak memiliki hak akses untuk aksi ini", status: 403 as const, user: null };
  return { error: null, status: 200 as const, user: s };
}

export async function logActivity(user: { id?: number; username?: string } | null, action: string, entity?: string, detail?: string) {
  try { await db.insert(activities).values({ userId: user?.id ?? null, username: user?.username ?? "sistem", action, entity, detail }); } catch {}
}

export function maskNIK(nik?: string | null, role?: string) {
  if (!nik) return "-";
  if (role === "SUPER_ADMIN" || role === "OPERATOR") return nik;
  return nik.slice(0, 4) + "••••••••" + nik.slice(-4);
}
export function canSeeFullNIK(role?: string) { return role === "SUPER_ADMIN" || role === "OPERATOR"; }

export async function ensureSeed() {
  const existing = await db.select().from(users).where(eq(users.username, "Rifkiandi")).limit(1);
  if (existing.length === 0) {
    const hash = await hashPassword(process.env.ADMIN_INITIAL_PASSWORD || "nondo1234");
    await db.insert(users).values({ username: "Rifkiandi", fullName: "Rifkiandi — Admin Utama", passwordHash: hash, role: "SUPER_ADMIN", status: "ACTIVE", mustChangePassword: true });
  }
  // demo users
  const demos: [string, string, string, string][] = [
    ["operator", "Operator Desa", "OPERATOR", "Aktif"],
    ["kadus_rangoan", "Kepala Dusun Rangoan Tengah", "KADUS", "Aktif"],
  ];
  for (const [u, n, r] of demos) {
    const e = await db.select().from(users).where(eq(users.username, u)).limit(1);
    if (!e.length) await db.insert(users).values({ username: u, fullName: n, passwordHash: await hashPassword("operator123"), role: r, status: "ACTIVE", dusun: r === "KADUS" ? "Rangoan Tengah" : null });
  }
  // seed residents if empty
  const { residents } = await import("@/db/schema");
  const cnt = await db.select().from(residents).limit(1);
  if (cnt.length === 0) {
    const firstNamesM = ["Budi", "Agus", "Joko", "Slamet", "Rudi", "Hendra", "Bambang", "Dedi", "Eko", "Fajar", "Andi", "Rizky", "Dedi", "Yusuf", "Ilham"];
    const firstNamesF = ["Siti", "Sri", "Dewi", "Ani", "Rina", "Fitri", "Nur", "Wati", "Ratna", "Lestari", "Maya", "Intan", "Putri", "Ayu", "Sari"];
    const last = ["Santoso", "Wijaya", "Saputra", "Hidayat", "Pratama", "Nugraha", "Kusuma", "Rahmawati", "Lestari", "Handayani", "Firmansyah", "Utama", "Purnama", "Setiawan", "Anggraini"];
    const dusuns = ["Rangoan Barat", "Rangoan Timur", "Rangoan Tengah", "Rangoan Utara", "Rangoan Selatan"];
    const jobs = ["Petani", "Buruh Tani", "Pedagang", "Guru", "Perangkat Desa", "Wiraswasta", "Buruh Pabrik", "Sopir", "Ibu Rumah Tangga", "Pelajar", "Peternak", "Tukang Kayu", "Penjahit", "Nelayan", "Pensiunan"];
    const edus = ["SD", "SMP", "SMA/SMK", "Diploma", "S1", "Tidak Sekolah"];
    const religions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha"];
    const rows: any[] = [];
    let idx = 0;
    for (let kk = 0; kk < 28; kk++) {
      const noKk = `3507${String(2024000000 + kk * 137).slice(0, 10)}`.padEnd(16, "0").slice(0, 16);
      const dusun = dusuns[kk % dusuns.length];
      const members = 2 + (kk % 4);
      for (let m = 0; m < members; m++) {
        idx++;
        const isMale = (idx + m) % 2 === 0;
        const name = `${isMale ? firstNamesM[idx % 15] : firstNamesF[idx % 15]} ${last[(idx + kk) % 15]}`;
        const year = m === 0 ? 1975 + (kk % 25) : m === 1 ? 1978 + (kk % 22) : 2000 + (idx % 24);
        const rel = m === 0 ? "Kepala Keluarga" : m === 1 ? "Istri" : idx % 5 === 0 ? "Orang Tua" : "Anak";
        rows.push({
          nik: `3507${String(1000000000 + idx * 7919 + kk * 104729).slice(0, 10)}`.padEnd(16, "0").slice(0, 16),
          noKk, fullName: name, birthPlace: "Polewali Mandar", birthDate: `${year}-${String((idx % 12) + 1).padStart(2, "0")}-${String((idx % 27) + 1).padStart(2, "0")}`,
          gender: isMale ? "Laki-laki" : "Perempuan", religion: religions[idx % 9 === 0 ? 1 : 0], maritalStatus: m < 2 ? "Kawin" : "Belum Kawin",
          education: edus[idx % edus.length], occupation: rel === "Anak" && year > 2012 ? "Pelajar" : jobs[idx % jobs.length],
          bloodType: ["A", "B", "O", "AB"][idx % 4], address: `Jl. Raya Rangoan No. ${kk + 1}, ${dusun}`, dusun, rt: `00${(kk % 5) + 1}`, rw: `00${(kk % 3) + 1}`,
          familyRelation: rel, phone: `08${String(1200000000 + idx * 12345).slice(0, 10)}`, residencyStatus: "Tetap",
          entryDate: "2020-01-15", photoConsent: true,
        });
      }
    }
    await db.insert(residents).values(rows);
    const { mutations, aidRecipients, letters, villageAssets } = await import("@/db/schema");
    await db.insert(mutations).values([
      { residentName: rows[2].fullName, nik: rows[2].nik, type: "KELAHIRAN", eventDate: "2026-04-12", dusun: "Krajan", description: "Kelahiran bayi perempuan, RSUD setempat" },
      { residentName: rows[5].fullName, nik: rows[5].nik, type: "KELAHIRAN", eventDate: "2026-05-02", dusun: "Sumberrejo", description: "Kelahiran bayi laki-laki" },
      { residentName: rows[10].fullName, nik: rows[10].nik, type: "KEMATIAN", eventDate: "2026-03-18", dusun: "Tegalrejo", description: "Meninggal dunia karena sakit, dimakamkan di TPU desa" },
      { residentName: rows[15].fullName, nik: rows[15].nik, type: "DATANG", eventDate: "2026-05-20", origin: "Surabaya", dusun: "Krajan", description: "Pindah datang mengikuti keluarga" },
      { residentName: rows[20].fullName, nik: rows[20].nik, type: "PINDAH", eventDate: "2026-04-28", destination: "Sidoarjo", dusun: "Sidomulyo", description: "Pindah karena pekerjaan" },
      { residentName: rows[8].fullName, nik: rows[8].nik, type: "SEMENTARA", eventDate: "2026-05-10", dusun: "Karanganyar", description: "Mahasiswa KKN tinggal sementara 45 hari" },
    ]);
    await db.insert(aidRecipients).values(rows.slice(0, 12).map((r: any, i: number) => ({ residentName: r.fullName, nik: r.nik, noKk: r.noKk, program: ["BLT Dana Desa", "PKH", "BPNT / Sembako", "Bantuan Pendidikan"][i % 4], amount: [300000, 750000, 200000, 450000][i % 4], period: "Mei 2026", status: "Aktif", dusun: r.dusun, receivedDate: "2026-05-15" })));
    await db.insert(letters).values([
      { letterNumber: "470/001/V/2026", type: "Surat Keterangan Domisili", applicantName: rows[0].fullName, nik: rows[0].nik, purpose: "Persyaratan administrasi bank", status: "Selesai", issuedDate: "2026-05-20" },
      { letterNumber: "470/002/V/2026", type: "Surat Keterangan Tidak Mampu (SKTM)", applicantName: rows[3].fullName, nik: rows[3].nik, purpose: "Bantuan pendidikan anak", status: "Diproses", issuedDate: "2026-05-24" },
      { letterNumber: "470/003/V/2026", type: "Surat Keterangan Usaha", applicantName: rows[6].fullName, nik: rows[6].nik, purpose: "Pengajuan KUR UMKM", status: "Selesai", issuedDate: "2026-05-22" },
    ]);
    await db.insert(villageAssets).values([
      { name: "Balai Desa & Kantor Desa", category: "Bangunan", location: "Jl. Raya Desa No.1", dusun: "Krajan", condition: "Baik", quantity: 1 },
      { name: "Polindes / Poskesdes", category: "Kesehatan", location: "Dusun Krajan RT 02", dusun: "Krajan", condition: "Baik", quantity: 1 },
      { name: "SDN 01 & PAUD Melati", category: "Pendidikan", location: "Dusun Sumberrejo", dusun: "Sumberrejo", condition: "Baik", quantity: 2 },
      { name: "Lapangan & Taman Desa", category: "Fasilitas Umum", location: "Pusat Desa", dusun: "Krajan", condition: "Baik", quantity: 1 },
      { name: "Jaringan Air Bersih PAMSIMAS", category: "Infrastruktur", location: "Semua Dusun", dusun: "Krajan", condition: "Perlu Perawatan", quantity: 5 },
      { name: "Ambulans Desa", category: "Kendaraan", location: "Kantor Desa", dusun: "Krajan", condition: "Baik", quantity: 1 },
    ]);
  }
}
