import { Request, Response } from "express";
import prisma from "../../data-access/db.server";


export const getCountWadah = async (req:Request,res:Response) => {
    try {
        const statusFilter = req.query.status as string | undefined;
        let countWadah = null;
        if(statusFilter == "real" || statusFilter == "REAL"){
            countWadah = await prisma.qurban.groupBy({
                by: ['email'],
                _count: {
                    email: true
                },
                where: {
                    OR:[{
                        status:"VERIFIED"
                    },{
                        status:"REVISION"
                    }]
                }
            })
        }
        else {
            countWadah = await prisma.qurban.groupBy({
                by: ['email'],
                _count: {
                    email: true
                }
            })
        }
        const kolaboratorQurban = await prisma.kolaboratorQurban.findMany()
        return res.status(200).json({status:true,message:"Success",dataWadah:countWadah,kolaboratorQurban:kolaboratorQurban})
    } catch (e) {
        return res.status(400).json({status:false,message:"Error"})
    }
}