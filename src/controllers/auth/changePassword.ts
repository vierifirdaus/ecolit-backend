import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import bcryptjs from "bcryptjs";
import { logActivity } from "../../utils/logActivity";


export const changePassword = async (req:Request, res:Response) => {
    const { oldPassword, newPassword, confNewPassword } = req.body;
    if(!oldPassword || !newPassword || !confNewPassword) {
        logActivity(new Date(), req.cookies.token, "Change Password","User", "All field required", "400", false)
        return res.status(400).json({status:false,message: "All field required"})
    }
    if (newPassword !== confNewPassword) {
        logActivity(new Date(), req.cookies.token, "Change Password","User", "New password and confirm new password not match", "400", false)
        return res.status(400).json({ status: false, message: "New password and confirm new password not match" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.cookies.token as string
            }
        });
        if(!user) {
            logActivity(new Date(), req.cookies.token, "Change Password","User", "User not found", "400", false)
            return res.status(400).json({status:false,message: "User not found"})
        }
        const validPassword = await bcryptjs.compare(oldPassword, user.password);
        if (!validPassword) {
            logActivity(new Date(), req.cookies.token, "Change Password","User", "Invalid password", "400", false)
            return res.status(400).json({ status: false, message: "Invalid password" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        const updateUser = await prisma.user.update({
            where: {
                id: req.cookies.token as string
            },
            data: {
                password: hashedPassword
            }
        })
        logActivity(new Date(), req.cookies.token, "Change Password","User", "", "200", true)
        return res.status(200).json({ status: true, message: "Success", data: updateUser });
    } catch (error) {
        console.log(error)
        logActivity(new Date(), req.cookies.token, "Change Password","User", "Internal Error", "400", false)
        return res.status(400).json({ status: false, message: "Error" });
    }
}