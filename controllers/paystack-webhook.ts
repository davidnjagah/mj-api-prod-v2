import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Handle paystack payment confirmation
// POST : api/webhook
// PROTECTED //Whitelisting.
import * as dotenv from 'dotenv';
dotenv.config();

export const paystackWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        const PLATFORM_URL = process.env.PLATFORM_URL as string;
        console.log("This is the request", req);
        const event = req.body;

        const response = await axios.post(PLATFORM_URL+"/api/webhook", event);

        res.json({status: 200});
}

//data: {message: "Webhook success", response: response.data }}