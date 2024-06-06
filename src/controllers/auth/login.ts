import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Email and password required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(400).json({ status: false, message: "User not found" });
        }

        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SECRET_TOKEN as string,
            { expiresIn: "7 days" }
        );
        // Set cookie 
        res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

        // Send response
        return res.status(200).json({ message: "Login success!", success: true, token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Error" });
    }
};
