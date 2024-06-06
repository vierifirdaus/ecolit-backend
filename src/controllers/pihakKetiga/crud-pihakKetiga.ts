import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { logActivity } from "../../utils/logActivity";
import { log } from "console";

export const addPihakKetiga = async (req: Request, res: Response) => {
    const { nama_organisasi, sebagai, start_kerjasama, periode_kerjasama, nama_contact_person, nomer_contact_person, status, jatah_trashbag_bulanan, biaya_normal, harga_trashbag_tambahan_per_tb } = req.body;
    if (!nama_organisasi || !sebagai || !start_kerjasama || !periode_kerjasama || !nama_contact_person || !nomer_contact_person || !status || !jatah_trashbag_bulanan || !biaya_normal || !harga_trashbag_tambahan_per_tb) {
        logActivity(new Date(), req.cookies.token, "Add Pihak Ketiga", "PihakKetiga", "Incomplete input", "400", false)
        return res.status(400).json({ status: false, message: "Incomplete input!" });
    }

    try {
        const periode = Number(periode_kerjasama);

        const startDate = new Date(start_kerjasama);

        const addPihakKetiga = await prisma.pihakKetiga.create({
            data: {
                nama_organisasi: nama_organisasi,
                sebagai: sebagai,
                start_kerjasama: startDate, // Assigning startDate directly
                periode_kerjasama: periode,
                nama_contact_person,
                nomer_contact_person,
                status,
                jatah_trashbag_bulanan: parseFloat(jatah_trashbag_bulanan as string),
                biaya_normal: biaya_normal,
                harga_trashbag_tambahan_per_tb: harga_trashbag_tambahan_per_tb
            }
        });

        for (let i = 0; i < periode; i++) {
            const startOfMonth = new Date(startDate);
            startOfMonth.setMonth(startOfMonth.getMonth() + i);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);

            await prisma.tagihan.create({
                data: {
                    start: startOfMonth,
                    end: endOfMonth,
                }
            });
        }
        logActivity(new Date(), req.cookies.token, "Add Pihak Ketiga", "PihakKetiga", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: addPihakKetiga });

    } catch (error) {
        console.error(error);
        logActivity(new Date(), req.cookies.token, "Add Pihak Ketiga", "PihakKetiga", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
};



export const getAllPihakKetiga = async (req: Request, res: Response) => {
    try {
        let sortBy = req.query.orderBy as string | undefined;
        let typeOfOrder = req.query.typeOfOrder as string | undefined;
        let nameFilter = req.query.name as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            typeOfOrder = 'asc';
        }

        sortBy = sortBy || 'nama_organisasi';

        const sortByObject = { [sortBy]: typeOfOrder };

        // Construct the where clause conditionally
        const whereClause: any = {};

        if (nameFilter) {
            whereClause.nama_organisasi = {
                contains: nameFilter,
                mode: 'insensitive'
            }
        }

        const allPihakKetiga = await prisma.pihakKetiga.findMany({
            where: whereClause,
            orderBy: sortByObject,
            skip: (page - 1) * limit,
            take: limit,
        });
        return res.status(200).json({ status: true, message: "Success", data: allPihakKetiga });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}

export const getPihakKetigaById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const pihakKetiga = await prisma.pihakKetiga.findUnique({
            where: {
                id: id
            },
        });

        if (!pihakKetiga) {
            return res.status(404).json({ status: false, message: "Organisasi pihak ketiga not found" });
        }

        return res.status(200).json({ status: true, message: "Success", data: pihakKetiga });
    } catch (error) {
        return res.status(400).json({ status: false, message: "Error" });
    }
}


export const updatePihakKetiga = async (req: Request, res: Response) => {
    const { id, nama_organisasi, sebagai, start_kerjasama, periode_kerjasama, nama_contact_person, nomer_contact_person, status, jatah_trashbag_bulanan, biaya_normal, harga_trashbag_tambahan_per_tb } = req.body;

    if (!nama_organisasi && !sebagai && !start_kerjasama && !periode_kerjasama && !nama_contact_person && !nomer_contact_person && !status && !jatah_trashbag_bulanan && !biaya_normal && !harga_trashbag_tambahan_per_tb) {
        logActivity(new Date(), req.cookies.token, "Update Pihak Ketiga", "PihakKetiga", "Incomplete input", "400", false)
        return res.status(400).json({ status: false, message: "Incomplete input!" })
    }

    try {
        const pihakKetiga = await prisma.pihakKetiga.findUnique({
            where: {
                id: id
            }
        });

        if (!pihakKetiga) {
            logActivity(new Date(), req.cookies.token, "Update Pihak Ketiga", "PihakKetiga", "Pihak Ketiga not found", "404", false)
            return res.status(404).json({ status: false, message: "Pihak Ketiga not found" });
        }

        const updatedPihakKetiga = await prisma.pihakKetiga.update({
            where: {
                id: id
            },
            data: {
                nama_organisasi: nama_organisasi,
                sebagai: sebagai,
                start_kerjasama: start_kerjasama !== undefined ? new Date(start_kerjasama) : new Date(),
                periode_kerjasama: periode_kerjasama !== undefined ? periode_kerjasama : "",
                nama_contact_person: nama_contact_person !== undefined ? nama_contact_person : "",
                nomer_contact_person: nomer_contact_person !== undefined ? nomer_contact_person : "",
                status: status !== undefined ? status : 0,
                jatah_trashbag_bulanan: jatah_trashbag_bulanan,
                biaya_normal: biaya_normal,
                harga_trashbag_tambahan_per_tb: harga_trashbag_tambahan_per_tb
            }
        });
        logActivity(new Date(), req.cookies.token, "Update Pihak Ketiga", "PihakKetiga", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updatedPihakKetiga });
    } catch (error) {
        console.error("Error:", error);
        logActivity(new Date(), req.cookies.token, "Update Pihak Ketiga", "PihakKetiga", "Internal Error", "400", false)
        return res.status(500).json({ status: false, message: "Error" });
    }
};

export const deletePihakKetiga = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletePihakKetiga = await prisma.pihakKetiga.delete({
            where: {
                id: id
            }
        })
        logActivity(new Date(), req.cookies.token, "Delete Pihak Ketiga", "PihakKetiga", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: deletePihakKetiga });
    } catch (error) {
        logActivity(new Date(), req.cookies.token, "Delete Pihak Ketiga", "PihakKetiga", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}