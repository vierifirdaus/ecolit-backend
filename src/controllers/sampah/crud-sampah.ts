import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { logActivity } from "../../utils/logActivity";

export const addSampah = async (req:Request, res:Response) => {
    const { date, kaca, kertas, plastik, organik_sisa, organik_kebun, organik_cacah, residu, trashbag, keterangan } = req.body ;
    if(!date) {
        logActivity(new Date(), req.cookies.token, "Add Sampah","Sampah", "Tanggal required", "400", false)
        return res.status(400).json({status:false,message: "Tanggal required"})
    }

    try {
        console.log(req.cookies.token)
        const addSampah = await prisma.sampah.create({
            data: {
                date: new Date(date),
                kaca: Number(kaca),
                kertas: Number(kertas),
                plastik: Number(plastik),
                organik_sisa: Number(organik_sisa),
                organik_kebun: Number(organik_kebun),
                organik_cacah: Number(organik_cacah),
                residu: Number(residu),
                trashbag: Number(trashbag),
                keterangan: keterangan,
                total : Number(kaca) + Number(kertas) + Number(plastik) + Number(organik_sisa) + Number(organik_kebun) + Number(organik_cacah) + Number(residu)
            }
        })
        logActivity(new Date(), req.cookies.token, "Add Sampah","Sampah", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:addSampah})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Add Sampah","Sampah", "Internal Error", "400", false)
        return res.status(400).json({status:false,message:"error"})
        
    }
}

export const getAllSampah = async (req:Request, res:Response) => {
    try {
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

        if (!date) {
            const allSampah = await prisma.sampah.findMany({
                orderBy: orderByObject,
                skip: (page - 1) * limit,
                take: limit,
            });
            return res.status(200).json({ status: true, message: "Success", data: allSampah });
        } else {
            const sampah = await prisma.sampah.findMany({
                where: {
                    date: date as string
                },
                orderBy: orderByObject,
                skip: (page - 1) * limit,
            });

            if (!sampah) {
                return res.status(404).json({ status: false, message: "Sampah not found" });
            }

            return res.status(200).json({ status: true, message: "Success", data: sampah });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const getSampahById = async (req:Request, res:Response) => {  
    const { id } = req.params;
    try {
        const sampah = await prisma.sampah.findUnique({
            where: {
                id: id
            }
        })
        if(!sampah) {
            return res.status(400).json({status:false,message: "Sampah not found"})
            
        }
        return res.status(200).json({status:true,message: "Success",data:sampah})
        
    } catch (error) {
        return res.status(400).json({status:false,message: "Error"})
        
    }
}


export const updateSampah = async (req: Request, res: Response) => {
    const { id, date, kaca, kertas, plastik, organik_sisa, organik_kebun, organik_cacah, residu, trashbag, keterangan } = req.body;

    if (!date) {
        logActivity(new Date(), req.cookies.token, "Update Sampah","Sampah", "Tanggal required", "400", false)
        return res.status(400).json({ status: false, message: "Tanggal required" });
    }

    try {
        const sampah = await prisma.sampah.findUnique({
            where: {
                id: id
            }
        });

        if (!sampah) {
            logActivity(new Date(), req.cookies.token, "Update Sampah","Sampah", "Sampah not found", "404", false)
            return res.status(404).json({ status: false, message: "Sampah not found" });
        }

        const updatedSampah = await prisma.sampah.update({
            where: {
                id: id
            },
            data: {
                date: date !== undefined ? new Date(date) : sampah.date,
                kaca: kaca !== undefined ? Number(kaca) : sampah.kaca,
                kertas: kertas !== undefined ? Number(kertas) : sampah.kertas,
                plastik: plastik !== undefined ? Number(plastik) : sampah.plastik,
                organik_sisa: organik_sisa !== undefined ? Number(organik_sisa) : sampah.organik_sisa,
                organik_kebun: organik_kebun !== undefined ? Number(organik_kebun) : sampah.organik_kebun,
                organik_cacah: organik_cacah !== undefined ? Number(organik_cacah) : sampah.organik_cacah,
                residu: residu !== undefined ? Number(residu) : sampah.residu,
                trashbag: trashbag !== undefined ? Number(trashbag) : sampah.trashbag,
                keterangan: keterangan !== undefined ? keterangan : sampah.keterangan,
                total : Number(kaca) !== undefined ? Number(kaca) : sampah.kaca + Number(kertas) !== undefined ? Number(kertas) : sampah.kertas + Number(plastik) !== undefined ? Number(plastik) : sampah.plastik + Number(organik_sisa) !== undefined ? Number(organik_sisa) : sampah.organik_sisa + Number(organik_kebun) !== undefined ? Number(organik_kebun) : sampah.organik_kebun + Number(organik_cacah) !== undefined ? Number(organik_cacah) : sampah.organik_cacah + Number(residu) !== undefined ? Number(residu) : sampah.residu 
            }
        });
        logActivity(new Date(), req.cookies.token, "Update Sampah","Sampah", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updatedSampah });
    } catch (error) {
        console.error("Error:", error);
        logActivity(new Date(), req.cookies.token, "Update Sampah","Sampah", "Internal Error", "400", false)
        return res.status(500).json({ status: false, message: "Error" });
    }
};

export const deleteSampah = async (req:Request, res:Response) => {
    const id = req.params.id;
    try {
        const deleteSampah = await prisma.sampah.delete({
            where: {
                id: id
            }
        })
        logActivity(new Date(), req.cookies.token, "Delete Sampah","Sampah", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:deleteSampah})
        
    } catch (error) {
        logActivity(new Date(), req.cookies.token, "Delete Sampah","Sampah", "Internal Error", "400", false)
        return res.status(400).json({status:false,message: "Error"})
        
    }
}