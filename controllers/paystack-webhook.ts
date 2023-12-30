import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';

// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
import * as dotenv from 'dotenv';
import prismadb from '../lib/prismadb';
dotenv.config();

// Function to add one month
function addOneMonth(date) {
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
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_6bf6a79ade9c61f593f596397e9a51ff218d7588';

    const hash = createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body

    const event = req.body;
    console.log("This is the req.body", event);

    const date = new Date(event.data.paid_at);

    const amount = event.data.amount.toString();

    console.log(amount);
    
    addOneMonth(date);

    console.log("Next Pay:", date);

    const paystackSubscription = await prismadb.paystackSubscription.findUnique({ 
        where: {
            userEmail: event.data.customer.email
        }
    });
            
    if (event.event === "charge.success") {
        if (paystackSubscription && paystackSubscription.paystackCustomerId) {
                await prismadb.paystackSubscription.update({
                    where: {
                        userEmail: event.data.customer.email,
                    },
                    data: {
                        paystackAmountPaid: amount,
                        paystackCurrentPeriodEnd: date,
                    },
                });
            }
            else {
                await prismadb.paystackSubscription.create({
                    data: {
                        userEmail: event.data.customer.email,
                        paystackCustomerId: event.data.customer.customer_code as string,
                        paystackAmountPaid: amount,
                        paystackCurrentPeriodEnd: date,
                    },
                });
            };
        };
        
    res.json({status: 200});
    }
}