import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { logActivity } from "../../utils/logActivity";

export const addKolaborator = async (req:Request, res:Response) => {
    const { nama_lengkap, email, bentuk_kolab, nama_organisasi, nomor_wa, akun_instagram, jenis_kolab, alamat, alamat_drop_point, longitude, latitude } = req.body ;
    console.log(req.body)
    if(!nama_lengkap || !email || !bentuk_kolab || !nama_organisasi || !nomor_wa || !akun_instagram || !jenis_kolab || !alamat || !alamat_drop_point || !longitude || !latitude) {
        logActivity(new Date(), req.cookies.token, "Add Kolaborator","Kolaborator", "Data required", "400", false)
        return res.status(400).json({status:false,message: "Data required"})
    }
    try {        
        const addKolaborator = await prisma.kolaboratorQurban.create({
            data: {
                nama_lengkap: nama_lengkap,
                email: email,
                bentuk_kolab: bentuk_kolab,
                nama_organisasi: nama_organisasi,
                nomor_wa: nomor_wa,
                akun_instagram: akun_instagram,
                jenis_kolab: jenis_kolab,
                alamat: alamat,
                alamat_drop_point: alamat_drop_point,
                longitude: longitude,
                latitude: latitude
            }
        })
        logActivity(new Date(), req.cookies.token, "Add Kolaborator","Kolaborator", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:addKolaborator})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Add Kolaborator","Kolaborator", "Internal Error", "400", false)
        return res.status(400).json({status:false,message:"error"})
        
    }
}

export const getKolaboratorById = async (req:Request, res:Response) => {
    const id = req.params.id;
    try {
        const Kolaborator = await prisma.kolaboratorQurban.findUnique({
            where: {
                id: id
            },
        });

        if (!Kolaborator) {
            return res.status(404).json({ status: false, message: "Kolaborator not found" });
        }

        return res.status(200).json({ status: true, message: "Success", data: Kolaborator });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const getAllKolaborator = async (req:Request, res:Response) => {
    let orderBy = req.query.orderBy as string | undefined;
    let typeOfOrder = req.query.typeOfOrder as string | undefined;
    let nama_lengkap = req.query.nama as string | undefined;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
        typeOfOrder = 'asc';
    }

    orderBy = orderBy || 'nama_lengkap';

    const orderByObject = { [orderBy]: typeOfOrder };
    try {
        const allKolaborator = await prisma.kolaboratorQurban.findMany({
            where: {
                ...(nama_lengkap && {
                    nama_lengkap: {
                        contains: nama_lengkap, 
                        mode: 'insensitive' 
                    }
                })
            },
            orderBy: orderByObject,
            skip: (page - 1) * limit,
            take: limit,
        });
        return res.status(200).json({ status: true, message: "Success", data: allKolaborator });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const updateKolaborator = async (req:Request, res:Response) => {
    const { id, nama_lengkap, email, bentuk_kolab, nama_organisasi, nomor_wa, akun_instagram, jenis_kolab, alamat, alamat_drop_point, longitude, latitude } = req.body;
    try {
        const Kolaborator = await prisma.kolaboratorQurban.findUnique({
            where: {
                id: id
            },
        });
        
        const updateKolaborator = await prisma.kolaboratorQurban.update({
            where: {
                id: id
            },
            data: {
                nama_lengkap: nama_lengkap,
                email: email,
                bentuk_kolab: bentuk_kolab,
                nama_organisasi: nama_organisasi,
                nomor_wa: nomor_wa,
                akun_instagram: akun_instagram,
                jenis_kolab: jenis_kolab,
                alamat: alamat,
                alamat_drop_point: alamat_drop_point,
                longitude: longitude,
                latitude: latitude
            }
        })
        logActivity(new Date(), req.cookies.token, "Update Kolaborator","Kolaborator", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updateKolaborator });
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Update Kolaborator","Kolaborator", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const deleteKolaborator = async (req:Request, res:Response) => {
    const id = req.params.id;
    try {
        const deleteKolaborator = await prisma.kolaboratorQurban.delete({
            where: {
                id: id 
            },
        });
        logActivity(new Date(), req.cookies.token, "Delete Kolaborator","Kolaborator", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: deleteKolaborator });
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Delete Kolaborator","Kolaborator", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}
