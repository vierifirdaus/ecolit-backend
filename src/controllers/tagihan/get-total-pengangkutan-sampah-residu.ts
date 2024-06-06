import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

interface PengangkutanSampahResidu {
    bulan : string,
    sampah_kebun : number,
    sampah_makanan : number,
    total_kompos : number,
    kertas : number,
    kaca : number,
    logam : number,
    plastik_PET : number,
    plastik_lain : number,
    kresek : number,
    multilayer_plastic : number,
    total_daur_ulang_sampah : number,
    residu : number,
    total_residu : number,
    kompos_persentase : number,
    daur_ulang_persentase : number,
    residu_persentase : number,
    total : number
}

export const getTotalPenangkutanSampahResidu = async (req: Request, res: Response) => {
    try {
        const residuByMonth = await prisma.sampahResidu.groupBy({
            by: ['date'],
            _sum: {
                sampah_kebun: true,
                sampah_makanan: true,
                kertas: true,
                kaca: true,
                logam: true,
                plastik_PET: true,
                kresek: true,
                multilayer_plastic: true,
                plastik_lain: true,
                residu: true
            }
        });

        const residuGroupGroupedByMonth = residuByMonth.reduce((acc: any, residu: any) => {
            const date = new Date(residu.date);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    bulan: monthYear,
                    sampah_kebun: 0,
                    sampah_makanan: 0,
                    kertas: 0,
                    kaca: 0,
                    logam: 0,
                    plastik_PET: 0,
                    kresek: 0,
                    multilayer_plastic: 0,
                    plastik_lain: 0,
                    residu: 0
                };
            }
            acc[monthYear].sampah_kebun += residu._sum.sampah_kebun || 0;
            acc[monthYear].sampah_makanan += residu._sum.sampah_makanan || 0;
            acc[monthYear].kertas += residu._sum.kertas || 0;
            acc[monthYear].kaca += residu._sum.kaca || 0;
            acc[monthYear].logam += residu._sum.logam || 0;
            acc[monthYear].plastik_PET += residu._sum.plastik_PET || 0;
            acc[monthYear].kresek += residu._sum.kresek || 0;
            acc[monthYear].multilayer_plastic += residu._sum.multilayer_plastic || 0;
            acc[monthYear].plastik_lain += residu._sum.plastik_lain || 0;
            acc[monthYear].residu += residu._sum.residu || 0;

            return acc;
        }, {});

        const residuGroupGroupedByMonthList : any = Object.entries(residuGroupGroupedByMonth).map(([month, values]) => values);

        let data: PengangkutanSampahResidu[] = [];
        for (let i = 0; i < residuGroupGroupedByMonthList.length; i++) {

            const monthData = residuGroupGroupedByMonthList[i];
            const total_kompos = monthData.sampah_kebun + monthData.sampah_makanan;
            const total_daur_ulang = monthData.kertas + monthData.kaca + monthData.logam + monthData.plastik_PET + monthData.kresek + monthData.multilayer_plastic + monthData.plastik_lain;

            data.push({
                bulan: monthData.bulan,
                sampah_kebun: monthData.sampah_kebun,
                sampah_makanan: monthData.sampah_makanan,
                total_kompos: total_kompos,
                kertas: monthData.kertas,
                kaca: monthData.kaca,
                logam: monthData.logam,
                plastik_PET: monthData.plastik_PET,
                plastik_lain: monthData.plastik_lain,
                kresek: monthData.kresek,
                multilayer_plastic: monthData.multilayer_plastic,
                total_daur_ulang_sampah: total_daur_ulang,
                residu: monthData.residu,
                total_residu: monthData.residu,
                kompos_persentase: parseFloat(((total_kompos / (total_kompos + total_daur_ulang + monthData.residu)) * 100).toFixed(2)),
                daur_ulang_persentase: parseFloat(((total_daur_ulang / (total_kompos + total_daur_ulang + monthData.residu)) * 100).toFixed(2)),
                residu_persentase: parseFloat(((monthData.residu / (total_kompos + total_daur_ulang + monthData.residu)) * 100).toFixed(2)),
                total: total_kompos + total_daur_ulang + monthData.residu
            });
        }

        // Sort data by month
        data.sort((a, b) => new Date(`1 ${a.bulan}`).getTime() - new Date(`1 ${b.bulan}`).getTime());

        return res.status(200).json({
            status: true,
            message: "Success",
            data: data
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "error" });
    }
};
