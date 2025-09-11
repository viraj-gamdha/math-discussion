import { IUserDoc } from "@/models/user.js";
import { ApiResponse } from "@/types/general";
import { Request, Response, NextFunction } from "express";

//  Middleware-specific properties (req.prop)
export interface MiddlewareProps<
  ReqCookies extends Record<string, unknown> = {}
> {
  user?: IUserDoc;
  cookies: ReqCookies;
}

//  Generic order:
//  Body → Params → Query → Cookies
export interface RequestProps<
  ReqBody = unknown,
  ReqParams extends Record<string, unknown> = {},
  ReqQuery extends Record<string, unknown> = {},
  ReqCookies extends Record<string, unknown> = {}
> extends Omit<Request<ReqParams, any, ReqBody, ReqQuery>, "cookies">,
    MiddlewareProps<ReqCookies> {}

//  Forces strong typing on both request and response.
export type ControllerType<
  ReqBody = unknown,
  ReqParams extends Record<string, unknown> = {},
  ReqQuery extends Record<string, unknown> = {},
  ReqCookies extends Record<string, unknown> = {},
  ResBody = unknown
> = (
  req: RequestProps<ReqBody, ReqParams, ReqQuery, ReqCookies>,
  res: Response<ApiResponse<ResBody>>,
  next: NextFunction
) => Promise<Response<ApiResponse<ResBody>> | void>;

//  Async wrapper for controllers
//  Eliminates try/catch boilerplate inside each controller.
export const TryCatch =
  <
    ReqBody = unknown,
    ReqParams extends Record<string, unknown> = {},
    ReqQuery extends Record<string, unknown> = {},
    ReqCookies extends Record<string, unknown> = {},
    ResBody = unknown
  >(
    passedFunc: ControllerType<
      ReqBody,
      ReqParams,
      ReqQuery,
      ReqCookies,
      ResBody
    >
  ) =>
  async (
    req: RequestProps<ReqBody, ReqParams, ReqQuery, ReqCookies>,
    res: Response<ApiResponse<ResBody>>,
    next: NextFunction
  ) => {
    try {
      return await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
