import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
export const downlaodPengangkutan = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Pengangkutan');
        worksheet.columns = [
            {header: 'Bulan', key: 'bulan', width: 10},
            {header: 'Pekan', key: 'pekan', width: 10},
            {header: 'Tanggal', key: 'tanggal', width: 10},
            {header: 'Status', key: 'status', width: 10},
            {header: 'Operator', key: 'operator', width: 10},
            {header: 'Jam', key: 'jam', width: 10},
            {header: 'hitam', key: 'hitam', width: 10},
            {header: 'Surat Jalan', key: 'surat_jalan', width: 10}
        ]
        const data = await prisma.pengangkutan.findMany({
            orderBy:{
                date: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                bulan: data[i].bulan,
                pekan: data[i].pekan,
                tanggal: data[i].date,
                status: data[i].status,
                operator: data[i].operator,
                jam: data[i].jam,
                hitam: data[i].hitam,
                surat_jalan: data[i].surat_jalan
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'pengangkutan.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}