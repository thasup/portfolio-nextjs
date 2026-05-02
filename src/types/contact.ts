import { z } from "zod";

export interface ContactIntent {
  key: string;
  labelKey: string;
  headingKey: string;
  previewKey: string;
  placeholderKey: string;
  icon: string;
}

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  intent: z.string().min(1, "Please select a contact intent"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
