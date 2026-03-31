import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import { GetCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const CATEGORIES = [
  { slug: "ui-design", name: "UI Design" },
  { slug: "branding", name: "Branding" },
  { slug: "photography", name: "Photography" },
  { slug: "illustration", name: "Illustration" },
  { slug: "web-development", name: "Web Development" },
  { slug: "motion", name: "Motion" },
];

router.get("/categories", async (_req, res): Promise<void> => {
  const projects = await db.select().from(projectsTable);

  const categoryMap = new Map<string, number>();
  for (const p of projects) {
    categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
  }

  const categories = CATEGORIES.map((cat, index) => ({
    id: index + 1,
    name: cat.name,
    slug: cat.slug,
    projectCount: categoryMap.get(cat.slug) ?? 0,
  }));

  res.json(GetCategoriesResponse.parse(categories));
});

export default router;
