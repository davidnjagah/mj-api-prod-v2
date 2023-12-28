import { Request, Response, NextFunction } from 'express';
import HttpError from '../models/errorModel';

// Handle image request
// POST : api/upload
// PROTECTED
import "dotenv/config";
import { IFSBot, Midjourney, IFS } from "../src";

interface IncomingRequest {
    amount: string,
    url: string,
    prompt: string,
    resolution?: string,
}

   function createIFSClient() {
    // Configuration for the IFS client
    const clientIFS = new IFS({
        ServerId: <string>process.env.SERVER_ID,
        ChannelId: <string>process.env.CHANNEL_ID,
        SalaiToken: <string>process.env.SALAI_TOKEN,
        BotId: IFSBot, // IFSBot
        Debug: true,
    });
    return clientIFS;
  }

  async function saveImage(clientIFS, imageUrl) {
    await clientIFS.Connect();
    const saveid = await clientIFS.SaveId( imageUrl, (uri) => {
      console.log("loading123---", uri);
    })
    return saveid;
  }

  export const uploadImage = async (
    req: Request<{}, {}, IncomingRequest>, 
    res: Response,
    next: NextFunction
  ) => {

    const clientIFS = createIFSClient();

    console.log(req);
  
    const { url } = req.body;

    if (!url) {
      console.error("Url Void Error: There's no url in the request");
      return next(new HttpError("Please upload an image.", 403));
    }

    const saveid = await saveImage(clientIFS, url);

    clientIFS.Close();

    console.log(saveid)

    res.json(saveid)
  }