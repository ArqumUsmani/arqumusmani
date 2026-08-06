import { z } from "zod";

export const DOMAINS = ["Healthcare", "AI", "SaaS", "E-commerce"] as const;

export const outcomeSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const workFrontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  thesis: z.string().min(1),
  client: z.string().min(1),
  confidential: z.boolean(),
  role: z.string().min(1),
  team: z.string().min(1),
  timeline: z.string().min(1),
  platform: z.string().min(1),
  domain: z.enum(DOMAINS),
  year: z.number().int(),
  cover: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  outcomes: z.array(outcomeSchema).min(1),
  featured: z.boolean(),
  order: z.number().int(),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;

export const noteFrontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().min(1),
  tags: z.array(z.string()).default([]),
  published: z.boolean(),
});

export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>;
