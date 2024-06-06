import { Request, Response } from "express"
import bcryptjs from "bcryptjs";
import prisma from "../../data-access/db.server";
import { faker } from '@faker-js/faker';

export const register = async (req:Request, res:Response) => {
    const { email,name,phoneNumber,role,job,password } = req.body ;
    if(!email || !name  || !phoneNumber || !job || !password) {
        return res.status(400).json({status:false,message: "Email, name, phoneNumber, job and password required"})
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
    
        if(user) {
            return res.status(400).json({status:false,message: "User already exist"})
        }
        // using bcrypt
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const createdUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                phoneNumber: phoneNumber,
                job: job,
                role: role?role:"PEGAWAI",
                password: hashedPassword,
            }
        })



        return res.status(200).json({status:true,message: "User created successfully",data:createdUser})
    } catch (error) {
        return res.status(400).json({status:false,message: "Error"})
    }
}