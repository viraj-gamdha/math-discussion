import { Types } from "mongoose";
import { IUser } from "./user";

export type OperationType = "+" | "-" | "*" | "/";

export interface IDiscussion {
  value: number;
  operation: OperationType;
  rightOperand?: number;
  parentId?: Types.ObjectId | IDiscussion;
  author?: Types.ObjectId | IUser;
}
