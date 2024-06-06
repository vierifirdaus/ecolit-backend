import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
export const downloadSampah = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sampah');
        worksheet.columns = [
            {header: 'Hari Ke-', key: 'no', width: 10},
            {header: 'Tanggal', key: 'date', width: 10},
            {header: 'Botol, kaca, kaleng, cup', key: 'kaca', width: 10},
            {header: 'Kertas, karton, dus, koran', key: 'kertas', width: 10},
            {header: 'Kresek, plastik bersih, sedotan', key: 'plastik', width: 10},
            {header: 'Organik, sisa makanan (non daun)', key: 'organik_sisa', width: 10},
            {header: 'Organik kebun yang dikumpulkan', key: 'organik_kebun', width: 10},
            {header: 'Organik yang dicacah', key: 'organik_cacah', width: 10},
            {header: 'Residu, kertas nasi, plastik berbumbu/ kotor', key: 'residu', width: 10},
            {header: 'Jumlah trashbag residu', key: 'trashbag', width: 10},
            {header: 'Total', key: 'total', width: 10},
            {header: 'Keterangan lainnya', key: 'keterangan', width: 10},
        ]
        const data = await prisma.sampah.findMany({
            orderBy:{
                date: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                no: i+1,
                date: data[i].date,
                kaca: data[i].kaca,
                kertas: data[i].kertas,
                plastik: data[i].plastik,
                organik_sisa: data[i].organik_sisa,
                organik_kebun: data[i].organik_kebun,
                organik_cacah: data[i].organik_cacah,
                residu: data[i].residu,
                trashbag: data[i].trashbag,
                total: data[i].kaca+data[i].kertas+data[i].plastik+data[i].organik_sisa+data[i].organik_kebun+data[i].organik_cacah+data[i].residu,
                keterangan: data[i].keterangan
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'sampah.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}