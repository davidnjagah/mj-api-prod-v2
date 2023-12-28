import { Request, Response, NextFunction } from 'express';

// Handle image request
// POST : api/fetchimages
// PROTECTED
import "dotenv/config";
import { IFSBot, Midjourney, IFS } from "../src";

interface IncomingRequest {
 rid: string,
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

async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const handleDeleteId = async (
  req: Request<{}, {}, IncomingRequest>, 
  res: Response,
  next: NextFunction
) => {

    const { rid } = req.body;

    const clientIFS = createIFSClient();
     
    try {
        await timeout(500);
        await clientIFS.delId(rid)
        .then(async ()=>{
          clientIFS.Close();
          await timeout(500);
          res.json({status: 200})
        })

     } catch (error) {
      console.error("An error occurred:", error);
    }

};
