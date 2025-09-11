import { IDiscussion } from "@/types/discussion";
import { Document, model, Schema, Types } from "mongoose";

export interface IDiscussionDoc extends IDiscussion, Document {}

const discussionSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    operation: {
      type: String,
      enum: ["+", "-", "*", "/"],
    },
    rightOperand: {
      type: Number,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isStartingNumber: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Discussion = model("Discussion", discussionSchema);
