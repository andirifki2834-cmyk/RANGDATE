import { pgTable, serial, text, varchar, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 60 }).notNull().unique(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 30 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 30 }).notNull().default("PETUGAS"), // SUPER_ADMIN, OPERATOR, KADUS, PETUGAS
  dusun: varchar("dusun", { length: 80 }),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"), // PENDING, ACTIVE, REJECTED, SUSPENDED
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const residents = pgTable("residents", {
  id: serial("id").primaryKey(),
  nik: varchar("nik", { length: 16 }).notNull().unique(),
  noKk: varchar("no_kk", { length: 16 }).notNull(),
  fullName: varchar("full_name", { length: 140 }).notNull(),
  birthPlace: varchar("birth_place", { length: 100 }),
  birthDate: date("birth_date").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(), // Laki-laki / Perempuan
  religion: varchar("religion", { length: 40 }).notNull().default("Islam"),
  maritalStatus: varchar("marital_status", { length: 40 }).notNull().default("Belum Kawin"),
  education: varchar("education", { length: 60 }).notNull().default("SD"),
  occupation: varchar("occupation", { length: 80 }).notNull().default("Belum Bekerja"),
  bloodType: varchar("blood_type", { length: 10 }),
  address: text("address"),
  dusun: varchar("dusun", { length: 80 }).notNull(),
  rt: varchar("rt", { length: 10 }).notNull().default("001"),
  rw: varchar("rw", { length: 10 }).notNull().default("001"),
  familyRelation: varchar("family_relation", { length: 60 }).notNull().default("Anggota Keluarga"),
  phone: varchar("phone", { length: 30 }),
  residencyStatus: varchar("residency_status", { length: 30 }).notNull().default("Tetap"), // Tetap, Sementara, Pindah, Meninggal
  entryDate: date("entry_date"),
  photoConsent: boolean("photo_consent").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mutations = pgTable("mutations", {
  id: serial("id").primaryKey(),
  residentId: integer("resident_id"),
  residentName: varchar("resident_name", { length: 140 }).notNull(),
  nik: varchar("nik", { length: 16 }),
  type: varchar("type", { length: 30 }).notNull(), // KELAHIRAN, KEMATIAN, PINDAH, DATANG, SEMENTARA
  eventDate: date("event_date").notNull(),
  origin: varchar("origin", { length: 160 }),
  destination: varchar("destination", { length: 160 }),
  description: text("description"),
  dusun: varchar("dusun", { length: 80 }),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aidRecipients = pgTable("aid_recipients", {
  id: serial("id").primaryKey(),
  residentId: integer("resident_id"),
  residentName: varchar("resident_name", { length: 140 }).notNull(),
  nik: varchar("nik", { length: 16 }),
  noKk: varchar("no_kk", { length: 16 }),
  program: varchar("program", { length: 100 }).notNull(), // BLT, PKH, BPNT, BST, Bantuan Pendidikan...
  amount: integer("amount").notNull().default(0),
  period: varchar("period", { length: 40 }),
  status: varchar("status", { length: 30 }).notNull().default("Aktif"), // Aktif, Selesai, Ditunda
  dusun: varchar("dusun", { length: 80 }),
  receivedDate: date("received_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  letterNumber: varchar("letter_number", { length: 80 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  applicantName: varchar("applicant_name", { length: 140 }).notNull(),
  nik: varchar("nik", { length: 16 }),
  purpose: text("purpose"),
  status: varchar("status", { length: 30 }).notNull().default("Diproses"), // Diproses, Selesai, Ditolak
  issuedDate: date("issued_date"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const villageAssets = pgTable("village_assets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  location: varchar("location", { length: 160 }),
  dusun: varchar("dusun", { length: 80 }),
  condition: varchar("condition", { length: 40 }).notNull().default("Baik"),
  quantity: integer("quantity").notNull().default(1),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  username: varchar("username", { length: 60 }),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }),
  detail: text("detail"),
  ipAddress: varchar("ip_address", { length: 60 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: text("value").notNull(),
});
