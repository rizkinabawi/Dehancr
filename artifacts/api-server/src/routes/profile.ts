import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profileTable, experienceTable, educationTable } from "@workspace/db";
import {
  GetProfileResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  const profiles = await db.select().from(profileTable);
  let profile = profiles[0];

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const experience = await db.select().from(experienceTable).where(eq(experienceTable.profileId, profile.id));
  const education = await db.select().from(educationTable).where(eq(educationTable.profileId, profile.id));

  const result = {
    ...profile,
    experience: experience.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      startYear: e.startYear,
      endYear: e.endYear ?? null,
      description: e.description,
    })),
    education: education.map((ed) => ({
      id: ed.id,
      institution: ed.institution,
      degree: ed.degree,
      year: ed.year,
    })),
  };

  res.json(GetProfileResponse.parse(result));
});

router.put("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const profiles = await db.select().from(profileTable);
  let profile = profiles[0];

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [updated] = await db.update(profileTable).set({
    name: parsed.data.name ?? profile.name,
    title: parsed.data.title ?? profile.title,
    bio: parsed.data.bio ?? profile.bio,
    avatarUrl: parsed.data.avatarUrl ?? profile.avatarUrl,
    location: parsed.data.location ?? profile.location,
    email: parsed.data.email ?? profile.email,
    website: parsed.data.website ?? profile.website,
    github: parsed.data.github ?? profile.github,
    instagram: parsed.data.instagram ?? profile.instagram,
    linkedin: parsed.data.linkedin ?? profile.linkedin,
    skills: parsed.data.skills ?? profile.skills,
  }).where(eq(profileTable.id, profile.id)).returning();

  const experience = await db.select().from(experienceTable).where(eq(experienceTable.profileId, updated.id));
  const education = await db.select().from(educationTable).where(eq(educationTable.profileId, updated.id));

  const result = {
    ...updated,
    experience: experience.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      startYear: e.startYear,
      endYear: e.endYear ?? null,
      description: e.description,
    })),
    education: education.map((ed) => ({
      id: ed.id,
      institution: ed.institution,
      degree: ed.degree,
      year: ed.year,
    })),
  };

  res.json(UpdateProfileResponse.parse(result));
});

export default router;
