import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export const authenticationPegawai = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({status:false,message:"Unauthorized"})
    
    jwt.verify(
        token, 
        process.env.SECRET_TOKEN as string, 
        (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log(user)
            if(user.role != 'PEGAWAI' && user.role != 'ADMIN'){
                return res.status(403).json({status:false,message:"Forbidden"})
            }
            req.cookies.token = user.id
            next();
        }
    );
} 

export const authenticationAdmin = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({status:false,message:"Unauthorized"})
    
    jwt.verify(
        token, 
        process.env.SECRET_TOKEN as string , 
        (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            if(user.role !== "ADMIN"){
                return res.status(403).json({status:false,message:"Forbidden"})
            }
            req.cookies.token = user.id
            console.log(user)
            next();
        
        }
    );
}

