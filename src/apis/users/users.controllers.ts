import { RequestHandler } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT = 10;

export const signUp: RequestHandler = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ error: "Username already exists" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const signIn: RequestHandler = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (typeof username !== "string" || typeof password !== "string") {
            res.status(400).json({ error: "Username and password required" });
            return;
        }

        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        if (typeof user.password !== "string") {
            res.status(500).json({ error: "Invalid user record" });
            return;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Sign in failed" });
    }
};

export const getUsers: RequestHandler = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
