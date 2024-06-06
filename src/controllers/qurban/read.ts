import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

export const getAllQurban = async (req: Request, res: Response) => {
    try {
        const date = req.query.date as string | undefined;
        let orderBy = req.query.orderBy as string | undefined;
        let typeOfOrder = req.query.typeOfOrder as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            typeOfOrder = 'asc';
        }

        orderBy = orderBy || 'date';

        const orderByObject = { [orderBy]: typeOfOrder };

        // Fetch kolaborator data
        const kolaborator = await prisma.kolaboratorQurban.findMany();

        // Function to add lembaga to qurban
        const addLembaga = (qurbanList: any[], kolaboratorList: any[]) => {
            return qurbanList.map(qurban => {
                const matchedKolaborator = kolaboratorList.find(kolaborator => kolaborator.email === qurban.email);
                return {
                    ...qurban,
                    lembaga: matchedKolaborator ? matchedKolaborator.nama_organisasi : null
                };
            });
        };

        let allQurban;

        if (!date) {
            allQurban = await prisma.qurban.findMany({
                orderBy: orderByObject,
                skip: (page - 1) * limit,
                take: limit,
            });
        } else {
            allQurban = await prisma.qurban.findMany({
                where: {
                    date: date
                },
                orderBy: orderByObject,
                skip: (page - 1) * limit,
                take: limit,
            });

            if (!allQurban.length) {
                return res.status(404).json({ status: false, message: "Qurban not found" });
            }
        }

        // Add lembaga field to allQurban
        const allQurbanWithLembaga = addLembaga(allQurban, kolaborator);

        return res.status(200).json({ status: true, message: "Success", data: allQurbanWithLembaga });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Error" });
    }
};


export const getQurbanById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const qurban = await prisma.qurban.findUnique({
            where: {
                id: id
            }
        })
        if (!qurban) {
            return res.status(400).json({ status: false, message: "Qurban not found" });

        }
        return res.status(200).json({ status: true, message: "Success", data: qurban });

    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" })
    }
}

