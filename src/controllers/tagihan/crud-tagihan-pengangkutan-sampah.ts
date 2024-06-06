import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { Readable } from "stream";
import { logActivity } from "../../utils/logActivity";
import { driveServices } from "../../utils/qurbanSetup";

export const getAllTagihan = async (req: Request, res: Response) => {
    try {
        const statusFilter = req.query.status as string | undefined;
        let orderBy = req.query.orderBy as string | undefined;
        let typeOfOrder = req.query.typeOfOrder as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            typeOfOrder = 'asc';
        }
        
        orderBy = orderBy || 'start';

        const orderByObject = orderBy ? { [orderBy]: typeOfOrder } : {};

        const whereClause: any = {};
        
        if (statusFilter && statusFilter !== 'ALL' && statusFilter !== 'all') {
            whereClause.status = statusFilter;
        }

        const tagihan = await prisma.tagihan.findMany({
            where: whereClause,
            orderBy: orderByObject,
            skip: (page - 1) * limit,
            take: limit,
        });

        return res.status(200).json({ status: true, message: 'Success', data: tagihan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal server error', error: "error" });
    }
};
export const getDetailTagihan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const detailTagihan = await prisma.tagihan.findUnique({
            where: {
                id: id
            }
        })
        return res.status(200).json({status:true,message:"Success",data:detailTagihan})
    } catch (error) {
        console.log(error)
        return res.status(400).json({status:false,message:"error"})
    }
}

export const updateTagihan = async (req: Request, res: Response) => {
    try {
        const { id, status } = req.body;
        const tagihan = await prisma.tagihan.findUnique
        ({
            where: {
                id: id
            }
        })
        if (!tagihan) {
            return res.status(404).json({status:false,message:"Tagihan not found"})
        }

        const file = req.file 
        let url = ""

        if(file){
            const fileStream = Readable.from(file.buffer);

            const dataFile = await driveServices.files.create({
                media:{
                    mimeType: file.mimetype,
                    body: fileStream
                },
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimetype,
                    parents: [process.env.PARENT_FOLDER_ID as string],
                },
                fields: "id",
            });
            url= "https://drive.google.com/file/d/"+dataFile.data.id as string+"/view"
        }

        const updatedTagihan = await prisma.tagihan.update({
            where: {
                id: id
            },
            data: {
                status: status ? status : tagihan.status,
                invoice: url
            }
        })
        logActivity(new Date(), req.cookies.token, "Update Tagihan","Tagihan", "Internal Error", "400", false)
        return res.status(200).json({status:true,message:"Success",data:updatedTagihan})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({status:false,message:"error"})
    }
}