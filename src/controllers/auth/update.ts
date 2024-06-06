import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import prisma from "../../data-access/db.server";

export const updateUser = async (req: Request, res: Response) => {
    const { email, name, phoneNumber, job, role, password, confPassword, newPassword,id } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    
    if (!user) {
        return res.status(400).json({ status: false, message: "User not found" });
    }

    try {
        // using bcrypt
        const updateUser = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                email: email!==undefined?email:user.email,
                name: name!==undefined?name:user.name,
                phoneNumber: phoneNumber!==undefined?phoneNumber:user.phoneNumber,
                job: job!==undefined?job:user.job,
                role: role!==undefined?role:user.role,
            },
        });

        return res.status(200).json({ status: true, message: "Success", data: updateUser });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Password false" });
    }
};
