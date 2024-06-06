import { Request, Response } from "express";
import prisma from "../../data-access/db.server";

interface PemilihanSampahMandiri {
    bulan : string,
    label_hijau : number,
    label_kuning : number,
    label_biru : number,
    label_merah : number,
    label_hitam : number,
    kompos_persentase : number,
    daur_ulang_persentase : number,
    residu_persentase : number,
    total : number
}

export const getTotalPemilihanMandiri = async (req: Request, res: Response) => {
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


        const mandiriGroupedByMonthList = Object.entries(sampahGroupGroupedByMonth).map(([month, values]) => ({ month, ...(values as object) }));

        let data: PemilihanSampahMandiri[] = [];
        for (let i = 0; i < mandiriGroupedByMonthList.length; i++) {

            const monthData = mandiriGroupedByMonthList[i] as any;
            const total = monthData.kaca + monthData.kertas + monthData.plastik + monthData.organik_sisa + monthData.organik_kebun + monthData.residu;
            data.push({
                bulan : monthData.bulan,
                label_hijau : monthData.organik_sisa + monthData.organik_kebun,
                label_kuning : monthData.kaca,
                label_biru : monthData.kertas,
                label_merah : monthData.plastik,
                label_hitam : monthData.residu,
                kompos_persentase : parseFloat(((monthData.organik_sisa + monthData.organik_kebun) / total * 100).toFixed(2)),
                daur_ulang_persentase : parseFloat(((monthData.kaca + monthData.kertas + monthData.plastik) / total * 100).toFixed(2)),
                residu_persentase : parseFloat((monthData.residu / total * 100).toFixed(2)),
                total : total
            });
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
