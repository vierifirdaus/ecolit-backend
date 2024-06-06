import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

interface PenangananSampah {
    bulan : string,
    kompos_salman : number,
    kompos_pihak_ketiga : number,
    total_kompos : number,
    persentase_kompos : number,
    persentase_kompos_pihak_ketiga : number,
    persentase_kompos_salman : number,
    daur_ulang_salman : number,
    daur_ulang_pihak_ketiga : number,
    total_daur_ulang_sampah : number,
    persentase_daur_ulang_sampah : number,
    persentase_daur_ulang_sampah_pihak_ketiga : number,
    persentase_daur_ulang_sampah_salman : number,
    total_residu : number,
    persentase_residu : number,
    total : number
}

export const getTotalPenangananSampah = async (req: Request, res: Response) => {
    try {
        const sampahByMonth = await prisma.sampah.groupBy({
            by: ['date'],
            _sum: {
                kaca: true,
                kertas: true,
                plastik: true,
                organik_sisa: true,
                organik_kebun: true,
                organik_cacah: true,
                residu: true,
                trashbag: true
            }
        });

        const sampahGroupGroupedByMonth = sampahByMonth.reduce((acc: any, sampah: any) => {
            const monthYear = sampah.date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    bulan: monthYear,
                    kaca: 0,
                    kertas: 0,
                    plastik: 0,
                    organik_sisa: 0,
                    organik_kebun: 0,
                    organik_cacah: 0,
                    residu: 0,
                    trashbag: 0
                };
            }
            acc[monthYear].kaca += sampah._sum.kaca;
            acc[monthYear].kertas += sampah._sum.kertas;
            acc[monthYear].plastik += sampah._sum.plastik;
            acc[monthYear].organik_sisa += sampah._sum.organik_sisa;
            acc[monthYear].organik_kebun += sampah._sum.organik_kebun;
            acc[monthYear].organik_cacah += sampah._sum.organik_cacah;
            acc[monthYear].residu += sampah._sum.residu;
            acc[monthYear].trashbag += sampah._sum.trashbag;

            return acc;
        }, {});

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
            const monthYear = residu.date.toLocaleString('default', { month: 'long', year: 'numeric' });
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
            acc[monthYear].sampah_kebun += residu._sum.sampah_kebun;
            acc[monthYear].sampah_makanan += residu._sum.sampah_makanan;
            acc[monthYear].kertas += residu._sum.kertas;
            acc[monthYear].kaca += residu._sum.kaca;
            acc[monthYear].logam += residu._sum.logam;
            acc[monthYear].plastik_PET += residu._sum.plastik_PET;
            acc[monthYear].kresek += residu._sum.kresek;
            acc[monthYear].multilayer_plastic += residu._sum.multilayer_plastic;
            acc[monthYear].plastik_lain += residu._sum.plastik_lain;
            acc[monthYear].residu += residu._sum.residu;

            return acc;
        }, {});

        const mandiriGroupedByMonthList = Object.entries(sampahGroupGroupedByMonth).map(([month, values]) => ({ month, ...(values as object) }));
        const residuGroupGroupedByMonthList = Object.entries(residuGroupGroupedByMonth).map(([month, values]) => ({ month, ...(values as object) }));

        let data: PenangananSampah[] = [];
        for (let i = 0; i < mandiriGroupedByMonthList.length; i++) {

            const monthData = mandiriGroupedByMonthList[i] as any;

            const kompos_salman = monthData.organik_sisa + monthData.organik_kebun ;
            
            const daur_ulang_salman = monthData.kaca + monthData.kertas + monthData.plastik;

            data.push({
                bulan : monthData.bulan,
                kompos_salman : kompos_salman,
                kompos_pihak_ketiga : 0,
                total_kompos : 0,
                persentase_kompos : 0,
                persentase_kompos_pihak_ketiga : 0,
                persentase_kompos_salman : 0,
                daur_ulang_salman : daur_ulang_salman,
                daur_ulang_pihak_ketiga : 0,
                total_daur_ulang_sampah : 0,
                persentase_daur_ulang_sampah : 0,
                persentase_daur_ulang_sampah_pihak_ketiga : 0,
                persentase_daur_ulang_sampah_salman : 0,
                total_residu : 0,
                persentase_residu : 0,
                total : 0
            });
        }
        for(let i=0; i<residuGroupGroupedByMonthList.length; i++) {
            const monthData = residuGroupGroupedByMonthList[i] as any;
            const kompos_pihak_ketiga = monthData.sampah_kebun + monthData.sampah_makanan 
            const daur_ulang_pihak_ketiga = monthData.kaca + monthData.logam + monthData.plastik_PET + monthData.kresek + monthData.multilayer_plastic + monthData.plastik_lain;
            const total_residu = monthData.residu;

            for(let j=0; j<data.length; j++) {
                if(data[j].bulan === monthData.bulan) {
                    data[j].kompos_pihak_ketiga = kompos_pihak_ketiga;
                    data[j].daur_ulang_pihak_ketiga = daur_ulang_pihak_ketiga;
                    data[j].total_residu = total_residu;
                    data[j].total_kompos = data[j].kompos_salman + data[j].kompos_pihak_ketiga;
                    data[j].total_daur_ulang_sampah = data[j].daur_ulang_salman + data[j].daur_ulang_pihak_ketiga;
                    data[j].total = data[j].total_kompos + data[j].total_daur_ulang_sampah + data[j].total_residu;
                    data[j].persentase_kompos = (data[j].total_kompos / data[j].total) * 100;
                    data[j].persentase_kompos_pihak_ketiga = (data[j].kompos_pihak_ketiga / data[j].total) * 100;
                    data[j].persentase_kompos_salman = (data[j].kompos_salman / data[j].total) * 100;
                    data[j].persentase_daur_ulang_sampah = (data[j].total_daur_ulang_sampah / data[j].total) * 100;
                    data[j].persentase_daur_ulang_sampah_pihak_ketiga = (data[j].daur_ulang_pihak_ketiga / data[j].total) * 100;
                    data[j].persentase_daur_ulang_sampah_salman = (data[j].daur_ulang_salman / data[j].total) * 100;
                    data[j].persentase_residu = (data[j].total_residu / data[j].total) * 100;
                    break;
                }
            }
        }

        data.sort((a, b) => new Date(`1 ${a.bulan}`).getTime() - new Date(`1 ${b.bulan}`).getTime());

        return res.status(200).json({
            status: true,
            message: "Success",
            data : data
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "error" });
    }
};
