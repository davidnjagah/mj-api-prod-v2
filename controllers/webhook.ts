import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
import "dotenv/config";

function addOneMonth(date: Date) {
    // Get the current day (of the month)
    const currentDay = date.getDate();

    // Add one month
    date.setMonth(date.getMonth() + 1);

    // Check if the day has changed (month overflow case)
    // If so, set the date to the last day of the previous month
    if (date.getDate() !== currentDay) {
        date.setDate(0);
    }
}

export const paystackWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const prisma = new PrismaClient()
    const secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_a08750855551bcd0a4958314a950ee5989548f97";

    const hash = createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-paystack-signature']) {

    const event = req.body;
    console.log("This is the req.body", event);

    const date = new Date(event.data.created_at);

    const amount = event.data.amount.toString();
    
    addOneMonth(date);

   

    const paystackSubscription = await prisma.paystackSubscription.findUnique({ 
        where: {
            userEmail: event.data.customer.email,
        }
    }); 
    
    res.json({status: 200});

    console.log("This is paystackSubscription",paystackSubscription);
            
    if (event.event === "charge.success") {
            if (paystackSubscription) {
                await prisma.paystackSubscription.update({
                    where: {
                        userEmail: event.data.customer.email,
                    },
                    data: {
                        paystackAmountPaid: amount,
                        paystackCurrentPeriodEnd: date,
                        plan_code: event.data.plan.plan_code,
                    },
                });
            }
            else {
                await prisma.paystackSubscription.create({
                    data: {
                        userEmail: event.data.customer.email,
                        paystackCustomerId: event.data.customer.customer_code as string,
                        paystackAmountPaid: amount,
                        paystackCurrentPeriodEnd: date,
                        plan_code: event.data.plan.plan_code,
                    },
                });
            };
        };
    
    };
    
}