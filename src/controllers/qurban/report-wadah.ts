import { Request, Response } from "express"
import prisma from "../../data-access/db.server"


export const getReportWadahKolaborator = async (req:Request,res:Response)=>{
    try {
        const statusFilter = req.query.status as string | undefined;
        if(statusFilter == "real" || statusFilter == "REAL"){
            const wadahKolaborator = await prisma.qurban.groupBy({
                by: ['email'],
                _sum: {
                    ukuran_12: true,
                    ukuran_14: true,
                    ukuran_16: true,
                    ukuran_18: true,
                    ukuran_20: true,
                    tidak_ukuran_panjang: true,
                    rusak_panjang: true,
                    hanya_wadah_panjang: true,
                    hanya_tutup_panjang: true,
                    ukuran_650: true,
                    ukuran_700: true,
                    ukuran_750: true,
                    ukuran_800: true,
                    ukuran_900: true,   
                    ukuran_1000: true,
                    ukuran_1500: true,
                    ukuran_2000: true,
                    ukuran_3000: true,
                    tidak_ukuran_ml: true,
                    rusak_ml: true,
                    hanya_wadah_ml: true,
                    hanya_tutup_ml: true,
                },
                where: {
                    OR:[{
                        status:"VERIFIED"
                    },{
                        status:"REVISION"
                    }]
                }
            })
            const kolaboratorQurban = await prisma.kolaboratorQurban.findMany()
            return res.status(200).json({status:true,message:"Success",dataWadah:wadahKolaborator,kolaboratorQurban:kolaboratorQurban})
        }
        
        const wadahKolaborator = await prisma.qurban.groupBy({
            by: ['email'],
            _sum: {
                ukuran_12: true,
                ukuran_14: true,
                ukuran_16: true,
                ukuran_18: true,
                ukuran_20: true,
                tidak_ukuran_panjang: true,
                rusak_panjang: true,
                hanya_wadah_panjang: true,
                hanya_tutup_panjang: true,
                ukuran_650: true,
                ukuran_700: true,
                ukuran_750: true,
                ukuran_800: true,
                ukuran_900: true,   
                ukuran_1000: true,
                ukuran_1500: true,
                ukuran_2000: true,
                ukuran_3000: true,
                tidak_ukuran_ml: true,
                rusak_ml: true,
                hanya_wadah_ml: true,
                hanya_tutup_ml: true,
            }
        })
        const kolaboratorQurban = await prisma.kolaboratorQurban.findMany()
        return res.status(200).json({status:true,message:"Success",dataWadah:wadahKolaborator,kolaboratorQurban:kolaboratorQurban})
    } catch (e) {
        return res.status(400).json({status:false,message:"Error"})
    }
}