import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import io from "socket.io-client";

const TerminalApp = () => {
  const terminalRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const termRef = useRef<any>(null);

  useEffect(() => {
    // Terminalni boshlash
    termRef.current = new Terminal({
      cursorBlink: true,

      theme: { background: "#000765", foreground: "#fff" },
      disableStdin: false // Inputni faollashtirish
    });

    const fitAddon = new FitAddon();
    termRef.current.loadAddon(fitAddon);
    termRef.current.open(terminalRef.current);
    fitAddon.fit();

    // Terminalga fokus qo'yish
    termRef.current.focus();

    termRef.current.write("Terminal ochildi! Serverga ulanmoqda...\r\n");

    // Socket.IO ulanishini boshlash
    socketRef.current = io(`${import.meta.env.VITE_BASE_URL}/terminal`, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token")
      }
    });

    // socketRef.current = io("", {
    //   transports: ["websocket"],
    //   auth: {
    //     token:
    //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTFkYWJmNmEtZmM1My00OWY3LTgwYjUtY2NlNTg4MWI4NDQwIiwicm9sZSI6InN1cGVyYWRtaW4iLCJyb2xlX2lkIjoxLCJpYXQiOjE3NDI4NzY5MTQsImV4cCI6MTc0Mjk2MzMxNH0.iDYcjE1N7E6k1Ku2cYlY39no6g5eomY6fCGTKwzJkfw"
    //   }
    // });

    let rawInputMode = false;
    let inputBuffer = "";

    // Socket eventlari
    socketRef.current.on("connect", () => {
      termRef.current.write("\r\nHolat: Serverga ulandi!");
      socketRef.current.emit("command", { command: "init" });
      termRef.current.focus(); // Ulangandan keyin fokusni qaytarish
    });

    socketRef.current.on("disconnect", () => {
      termRef.current.write("\r\nHolat: Serverdan uzildi! Qayta ulanmoqda...");
      setTimeout(() => {
        if (!socketRef.current.connected) socketRef.current.connect();
      }, 1000);
    });

    socketRef.current.on("data", ({ sessionId, output }: any) => {
      termRef.current.write(output);
      termRef.current.focus(); // Ma'lumot kelganda fokusni saqlash
    });

    socketRef.current.on("command_response", ({ data }: any) => {
      if (data?.result.startsWith("CLIENT_ID:")) {
        const clientId = data.result.split(":")[1];
        rawInputMode = true;
        termRef.current.write("\r\nRaw input rejimi yoqildi");
      } else {
        termRef.current.write(data.result);
      }
      termRef.current.focus(); // Javob kelganda fokusni saqlash
    });

    socketRef.current.on("error", (err: any) => {
      termRef.current.write("\r\nServer xatosi: " + err);
    });

    socketRef.current.on("connect_error", (err: any) => {
      termRef.current.write("\r\nUlanish xatosi: " + err.message);
    });

    // Terminal input handler
    termRef.current.onData((data: any) => {
      if (rawInputMode) {
        socketRef.current.emit("command", { command: data });
        termRef.current.write(data);
      } else {
        if (data === "\r") {
          if (socketRef.current && socketRef.current.connected) {
            if (inputBuffer.trim()) {
              socketRef.current.emit("command", { command: inputBuffer });
              inputBuffer = "";
            }
            termRef.current.write("\r\n");
          } else {
            termRef.current.write("\r\nXato: Serverga ulanib bo‘lmadi!");
            inputBuffer = "";
          }
        } else if (data === "\u007F" || data === "\b") {
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            termRef.current.write("\b \b");
          }
        } else {
          inputBuffer += data;
          termRef.current.write(data);
        }
      }
    });

    terminalRef.current.addEventListener("click", () => {
      termRef.current.focus();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (termRef.current) termRef.current.dispose();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div
        ref={terminalRef}
        style={{
          width: "100%",
          height: "100vh",
          background: "#000"
        }}
      />
    </div>
  );
};

export default TerminalApp;
