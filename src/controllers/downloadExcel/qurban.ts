import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
export const downlaodQurban = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Pengangkutan');
        worksheet.columns = [
            {header: 'Tanggal', key: 'date', width: 10},
            {header: 'Email', key: 'email', width: 10},
            {header: 'Tanggal report', key: 'tanggal_report', width: 10},
            {header: 'Besek 12 cm', key: 'ukuran_12', width: 10},
            {header: 'Besek 14 cm', key: 'ukuran_14', width: 10},
            {header: 'Besek 16 cm', key: 'ukuran_16', width: 10},
            {header: 'Besek 18 cm', key: 'ukuran_18', width: 10},
            {header: 'Besek 20 cm', key: 'ukuran_20', width: 10},
            {header: 'Ukuran selain kriteria', key: 'tidak_ukuran_panjang', width: 10},
            {header: 'Besek rusak', key: 'rusak_panjang', width: 10},
            {header: 'Besek wadah saja', key: 'hanya_wadah_panjang', width: 10},
            {header: 'Besek tutup saja', key: 'hanya_tutup_panjang', width: 10},
            {header: 'Thinwall 650 ml', key: 'ukuran_650', width: 10},
            {header: 'Thinwall 700 ml', key: 'ukuran_700', width: 10},
            {header: 'Thinwall 750 ml', key: 'ukuran_750', width: 10},
            {header: 'Thinwall 800 ml', key: 'ukuran_800', width: 10},
            {header: 'Thinwall 900 ml', key: 'ukuran_900', width: 10},
            {header: 'Thinwall 1000 ml', key: 'ukuran_1000', width: 10},
            {header: 'Thinwall 1500 ml', key: 'ukuran_1500', width: 10},
            {header: 'Thinwall ukuran selain kriteria', key: 'tidak_ukuran_ml', width: 10},
            {header: 'Thinwall rusak', key: 'rusak_ml', width: 10},
            {header: 'Thinwall wadah saja', key: 'hanya_wadah_ml', width: 10},
            {header: 'Thinwall tutup saja', key: 'hanya_tutup_ml', width: 10},
            {header: 'Dokumentasi', key: 'dokumentasi', width: 10},
            {header: 'Keterangan', key: 'keterangan', width: 10},
            {header: 'Keterangan tambahan', key: 'keterangan_tambahan', width: 10},


        ]
        const data = await prisma.qurban.findMany({
            orderBy:{
                date: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                date: data[i].date,
                email: data[i].email,
                tanggal_report: data[i].tanggal_report,
                ukuran_12: data[i].ukuran_12,
                ukuran_14: data[i].ukuran_14,
                ukuran_16: data[i].ukuran_16,
                ukuran_18: data[i].ukuran_18,
                ukuran_20: data[i].ukuran_20,
                tidak_ukuran_panjang: data[i].tidak_ukuran_panjang,
                rusak_panjang: data[i].rusak_panjang,
                hanya_wadah_panjang: data[i].hanya_wadah_panjang,
                hanya_tutup_panjang: data[i].hanya_tutup_panjang,
                ukuran_650: data[i].ukuran_650,
                ukuran_700: data[i].ukuran_700,
                ukuran_750: data[i].ukuran_750,
                ukuran_800: data[i].ukuran_800,
                ukuran_900: data[i].ukuran_900,
                ukuran_1000: data[i].ukuran_1000,
                ukuran_1500: data[i].ukuran_1500,
                tidak_ukuran_ml: data[i].tidak_ukuran_ml,
                rusak_ml: data[i].rusak_ml,
                hanya_wadah_ml: data[i].hanya_wadah_ml,
                hanya_tutup_ml: data[i].hanya_tutup_ml,
                dokumentasi: data[i].dokumentasi,
                keterangan: data[i].keterangan,
                keterangan_tambahan: data[i].keterangan_tambahan,
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'qurban.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}