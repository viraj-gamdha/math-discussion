import { z } from "zod";

export const userInfoSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accessToken: z.string().optional().nullable(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

export const authFormSchema = userInfoSchema.pick({
  username: true,
  password: true,
});

export type AuthFormInputs = z.infer<typeof authFormSchema>;
