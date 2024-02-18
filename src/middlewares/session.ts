//import type { Request, Response, NextFunction } from "express";
import session, { type SessionOptions } from 'express-session'
import { EXPRESS_SESSION_SECRET, EXPRESS_SESSION_MAX_AGE } from '@/config/env'

const sessionParams: SessionOptions = {
  name: 'SESSION_ID',
  secret: EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: Number(EXPRESS_SESSION_MAX_AGE),
  },
}

// if (app.get("env") === "production") {
//   sess.cookie = {
//     ...sess.cookie,
//     secure: true,
//     sameSite: "strict",
//   };
// }

const MSession = session(sessionParams)

export {
  MSession,
}

