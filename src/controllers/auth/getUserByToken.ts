import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import prisma from '../../data-access/db.server';

export const readByToken = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error("Authorization header is missing");
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    console.log("Received token: ", token);

    if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    try {
        if(!token){
            return res.status(401).json({status:false,message:"Unauthorized"})
        }
        jwt.verify(
            token,
            process.env.SECRET_TOKEN as string,
            async (err: any, user: any) => {
                if (err) {
                    return res.status(403).json({status:false,message:"Forbidden"});
                }
                console.log(user);
                const userDetail = await prisma.user.findUnique({
                    where: {
                        id: user.id,
                    },
                });
                return res.status(200).json({ status: true, message: "Success", data: userDetail });
            }
        )
    } catch (err) {
        console.error("Error verifying token: ", err);

        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ status: false, message: "Invalid token" });
        }
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};
