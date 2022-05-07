import { Server as NetServer } from "http";

import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/common/types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.debug("Socket.io server is already running...");
  } else {
    console.debug("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as NetServer & { io: ServerIO };
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

    // functions
    io.on("connection", (socket) => {
      console.info(`Client connected... socket.id=${socket.id}`);
    });
  }
  res.end();
};

export default handler;
