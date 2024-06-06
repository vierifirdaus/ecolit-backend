import { Request, Response } from "express";
import { sheetsService } from "../../utils/qurbanSetup";
import prisma from "../../data-access/db.server";

export const getXlsx = async (req: Request, res: Response) => {
    try {
        const result = await sheetsService.spreadsheets.values.get({
            spreadsheetId: '1dV3PPumf5Av_0IVjGfB8fWCK5l45aSfEdyoHVL5ZPSA',
            range: 'Qurban!A:AC' // Assuming 'Qurban' is the name of your tab
        });
        const numRows = result.data.values ? result.data.values.length : 0;
        console.log(`${numRows} rows retrieved.`);
        res.json(result.data);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Error retrieving data" });
    }
}

export const syncXlsx = async(req: Request, res: Response) => {
    try {
        const result = await sheetsService.spreadsheets.values.get({
            spreadsheetId: '1dV3PPumf5Av_0IVjGfB8fWCK5l45aSfEdyoHVL5ZPSA',
            range: 'Qurban!A:AC' // Assuming 'Qurban' is the name of your tab
        });
        if(!result.data.values){
            return res.status(400).json({error: "No data found"})
        }
        const numRows = result.data.values ? result.data.values.length : 0;
        for(let i=1 ;i<numRows;i++){
            console.log(result.data.values[i])
            const checkQurban = await prisma.qurban.findFirst({
                where:{
                    date : new Date(result.data.values[i][0] as string) 
                }
            })
            if(checkQurban){
                const updateQurban = await prisma.qurban.update({
                    where:{
                        id : checkQurban.id
                    },
                    data:{
                        email : result.data.values[i][1] as string,
                        date: new Date(result.data.values[i][0] as string),
                        tanggal_report : new Date(result.data.values[i][3] as string) ,
                        ukuran_12 : parseInt(result.data.values[i][4] as string),
                        ukuran_14 : parseInt(result.data.values[i][5] as string),
                        ukuran_16 : parseInt(result.data.values[i][6] as string),
                        ukuran_18 : parseInt(result.data.values[i][7] as string),
                        ukuran_20 : parseInt(result.data.values[i][8] as string),
                        tidak_ukuran_panjang : parseInt(result.data.values[i][9] as string),
                        rusak_panjang : parseInt(result.data.values[i][10] as string),
                        hanya_wadah_panjang : parseInt(result.data.values[i][11] as string),
                        hanya_tutup_panjang : parseInt(result.data.values[i][12] as string),
                        ukuran_650 : parseInt(result.data.values[i][13] as string),
                        ukuran_700 : parseInt(result.data.values[i][14] as string),
                        ukuran_750 : parseInt(result.data.values[i][15] as string),
                        ukuran_800 : parseInt(result.data.values[i][16] as string),
                        ukuran_900 : parseInt(result.data.values[i][17] as string),
                        ukuran_1000 : parseInt(result.data.values[i][18] as string),
                        ukuran_1500 : parseInt(result.data.values[i][19] as string),
                        ukuran_2000 : parseInt(result.data.values[i][20] as string),
                        ukuran_3000 : parseInt(result.data.values[i][21] as string),
                        tidak_ukuran_ml : parseInt(result.data.values[i][22] as string),
                        rusak_ml : parseInt(result.data.values[i][23] as string),
                        hanya_wadah_ml : parseInt(result.data.values[i][24] as string),
                        hanya_tutup_ml : parseInt(result.data.values[i][25] as string),
                        dokumentasi : result.data.values[i][26] as string,
                        keterangan : result.data.values[i][27] as string,
                        keterangan_tambahan : result.data.values[i][28] as string,
                    }
                })
                continue;
            }
            const addQurban = await prisma.qurban.create({
                data:{
                    email : result.data.values[i][1] as string,
                    date: new Date(result.data.values[i][0] as string),
                    tanggal_report : new Date(result.data.values[i][3] as string) ,
                    ukuran_12 : parseInt(result.data.values[i][4] as string),
                    ukuran_14 : parseInt(result.data.values[i][5] as string),
                    ukuran_16 : parseInt(result.data.values[i][6] as string),
                    ukuran_18 : parseInt(result.data.values[i][7] as string),
                    ukuran_20 : parseInt(result.data.values[i][8] as string),
                    tidak_ukuran_panjang : parseInt(result.data.values[i][9] as string),
                    rusak_panjang : parseInt(result.data.values[i][10] as string),
                    hanya_wadah_panjang : parseInt(result.data.values[i][11] as string),
                    hanya_tutup_panjang : parseInt(result.data.values[i][12] as string),
                    ukuran_650 : parseInt(result.data.values[i][13] as string),
                    ukuran_700 : parseInt(result.data.values[i][14] as string),
                    ukuran_750 : parseInt(result.data.values[i][15] as string),
                    ukuran_800 : parseInt(result.data.values[i][16] as string),
                    ukuran_900 : parseInt(result.data.values[i][17] as string),
                    ukuran_1000 : parseInt(result.data.values[i][18] as string),
                    ukuran_1500 : parseInt(result.data.values[i][19] as string),
                    ukuran_2000 : parseInt(result.data.values[i][20] as string),
                    ukuran_3000 : parseInt(result.data.values[i][21] as string),
                    tidak_ukuran_ml : parseInt(result.data.values[i][22] as string),
                    rusak_ml : parseInt(result.data.values[i][23] as string),
                    hanya_wadah_ml : parseInt(result.data.values[i][24] as string),
                    hanya_tutup_ml : parseInt(result.data.values[i][25] as string),
                    dokumentasi : result.data.values[i][26] as string,
                    keterangan : result.data.values[i][27] as string,
                    keterangan_tambahan : result.data.values[i][28] as string,
                }
            })

        }
        console.log(`${numRows} rows retrieved.`);
        res.json(result.data);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Error retrieving data" });
    }
}