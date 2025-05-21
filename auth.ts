import env from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

env.config();

const invitecodes:string[] = JSON.parse(process.env.GENERAL_INVITECODE ?? "");
export function authorizeinvidecodes(codechallenge:string) {
    const go:boolean = invitecodes.includes(codechallenge);
    return go;
}

export function checkjwt(req: Request, res: Response, next: NextFunction){
    const token: string | undefined = req.cookies.jwt;
    if (!token) {
        res.locals.user = false;
        return next();
    }
    try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.locals.user = false;
            console.log("didn't find the user");
            return next();
        } else {
            res.locals.user = true;
            next();
        }
    });
    } catch (error) {
    console.error(error);
}
}