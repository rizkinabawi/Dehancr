import { Router, type IRouter } from "express";
import { eq, and, count, sum, sql } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  GetProjectsQueryParams,
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectBody,
  UpdateProjectBody,
  UpdateProjectParams,
  DeleteProjectParams,
  GetProjectStatsResponse,
  GetProjectParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects/stats", async (req, res): Promise<void> => {
  const all = await db.select().from(projectsTable);
  const totalProjects = all.length;
  const totalViews = all.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = all.reduce((acc, p) => acc + p.likes, 0);
  const featuredCount = all.filter((p) => p.featured).length;

  const categoryMap = new Map<string, number>();
  for (const p of all) {
    categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
  }
  const categoryCounts = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));

  const years = all.map((p) => p.year);
  const minYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();
  const yearsActive = new Date().getFullYear() - minYear + 1;

  res.json(GetProjectStatsResponse.parse({ totalProjects, totalViews, totalLikes, categoryCounts, featuredCount, yearsActive }));
});

router.get("/projects", async (req, res): Promise<void> => {
  const query = GetProjectsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let projects = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);

  if (query.data.category) {
    projects = projects.filter((p) => p.category === query.data.category);
  }
  if (query.data.featured !== undefined) {
    projects = projects.filter((p) => p.featured === query.data.featured);
  }

  res.json(GetProjectsResponse.parse(projects));
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db.insert(projectsTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    longDescription: parsed.data.longDescription ?? null,
    coverImage: parsed.data.coverImage,
    images: parsed.data.images,
    category: parsed.data.category,
    tags: parsed.data.tags,
    year: parsed.data.year,
    client: parsed.data.client ?? null,
    tools: parsed.data.tools,
    featured: parsed.data.featured,
    projectUrl: parsed.data.projectUrl ?? null,
  }).returning();

  res.status(201).json(GetProjectResponse.parse(project));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db.update(projectsTable).set({ views: project.views + 1 }).where(eq(projectsTable.id, params.data.id));

  res.json(GetProjectResponse.parse({ ...project, views: project.views + 1 }));
});

router.put("/projects/:id", async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db.update(projectsTable).set({
    title: parsed.data.title,
    description: parsed.data.description,
    longDescription: parsed.data.longDescription ?? null,
    coverImage: parsed.data.coverImage,
    images: parsed.data.images,
    category: parsed.data.category,
    tags: parsed.data.tags,
    year: parsed.data.year,
    client: parsed.data.client ?? null,
    tools: parsed.data.tools,
    featured: parsed.data.featured,
    projectUrl: parsed.data.projectUrl ?? null,
  }).where(eq(projectsTable.id, params.data.id)).returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(GetProjectResponse.parse(project));
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id)).returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
