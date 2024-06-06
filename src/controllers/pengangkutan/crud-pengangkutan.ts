import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { Readable } from "stream";
import { logActivity } from "../../utils/logActivity";
import { driveServices } from "../../utils/qurbanSetup";

export const addPengangkutan = async (req:Request, res:Response) => {
    const { date, status, operator, jam, hitam, keterangan, bulan, pekan } = req.body ;
    console.log(req.body)
    console.log("cookie ",req.cookies)
    if(!date || !status || !operator || !jam || !hitam || !bulan) {
        logActivity(new Date(), req.cookies.token, "Add Pengangkutan","Pengangkutan", "Date, status, operator, jam, hitam, keterangan, bulan, pekan required", "400", false)
        return res.status(400).json({status:false,message: "Date, tempat_sampah_id, sampah_id and total required"})
    }
    const file= req.file;
    if(!file) {
        logActivity(new Date(), req.cookies.token, "Add Pengangkutan","Pengangkutan", "File required", "400", false)
        return res.status(400).json({status:false,message: "File required"})
    }

    try {
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
        
        const addPengangkutan = await prisma.pengangkutan.create({
            data: {
                date: new Date(date),
                status: status,
                operator: operator,
                jam:jam,
                hitam: Number(hitam),
                surat_jalan: "https://drive.google.com/file/d/"+dataFile.data.id as string+"/view",
                keterangan: keterangan,
                bulan: bulan,
                pekan: pekan || "0"
            }
        })

        // tambah ke tagihan
        const tagihan = await prisma.tagihan.findFirst({
            where: {
                start: {
                    lte: new Date(date)
                },
                end: {
                    gte: new Date(date)
                }
            }
        })
        if(!tagihan){
            logActivity(new Date(), req.cookies.token, "Add Pengangkutan","Pengangkutan", "Tagihan not found", "400", false)
            return res.status(400).json({status:false,message:"Tagihan not found"})
        }
        const trash_bag = tagihan.trash_bag + Number(hitam)
        const trash_bag_tambahan = tagihan.trash_bag + Number(hitam)>147 ? tagihan.trash_bag + Number(hitam)-147 : 0
        const harga_normal = 24163 * trash_bag
        const harga_tambahan = 24420 * trash_bag_tambahan
        const addTrashBag = await prisma.tagihan.update({
            where: {
                id: tagihan.id
            },
            data: {
                trash_bag: trash_bag,
                trash_bag_tambahan : trash_bag_tambahan, 
                hari_angkut: status=="ANGKUT" ? tagihan.hari_angkut + 1 : tagihan.hari_angkut,
                harga_normal : harga_normal,
                harga_tambahan : harga_tambahan,
                tagihan : harga_normal + harga_tambahan
            }
        })
        logActivity(new Date(), req.cookies.token, "Add Pengangkutan","Pengangkutan", "", "200", true)
        return res.status(200).json({status:true,message: "Success",data:addPengangkutan})
        
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Add Pengangkutan","Pengangkutan", "Internal Error", "400", false)
        return res.status(400).json({status:false,message:"error"})
        
    }
}

export const getPenganngkutanById = async (req:Request, res:Response) => {
    const id = req.params.id;
    try {
        const pengangkutan = await prisma.pengangkutan.findUnique({
            where: {
                id: id
            },
        });

        if (!pengangkutan) {
            return res.status(404).json({ status: false, message: "Pengangkutan not found" });
        }

        return res.status(200).json({ status: true, message: "Success", data: pengangkutan });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const getAllPengangkutan = async (req: Request, res: Response) => {
    try {
        const date = req.query.date as string | undefined;
        let sortBy = req.query.orderBy as string | undefined;
        let typeOfOrder = req.query.typeOfOrder as string | undefined;
        let statusFilter = req.query.status as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            typeOfOrder = 'asc';
        }

        sortBy = sortBy || 'date';

        const sortByObject = { [sortBy]: typeOfOrder };

        // Construct the where clause conditionally
        const whereClause: any = {};
        
        if (statusFilter && statusFilter !== 'ALL' && statusFilter !== 'all') {
            whereClause.status = statusFilter;
        }

        if (date) {
            whereClause.date = date;
        }

        const allPengangkutan = await prisma.pengangkutan.findMany({
            where: whereClause,
            orderBy: sortByObject,
            skip: (page - 1) * limit,
            take: limit,
        });

        return res.status(200).json({ status: true, message: "Success", data: allPengangkutan });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: "Error" });
    }
};

export const updatePengangkutan = async (req:Request, res:Response) => {
    const { id, date, status, operator, jam, hitam, keterangan, bulan, pekan } = req.body;
    try {
        const pengangkutan = await prisma.pengangkutan.findUnique({
            where: {
                id: id
            },
        });
        const file= req.file;
        let surat_jalan = ""
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
            surat_jalan= "https://drive.google.com/file/d/"+dataFile.data.id as string+"/view"
        }
        const updatePengangkutan = await prisma.pengangkutan.update({
            where: {
                id: id
            },
            data: {
                date: date !== undefined ? new Date(date) : (pengangkutan?.date || new Date()),
                status: status!== undefined ? status : (pengangkutan?.status || ""),
                operator: operator !== undefined ? operator : (pengangkutan?.operator || ""),
                jam: jam !== undefined ? jam : (pengangkutan?.jam || ""),
                hitam: hitam !== undefined ? Number(hitam) : (pengangkutan?.hitam || 0),
                surat_jalan: surat_jalan != "" ? surat_jalan : (pengangkutan?.surat_jalan || ""),
                keterangan: keterangan !== undefined ? keterangan : (pengangkutan?.keterangan || ""),
                bulan: bulan !== undefined ? bulan : (pengangkutan?.bulan || ""),
                pekan: pekan !== undefined ? pekan : (pengangkutan?.pekan || "")
            }
        })

        // update tagihan
        const tagihan = await prisma.tagihan.findFirst({
            where: {
                start: {
                    lte: new Date(date)
                },
                end: {
                    gte: new Date(date)
                }
            }
        })
        console.log("ini tagihan",tagihan)
        console.log("ini pengangkutan",updatePengangkutan)
        if(!tagihan){
            logActivity(new Date(), req.cookies.token, "Update Pengangkutan","Pengangkutan", "Tagihan not found", "400", false)
            return res.status(400).json({status:false,message:"Tagihan not found"})
        }
        const trash_bag = tagihan.trash_bag - Number(pengangkutan?.hitam) + Number(hitam||0)
        const trash_bag_tambahan = tagihan.trash_bag - Number(pengangkutan?.hitam) + Number(hitam||0)>147 ? tagihan.trash_bag - Number(pengangkutan?.hitam) + Number(hitam||0)-147 : 0
        const harga_normal = 24163 * trash_bag
        const harga_tambahan = 24420 * trash_bag_tambahan
        const addTrashBag = await prisma.tagihan.update({
            where: {
                id: tagihan.id
            },
            data: {
                trash_bag: trash_bag,
                trash_bag_tambahan : trash_bag_tambahan,
                hari_angkut: status=="ANGKUT" ? tagihan.hari_angkut + 1 : tagihan.hari_angkut,
                harga_normal : harga_normal,
                harga_tambahan : harga_tambahan,
                tagihan : harga_normal + harga_tambahan
            }
        })
        
        logActivity(new Date(), req.cookies.token, "Update Pengangkutan","Pengangkutan", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updatePengangkutan });
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Update Pengangkutan","Pengangkutan", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const deletePengangkutan = async (req:Request, res:Response) => {
    const id = req.params.id;
    console.log(id)
    try {
        const pengangkutan = await prisma.pengangkutan.findUnique({
            where: {
                id: id 
            },
        });
        // update tagihan
        const tagihan = await prisma.tagihan.findFirst({
            where: {
                start: {
                    lte: pengangkutan?.date
                },
                end: {
                    gte: pengangkutan?.date
                }
            }
        })
        if(!tagihan){
            logActivity(new Date(), req.cookies.token, "Delete Pengangkutan","Pengangkutan", "Tagihan not found", "400", false)
            return res.status(400).json({status:false,message:"Tagihan not found"})
        }
        const trash_bag = tagihan.trash_bag - Number(pengangkutan?.hitam)
        const trash_bag_tambahan = tagihan.trash_bag - Number(pengangkutan?.hitam)>147 ? tagihan.trash_bag - Number(pengangkutan?.hitam)-147 : 0
        const harga_normal = 24163 * trash_bag
        const harga_tambahan = 24420 * trash_bag_tambahan
        const addTrashBag = await prisma.tagihan.update({
            where: {
                id: tagihan.id
            },
            data: {
                trash_bag: trash_bag,
                trash_bag_tambahan : trash_bag_tambahan,
                hari_angkut: pengangkutan?.status=="ANGKUT" ? tagihan.hari_angkut - 1 : tagihan.hari_angkut,
                harga_normal : harga_normal,
                harga_tambahan : harga_tambahan,
                tagihan : harga_normal + harga_tambahan
            }
        })
        console.log(pengangkutan?.surat_jalan.substring(32).slice(0,-5))
        await driveServices.files.delete({
            fileId: pengangkutan?.surat_jalan.substring(32).slice(0,-5), 
        });
        const deletePengangkutan = await prisma.pengangkutan.delete({
            where: {
                id: id
            }
        })
        logActivity(new Date(), req.cookies.token, "Delete Pengangkutan","Pengangkutan", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: deletePengangkutan });
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Delete Pengangkutan","Pengangkutan", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}
