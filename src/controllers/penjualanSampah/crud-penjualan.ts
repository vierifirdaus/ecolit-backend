import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { logActivity } from "../../utils/logActivity";
import { log } from "console";

export const addPenjualanSampah = async (req:Request, res:Response) => {
    const { date, name, gelas_botol_plastik, harga_gelas_botol_plastik, kardus, harga_kardus, gelas_kaleng_alumunium, harga_gelas_kaleng_alumunium, bohlam, harga_bohlam, kabel_dan_tembaga, harga_kabel_dan_tembaga, koran_dan_kertas, harga_koran_dan_kertas, botol_kemasan, harga_botol_kemasan, barang_elektronik, harga_barang_elektronik, gelas_botol_kaca, harga_gelas_botol_kaca, barang_lain, total_harga_barang_lain, keterangan, attachment } = req.body ;
    if(!date) {
        logActivity(new Date(), req.cookies.token, "Add Penjualan Sampah","PenjualanSampah", "Tanggal required", "400", false)
        return res.status(400).json({status:false,message: "Tanggal required"})
    }

    try {
        const addPenjualanSampah = await prisma.penjualanSampah.create({
            data: {
                date: new Date(date),
                name: name,
                gelas_botol_plastik: Number(gelas_botol_plastik),
                harga_gelas_botol_plastik: Number(harga_gelas_botol_plastik),
                kardus: Number(kardus),
                harga_kardus: Number(harga_kardus),
                gelas_kaleng_alumunium: Number(gelas_kaleng_alumunium),
                harga_gelas_kaleng_alumunium: Number(harga_gelas_kaleng_alumunium),
                bohlam: Number(bohlam),
                harga_bohlam: Number(harga_bohlam),
                kabel_dan_tembaga: Number(kabel_dan_tembaga),
                harga_kabel_dan_tembaga: Number(harga_kabel_dan_tembaga),
                koran_dan_kertas: Number(koran_dan_kertas),
                harga_koran_dan_kertas: Number(harga_koran_dan_kertas),
                botol_kemasan: Number(botol_kemasan),
                harga_botol_kemasan: Number(harga_botol_kemasan),
                barang_elektronik: Number(barang_elektronik),
                harga_barang_elektronik: Number(harga_barang_elektronik),
                gelas_botol_kaca: Number(gelas_botol_kaca),
                harga_gelas_botol_kaca: Number(harga_gelas_botol_kaca),

                barang_lain: Number(barang_lain),
                total_harga_barang_lain: Number(total_harga_barang_lain),
                keterangan: keterangan,
                attachment: attachment
            
            }
        })
        logActivity(new Date(), req.cookies.token, "Add Penjualan Sampah","PenjualanSampah", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:addPenjualanSampah})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Add Penjualan Sampah","PenjualanSampah", "Internal Error", "400", false)
        return res.status(400).json({status:false,message:"error"})
        
    }
}

export const getAllPenjualanSampah = async (req:Request, res:Response) => {
    try {
        const date = req.query.date;

        if (!date) {
            const allPenjualanSampah = await prisma.penjualanSampah.findMany({});
            return res.status(200).json({ status: true, message: "Success", data: allPenjualanSampah });
        } else {
            const sampah = await prisma.penjualanSampah.findMany({
                where: {
                    date: date as string
                },
            });

            if (!sampah) {
                return res.status(404).json({ status: false, message: "Penjualan sampah not found" });
            }

            return res.status(200).json({ status: true, message: "Success", data: sampah });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const getPenjualanSampahById = async (req:Request, res:Response) => {  
    const { id } = req.params;
    try {
        const sampah = await prisma.penjualanSampah.findUnique({
            where: {
                id: id
            }
        })
        if(!sampah) {
            return res.status(400).json({status:false,message: "Penjualan sampah not found"})
            
        }
        return res.status(200).json({status:true,message: "Success",data:sampah})
        
    } catch (error) {
        return res.status(400).json({status:false,message: "Error"})
        
    }
}


export const updatePenjualanSampah = async (req: Request, res: Response) => {
    const { id, date, name, gelas_botol_plastik, harga_gelas_botol_plastik, kardus, harga_kardus, gelas_kaleng_alumunium, harga_gelas_kaleng_alumunium, bohlam, harga_bohlam, kabel_dan_tembaga, harga_kabel_dan_tembaga, koran_dan_kertas, harga_koran_dan_kertas, botol_kemasan, harga_botol_kemasan, barang_elektronik, harga_barang_elektronik, gelas_botol_kaca, harga_gelas_botol_kaca, barang_lain, total_harga_barang_lain, keterangan, attachment } = req.body ;

    if (!date) {
        logActivity(new Date(), req.cookies.token, "Update Penjualan Sampah", "PenjualanSampah","Tanggal required", "400", false)
        return res.status(400).json({ status: false, message: "Tanggal required" });
    }

    try {
        const sampah = await prisma.penjualanSampah.findUnique({
            where: {
                id: id
            }
        });

        if (!sampah) {
            logActivity(new Date(), req.cookies.token, "Update Penjualan Sampah","PenjualanSampah", "Penjualan sampah not found", "404", false)
            return res.status(404).json({ status: false, message: "Penjualan sampah not found" });
        }

        const updatedSampah = await prisma.penjualanSampah.update({
            where: {
                id: id
            },
            data: {
                date: date !== undefined ? new Date(date) : sampah.date,
                name: name,
                gelas_botol_plastik: gelas_botol_plastik !== undefined ? Number(gelas_botol_plastik) : sampah.gelas_botol_plastik,
                harga_gelas_botol_plastik: harga_gelas_botol_plastik !== undefined ? Number(harga_gelas_botol_plastik) : sampah.harga_gelas_botol_plastik,
                kardus: kardus !== undefined ? Number(kardus) : sampah.kardus,
                harga_kardus: harga_kardus !== undefined ? Number(harga_kardus) : sampah.harga_kardus,
                gelas_kaleng_alumunium: gelas_kaleng_alumunium !== undefined ? Number(gelas_kaleng_alumunium) : sampah.gelas_kaleng_alumunium,
                harga_gelas_kaleng_alumunium: harga_gelas_kaleng_alumunium !== undefined ? Number(harga_gelas_kaleng_alumunium) : sampah.harga_gelas_kaleng_alumunium,
                bohlam: bohlam !== undefined ? Number(bohlam) : sampah.bohlam,
                harga_bohlam: harga_bohlam !== undefined ? Number(harga_bohlam) : sampah.harga_bohlam,
                kabel_dan_tembaga: kabel_dan_tembaga !== undefined ? Number(kabel_dan_tembaga) : sampah.kabel_dan_tembaga,
                harga_kabel_dan_tembaga: harga_kabel_dan_tembaga !== undefined ? Number(harga_kabel_dan_tembaga) : sampah.harga_kabel_dan_tembaga,
                koran_dan_kertas: koran_dan_kertas !== undefined ? Number(koran_dan_kertas) : sampah.koran_dan_kertas,
                harga_koran_dan_kertas: harga_koran_dan_kertas !== undefined ? Number(harga_koran_dan_kertas) : sampah.harga_koran_dan_kertas,
                botol_kemasan: botol_kemasan !== undefined ? Number(botol_kemasan) : sampah.botol_kemasan,
                harga_botol_kemasan: harga_botol_kemasan !== undefined ? Number(harga_botol_kemasan) : sampah.harga_botol_kemasan,
                barang_elektronik: barang_elektronik !== undefined ? Number(barang_elektronik) : sampah.barang_elektronik,
                harga_barang_elektronik: harga_barang_elektronik !== undefined ? Number(harga_barang_elektronik) : sampah.harga_barang_elektronik,
                gelas_botol_kaca: gelas_botol_kaca !== undefined ? Number(gelas_botol_kaca) : sampah.gelas_botol_kaca,
                harga_gelas_botol_kaca: harga_gelas_botol_kaca !== undefined ? Number(harga_gelas_botol_kaca) : sampah.harga_gelas_botol_kaca,
                barang_lain: barang_lain !== undefined ? Number(barang_lain) : sampah.barang_lain,
                total_harga_barang_lain: total_harga_barang_lain !== undefined ? Number(total_harga_barang_lain) : sampah.total_harga_barang_lain,
                keterangan: keterangan,
                attachment: attachment

            }
        });
        logActivity(new Date(), req.cookies.token, "Update Penjualan Sampah","PenjualanSampah", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updatedSampah });
    } catch (error) {
        console.error("Error:", error);
        logActivity(new Date(), req.cookies.token, "Update Penjualan Sampah","PenjualanSampah", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
};

export const deletePenjualanSampah = async (req:Request, res:Response) => {
    const { id } = req.body;
    try {
        const deleteSampah = await prisma.penjualanSampah.delete({
            where: {
                id: id
            }
        })
        logActivity(new Date(), req.cookies.token, "Delete Penjualan Sampah","PenjualanSampah", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:deleteSampah})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Delete Penjualan Sampah","PenjualanSampah", "Internal Error", "400", false)
        return res.status(400).json({status:false,message: "Error"})
        
    }
}