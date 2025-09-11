import z from "zod";
import { userInfoSchema } from "./user";

export const discussionSchema = z.object({
  _id: z.string().optional(),
  value: z.number(),
  operation: z.enum(["+", "-", "*", "/"]),
  rightOperand: z.number(),
  parentId: z.string().nullable().optional(),
  author: z.union([z.string(), userInfoSchema]).optional(),
  isStartingNumber: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const startingNumberSchema = discussionSchema.pick({
  value: true,
});

export const operationSchema = discussionSchema.pick({
  operation: true,
  rightOperand: true,
  parentId: true,
});

// Node type for tree structure
export interface TreeNode extends Discussion {
  children?: TreeNode[];
}

export type OperationType = "+" | "-" | "*" | "/";
export type StartingNumberFormData = z.infer<typeof startingNumberSchema>;
export type OperationFormData = z.infer<typeof operationSchema>;
export type Discussion = z.infer<typeof discussionSchema>;
