import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id: id
            }
        });

        if (!deleteUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        return res.status(200).json({ status: true, message: "Success", data: deleteUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};
