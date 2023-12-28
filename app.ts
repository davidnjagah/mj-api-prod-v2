import * as express from 'express';
import * as cors from 'cors';
import authMiddleware from './middleware/authMiddleware';
import { handleImageGen } from './controllers/processImageController';
import { paystackWebhook } from './controllers/paystack-webhook';
import { check } from './controllers/check';
import { uploadImage } from './controllers/uploadController';
import { handleDeleteId } from './controllers/deleteIdController';

import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use('/api/fetchimages', authMiddleware, handleImageGen);
app.use('/api/uploadimage', uploadImage);
app.use('/api/deleteid', handleDeleteId);
app.use('/api/webhook', paystackWebhook);
app.use('/api/checkroute', check)

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on port 5000"));

export default app;
