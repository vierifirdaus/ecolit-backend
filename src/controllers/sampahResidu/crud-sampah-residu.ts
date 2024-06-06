import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { logActivity } from "../../utils/logActivity";

export const addSampahResidu = async (req:Request, res:Response) => {
    const { date, sampah_kebun, sampah_makanan, kertas, kaca, logam, plastik_PET, kresek, multilayer_plastic, plastik_lain, residu } = req.body ;
    if(!date) {
        logActivity(new Date(), req.cookies.token, "Add Sampah Residu","SampahResidu", "Tanggal required", "400", false)
        return res.status(400).json({status:false,message: "Tanggal required"})
    }

    try {
        const addSampahResidu = await prisma.sampahResidu.create({
            data: {
                date: new Date(date),
                sampah_kebun: Number(sampah_kebun),
                sampah_makanan: Number(sampah_makanan),
                kertas: Number(kertas),
                kaca: Number(kaca),
                logam: Number(logam),
                plastik_PET: Number(plastik_PET),
                kresek: Number(kresek),
                multilayer_plastic: Number(multilayer_plastic),
                plastik_lain: Number(plastik_lain),
                residu: Number(residu),
            }
        })
        logActivity(new Date(), req.cookies.token, "Add Sampah Residu","SampahResidu", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:addSampahResidu})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Add Sampah Residu","SampahResidu", "Internal Error", "400", false)
        return res.status(400).json({status:false,message:"error"})
        
    }
}

export const getAllSampahResidu = async (req:Request, res:Response) => {
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
            const allSampah = await prisma.sampahResidu.findMany({
                orderBy: orderByObject,
                skip: (page - 1) * limit,
                take: limit,
            });
            return res.status(200).json({ status: true, message: "Success", data: allSampah });
        } else {
            const sampah = await prisma.sampahResidu.findMany({
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

export const getSampahResiduById = async (req:Request, res:Response) => {  
    const { id } = req.params;
    try {
        const sampah = await prisma.sampahResidu.findUnique({
            where: {
                id: id
            }
        })
        if(!sampah) {
            return res.status(400).json({status:false,message: "Sampah residu not found"})
            
        }
        return res.status(200).json({status:true,message: "Success",data:sampah})
        
    } catch (error) {
        return res.status(400).json({status:false,message: "Error"})
        
    }
}


export const updateSampahResidu = async (req: Request, res: Response) => {
    const { id, date, sampah_kebun, sampah_makanan, kertas, kaca, logam, plastik_PET, kresek, multilayer_plastic, plastik_lain, residu } = req.body ;

    if (!date) {
        logActivity(new Date(), req.cookies.token, "Update Sampah Residu","SampahResidu", "Tanggal required", "400", false)
        return res.status(400).json({ status: false, message: "Tanggal required" });
    }

    try {
        const sampah = await prisma.sampahResidu.findUnique({
            where: {
                id: id
            }
        });

        if (!sampah) {
            logActivity(new Date(), req.cookies.token, "Update Sampah Residu","SampahResidu", "Sampah residu not found", "404", false)
            return res.status(404).json({ status: false, message: "Sampah residu not found" });
        }

        const updatedSampah = await prisma.sampahResidu.update({
            where: {
                id: id
            },
            data: {
                date: date !== undefined ? new Date(date) : sampah.date,
                sampah_kebun: sampah_kebun !== undefined ? Number(sampah_kebun) : sampah.sampah_kebun,
                sampah_makanan: sampah_makanan !== undefined ? Number(sampah_makanan) : sampah.sampah_makanan,
                kertas: kertas !== undefined ? Number(kertas) : sampah.kertas,
                kaca: kaca !== undefined ? Number(kaca) : sampah.kaca,
                logam: logam !== undefined ? Number(logam) : sampah.logam,
                plastik_PET: plastik_PET !== undefined ? Number(plastik_PET) : sampah.plastik_PET,
                kresek: kresek !== undefined ? Number(kresek) : sampah.kresek,
                multilayer_plastic: multilayer_plastic !== undefined ? Number(multilayer_plastic) : sampah.multilayer_plastic,
                plastik_lain: plastik_lain !== undefined ? Number(plastik_lain) : sampah.plastik_lain,
                residu: residu !== undefined ? Number(residu) : sampah.residu,

            }
        });
        logActivity(new Date(), req.cookies.token, "Update Sampah Residu","SampahResidu", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updatedSampah });
    } catch (error) {
        console.error("Error:", error);
        logActivity(new Date(), req.cookies.token, "Update Sampah Residu","SampahResidu", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
};

export const deleteSampahResidu = async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        const deleteSampahResidu = await prisma.sampahResidu.delete({
            where: {
                id: id
            }
        })
        logActivity(new Date(), req.cookies.token, "Delete Sampah Residu","SampahResidu", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:deleteSampahResidu})
        
    } catch (error) {
        logActivity(new Date(), req.cookies.token, "Delete Sampah Residu","SampahResidu", "Internal Error", "400", false)
        return res.status(400).json({status:false,message: "Error"})
        
    }
}