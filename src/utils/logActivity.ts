import prisma from "../data-access/db.server";
import jwt from "jsonwebtoken";

export const logActivity = async (date: Date, name: string, activity: string, table: string, error: string, status: string, success: boolean) => {
    console.log(name);
    
    try {
        
        const user = await prisma.user.findUnique({
            where: {
                id: name as string,
            },
            select: {
                name: true,
            },
        });

        if (!user) {
            console.error('User not found');
            return;
        }

        await prisma.logActivity.create({
            data: {
                date: date,
                name: user.name ?? 'Unknown',  
                activity: activity,
                table: table,
                error: error,
                status: status,
                success: success,
            },
        });
    } catch (err) {
        console.error('Error verifying token or logging activity:', err);
    }
};
