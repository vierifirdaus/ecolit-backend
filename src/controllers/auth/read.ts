import { Request, Response } from "express"
import prisma from "../../data-access/db.server"


export const read = async (req: Request, res: Response) => {
    try {
        const nama = req.query.nama as string | undefined;
        const date = req.query.date;

        let orderBy = req.query.orderBy as string | undefined;
        let typeOfOrder = req.query.typeOfOrder as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            typeOfOrder = 'asc';
        }

        orderBy = orderBy || 'date';

        const orderByObject = { [orderBy]: typeOfOrder };

        // Fetch paginated and filtered users
        const allUser = await prisma.user.findMany({
            where: {
                role: "PEGAWAI",
                ...(nama && {
                    name: {
                        contains: nama, // Enables partial match on name
                        mode: 'insensitive' // Case-insensitive search
                    }
                })
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                job: true,
                role: true
            },
            orderBy: orderByObject,
            skip: (page - 1) * limit,
            take: limit,
        });

        // If no users are found, return a 404 response
        if (!allUser || allUser.length === 0) {
            return res.status(404).json({ status: false, message: "User not found" });
        }


        return res.status(200).json({
            status: true,
            message: "Success",
            data: allUser,
        });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error", error: error });
    }
};