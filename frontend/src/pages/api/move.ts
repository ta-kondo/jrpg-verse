import { NextApiRequest } from "next";

import { IData } from "@/common/types/messagedata";
import { NextApiResponseServerIO } from "@/common/types/next";

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // const body = JSON.parse(req.body as string) as IData;
    const body = req.body as IData;
    res?.socket?.server?.io?.emit("updated", body);
    console.debug(Date.now());
    // return all user data
    res.status(201).end();
  }
};
export default handler;
