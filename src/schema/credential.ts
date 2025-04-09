import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z.string().max(30).min(1),
  value: z.string().max(500).min(1),
});

export type CreateCredentialSchema = z.infer<typeof createCredentialSchema>;
