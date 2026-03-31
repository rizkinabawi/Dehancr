import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, inquiriesTable, insertInquirySchema } from "@workspace/db";
import nodemailer from "nodemailer";

const router: IRouter = Router();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

router.post("/contact", async (req, res) => {
  const parsed = insertInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const { name, email, subject, message } = parsed.data;

  const [inquiry] = await db
    .insert(inquiriesTable)
    .values({ name, email, subject, message })
    .returning();

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `[Portfolio Inquiry] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111;color:#eee;border-radius:12px">
          <h2 style="color:#c9a84c;margin-bottom:4px">New Inquiry</h2>
          <p style="color:#888;margin-top:0;font-size:13px">${new Date().toLocaleString()}</p>
          <hr style="border-color:#333;margin:16px 0"/>
          <p><strong style="color:#c9a84c">From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong style="color:#c9a84c">Subject:</strong> ${subject}</p>
          <hr style="border-color:#333;margin:16px 0"/>
          <div style="background:#1a1a1a;padding:16px;border-radius:8px;white-space:pre-wrap;line-height:1.6">${message}</div>
          <p style="color:#555;font-size:12px;margin-top:24px">Sent from Alex Rivera Portfolio</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[SMTP] Failed to send email:", err);
  }

  return res.status(201).json({ success: true, id: inquiry.id });
});

router.get("/inquiries", async (_req, res) => {
  const inquiries = await db
    .select()
    .from(inquiriesTable)
    .orderBy(desc(inquiriesTable.createdAt));
  return res.json(inquiries);
});

router.patch("/inquiries/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: string };

  if (!["unread", "read", "replied"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const [updated] = await db
    .update(inquiriesTable)
    .set({ status })
    .where(eq(inquiriesTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Inquiry not found" });
  return res.json(updated);
});

router.delete("/inquiries/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id));
  return res.json({ success: true });
});

export default router;
