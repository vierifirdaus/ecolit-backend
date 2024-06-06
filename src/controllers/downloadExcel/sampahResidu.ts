import { Request, Response } from "express";
import excelJS from "exceljs";
import prisma from "../../data-access/db.server";
export const downloadSampahResidu = async(req:Request, res: Response) => {
    try {
        let workbook = new excelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sampah');
        worksheet.columns = [
            {header: 'No', key: 'no', width: 10},
            {header: 'Tanggal', key: 'date', width: 10},
            {header: 'Sampah kebun (kg)', key: 'sampah_kebun', width: 10},
            {header: 'Sampah makanan', key: 'sampah_makanan', width: 10},
            {header: 'Kompos (kg)', key: 'kompos_berat', width: 10},
            {header: 'Kompos (%)', key: 'kompuos_persen', width: 10},
            {header: 'Kertas', key: 'kertas', width: 10},
            {header: 'Kaca', key: 'kaca', width: 10},
            {header: 'Logam', key: 'logam', width: 10},
            {header: 'Plastik PET', key: 'plastik_PET', width: 10},
            {header: 'Kresek', key: 'kresek', width: 10},
            {header: 'Multilayer plastic', key: 'multilayer_plastic', width: 10},
            {header: 'Plastik lainnya', key: 'plastik_lain', width: 10},
            {header: 'Daur ulang (kg)', key: 'daur_ulang_berat', width: 10},
            {header: 'Daur ulang (%)', key: 'daur_ulang_persen', width: 10},
            {header: 'Residu', key: 'residu', width: 10},
            {header: 'RDF (kg)', key: 'rdf_berat', width: 10},
            {header: 'RDF (%)', key: 'rdf_persen', width: 10},
            {header: 'Total (kg)', key: 'total_berat', width: 10},


        ]
        const data = await prisma.sampahResidu.findMany({
            orderBy:{
                date: 'asc'
            }
        });
        for(let i = 0; i < data.length; i++) {
            worksheet.addRow({
                no: i+1,
                date: data[i].date,
                sampah_kebun: data[i].sampah_kebun,
                sampah_makanan: data[i].sampah_makanan,
                kompos_berat: data[i].sampah_kebun+data[i].sampah_makanan,
                kompos_persen: (data[i].sampah_kebun+data[i].sampah_makanan)/(data[i].residu+data[i].sampah_kebun+data[i].sampah_makanan+data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain)*100,
                kaca: data[i].kaca,
                kertas: data[i].kertas,
                logam: data[i].logam,
                plastik_PET: data[i].plastik_PET,
                kresek: data[i].kresek,
                multilayer_plastic: data[i].multilayer_plastic,
                plastik_lain: data[i].plastik_lain,
                daur_ulang_berat: data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain,
                daur_ulang_persen: (data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain)/(data[i].residu+data[i].sampah_kebun+data[i].sampah_makanan+data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain)*100,
                residu: data[i].residu,
                rdf_berat: data[i].residu,
                rdf_persen: (data[i].residu)/(data[i].residu+data[i].sampah_kebun+data[i].sampah_makanan+data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain)*100,
                total_berat: data[i].residu+data[i].sampah_kebun+data[i].sampah_makanan+data[i].kaca+data[i].kertas+data[i].logam+data[i].plastik_PET+data[i].kresek+data[i].multilayer_plastic+data[i].plastik_lain
            })
        }
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename=' + 'sampah_residu.xlsx'
        );
        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        console.log(error)
    }
}