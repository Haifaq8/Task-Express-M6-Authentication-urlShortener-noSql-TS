import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export const authorize = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const r = req as Request & { user?: jwt.JwtPayload | string };
        const authHeader = r.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const [scheme, token] = authHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            res.status(401).json({ error: "Invalid auth format" });
            return;
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        r.user = payload;

        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication failed" });
    }
};
