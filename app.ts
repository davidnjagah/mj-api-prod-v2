import * as express from 'express';
import * as cors from 'cors';
import authMiddleware from './middleware/authMiddleware';
import { handleImageGen } from './controllers/processImageController';
import { check } from './controllers/check';
import { uploadImage } from './controllers/uploadController';
import { handleDeleteId } from './controllers/deleteIdController';

import { notFound, errorHandler } from './middleware/errorMiddleware';
import * as dotenv from 'dotenv';
import { paystackWebhook } from './controllers/webhook';
import { replicateResend } from './controllers/replicateController';
dotenv.config();

const app = express();
const PLATFORM_URL = process.env.PLATFORM_URL as string;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: PLATFORM_URL }));

app.use('/api/fetchimages', authMiddleware, handleImageGen);
app.use('/api/uploadimage', authMiddleware, uploadImage);
app.use('/api/deleteid', authMiddleware, handleDeleteId);
app.use('/api/checkroute', check);
app.use('/api/replicate', authMiddleware, replicateResend);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on port 5000"));

export default app;
