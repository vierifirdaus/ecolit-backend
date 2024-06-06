import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
import { start } from "repl";
export const downloadSedekahSampah = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sedekah sampah');
        worksheet.columns = [
            {header: 'No', key: 'no', width: 10},
            {header: 'Partisipan', key: 'partisipan', width: 10},
            {header: 'Tanggal', key: 'date', width: 10},
            {header: 'Nama', key: 'name', width: 10},
            {header: 'Gelas/botol plastik (kg)', key: 'gelas_botol_plastik', width: 10},
            {header: 'Harga gelas/botol plastik', key: 'harga_gelas_botol_plastik', width: 10},
            {header: 'Kardus (kg)', key: 'kardus', width: 10},
            {header: 'Harga kardus', key: 'harga_kardus', width: 10},
            {header: 'Gelas/kaleng alumunium (kg)', key: 'gelas_kaleng_alumunium', width: 10},
            {header: 'Harga gelas/kaleng alumunium', key: 'harga_gelas_kaleng_alumunium', width: 10},
            {header: 'Bohlam (kg)', key: 'bohlam', width: 10},
            {header: 'Harga bohlam', key: 'harga_bohlam', width: 10},
            {header: 'Kabel dan tembaga (kg)', key: 'kabel_dan_tembaga', width: 10},
            {header: 'Harga kabel dan tembaga', key: 'harga_kabel_dan_tembaga', width: 10},
            {header: 'Koran dan kertas (kg)', key: 'koran_dan_kertas', width: 10},
            {header: 'Harga koran dan kertas', key: 'harga_koran_dan_kertas', width: 10},
            {header: 'Botol kemasan (kg)', key: 'botol_kemasan', width: 10},
            {header: 'Harga botol kemasan', key: 'harga_botol_kemasan', width: 10},
            {header: 'Barang elektronik (unit)', key: 'barang_elektronik', width: 10},
            {header: 'Harga barang elektronik', key: 'harga_barang_elektronik', width: 10},
            {header: 'Gelas/botol kaca (kg)', key: 'gelas_botol_kaca', width: 10},
            {header: 'Harga gelas/botol kaca', key: 'harga_gelas_botol_kaca', width: 10},
            {header: 'Barang lain (kg)', key: 'barang_lain', width: 10},
            {header: 'Harga barang lain (total)', key: 'total_harga_barang_lain', width: 10},
            {header: 'Keterangan', key: 'keterangan', width: 10},
            {header: 'Attachment', key: 'attachment', width: 10},
            
            
        ]
        const data = await prisma.sedekahSampah.findMany({
            orderBy:{
                date: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                no: i+1,
                partisipan: data[i].partisipan,
                date: data[i].date,
                name: data[i].name,
                gelas_botol_plastik: data[i].gelas_botol_plastik,
                harga_gelas_botol_plastik: data[i].harga_gelas_botol_plastik,
                kardus: data[i].kardus,
                harga_kardus: data[i].harga_kardus,
                gelas_kaleng_alumunium: data[i].gelas_kaleng_alumunium,
                harga_gelas_kaleng_alumunium: data[i].harga_gelas_kaleng_alumunium,
                bohlam: data[i].bohlam,
                harga_bohlam: data[i].harga_bohlam,
                kabel_dan_tembaga: data[i].kabel_dan_tembaga,
                harga_kabel_dan_tembaga: data[i].harga_kabel_dan_tembaga,
                koran_dan_kertas: data[i].koran_dan_kertas,
                harga_koran_dan_kertas: data[i].harga_koran_dan_kertas,
                botol_kemasan: data[i].botol_kemasan,
                harga_botol_kemasan: data[i].harga_botol_kemasan,
                barang_elektronik: data[i].barang_elektronik,
                harga_barang_elektronik: data[i].harga_barang_elektronik,
                gelas_botol_kaca: data[i].gelas_botol_kaca,
                harga_gelas_botol_kaca: data[i].harga_gelas_botol_kaca,
                barang_lain: data[i].barang_lain,
                total_harga_barang_lain: data[i].total_harga_barang_lain,
                keterangan: data[i].keterangan,
                attachment: data[i].attachment,
     
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'sedekah_sampah.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}