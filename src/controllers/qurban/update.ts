import { Request, Response } from "express";
import prisma from "../../data-access/db.server";


export const updateQurban = async (req: Request, res: Response) => {
    try {
        const {status} = req.body;
        const id = req.params.id;
        const qurban = await prisma.qurban.update({
            where: {
                id: id
            },
            data: {
                status: status
            }
        })
        return res.status(200).json({ status: true, message: "Success", data: qurban });
    } catch (e) {
        console.log(e)
        return res.status(400).json({ status: false, message: "Error" });
    }
}