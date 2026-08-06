import { z } from "zod";

export const ENGAGEMENT_TYPES = ["Full-time", "Contract", "Advisory"] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  type: z.enum(ENGAGEMENT_TYPES, "Choose an engagement type."),
  message: z.string().min(10, "Say a little more — at least 10 characters."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
