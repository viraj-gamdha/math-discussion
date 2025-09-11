import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  username: string;
  password: string;
}

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
}
