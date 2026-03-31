import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  github: text("github"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  skills: text("skills").array().notNull().default([]),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  description: text("description").notNull(),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  year: integer("year").notNull(),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({ id: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;
