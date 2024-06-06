import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
export const downlaodKolaboratorQurban = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Pengangkutan');
        worksheet.columns = [
            {header: 'Nama lengkap', key: 'nama_lengkap', width: 10},
            {header: 'Bentuk kolaborasi', key: 'bentuk_kolab', width: 10},
            {header: 'Nama organisasi', key: 'nama_organisasi', width: 10},
            {header: 'Nomor Whatsapp', key: 'nomor_wa', width: 10},
            {header: 'Akun Instagram', key: 'akun_instagram', width: 10},
            {header: 'Jenis kolaborasi', key: 'jenis_kolab', width: 10},
            {header: 'Alamat', key: 'alamat', width: 10},
            {header: 'Alamat drop point', key: 'alamat_drop_point', width: 10}
        ]
        const data = await prisma.kolaboratorQurban.findMany({
            orderBy:{
                nama_lengkap: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                nama_lengkap: data[i].nama_lengkap,
                bentuk_kolab: data[i].bentuk_kolab,
                nama_organisasi: data[i].nama_organisasi,
                nomor_wa: data[i].nomor_wa,
                akun_instagram: data[i].akun_instagram,
                jenis_kolab: data[i].jenis_kolab,
                alamat: data[i].alamat,
                alamat_drop_point: data[i].alamat_drop_point
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'kolaborator_qurban.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}