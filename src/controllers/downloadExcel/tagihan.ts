import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
import { start } from "repl";
export const downloadTagihan = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Tagihan');
        worksheet.columns = [
            {header: 'No', key: 'no', width: 10},
            {header: 'Start', key: 'start', width: 10},
            {header: 'End', key: 'end', width: 10},
            {header: 'Tb/bln', key: 'trash_bag', width: 10},
            {header: 'Hari angkut', key: 'hari_angkut', width: 10},
            {header: 'Harga normal', key: 'harga_normal', width: 10},
            {header: 'Tambahan angkut', key: 'trash_bag_tambahan', width: 10},
            {header: 'Harga tambahan', key: 'harga_tambahan', width: 10},
            {header: 'Total tagihan', key: 'total_tagihan', width: 10},
            {header: 'Status', key: 'status', width: 10},
            {header: 'Invoice', key: 'invoice', width: 10},
            
        ]
        const data = await prisma.tagihan.findMany({
            orderBy:{
                start: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                no: i+1,
                start: data[i].start,
                end: data[i].end,
                trash_bag: data[i].trash_bag,
                hari_angkut: data[i].hari_angkut,
                harga_normal: data[i].harga_normal,
                trash_bag_tambahan: data[i].trash_bag_tambahan,
                harga_tambahan: data[i].harga_tambahan,
                total_tagihan: data[i].harga_normal+data[i].harga_tambahan,
                status: data[i].status,
                invoice: data[i].invoice,
     
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'tagihan.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}