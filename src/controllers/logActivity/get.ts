import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

export const getAllLogActivity = async (req:Request, res:Response) => {
    try {
        const date = req.query.date;

        if (!date) {
            const allLogActivity = await prisma.logActivity.findMany({});
            return res.status(200).json({ status: true, message: "Success", data: allLogActivity });
        } else {
            const logActivity = await prisma.logActivity.findMany({
                where: {
                    date: date as string
                },
            });

            if (!logActivity) {
                return res.status(404).json({ status: false, message: "Log Activity not found" });
            }

            return res.status(200).json({ status: true, message: "Success", data: logActivity });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}