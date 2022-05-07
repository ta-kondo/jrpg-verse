import { NextApiRequest } from "next";

import { IData } from "@/common/types/messagedata";
import { NextApiResponseServerIO } from "@/common/types/next";

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    const body = req.body as IData;
    res?.socket?.server?.io?.emit("updated", body);
    res.status(201).end();
  }
};
export default handler;
