import React, { createContext, ReactNode, useContext } from "react";
import Cookie from "js-cookie";
import { io, Socket } from "socket.io-client";

type value = {};

const socketContext = createContext({} as value);

export function useSocket() {
  return useContext(socketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [token, setToken] = React.useState(Cookie.get("token"));

  React.useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
      }
      return;
    }

    const URL = import.meta.env.VITE_SOCKET_URL;

    const newSocket = io(URL, {
      auth: { token },
      autoConnect: false,
      transports: ["websocket"],
    });

    setSocket(newSocket);
    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("Połączono z serwerem Socket.io");
    });
  }, [token]);

  let value = {};
  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
}
