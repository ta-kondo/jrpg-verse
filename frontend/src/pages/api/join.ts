import { NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";

import { IData } from "@/common/types/messagedata";
import { NextApiResponseServerIO } from "@/common/types/next";

const joined_users: Array<IData> = [];

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "GET") {
    const { username } = req.query;
    const data = {
      // generate id
      client_id: uuidv4().replaceAll("-", ""),
      name: username,
    } as IData;
    joined_users.push(data);

    res?.socket?.server?.io?.emit("joined", data);

    // return all user data
    res.status(201).json({ client_id: data.client_id, users: joined_users });
  }
};
export default handler;
