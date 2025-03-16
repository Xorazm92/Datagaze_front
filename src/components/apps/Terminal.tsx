import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { SocketService } from "~/types/configs/SockedServis";

const TerminalComponent = () => {
  const token = localStorage.getItem("token");
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketService = useRef<SocketService | null>(null);
  const commandBuffer = useRef<string>("");

  const prompt = () => {
    // Haqiqiy terminalga o'xshash prompt
    xtermRef.current?.write("\r\nroot@server:~$ ");
  };

  const rewriteLine = () => {
    const promptLength = "root@server:~$ ".length;
    xtermRef.current?.write(
      `\r${" ".repeat(promptLength + commandBuffer.current.length)}`
    );
    xtermRef.current?.write(`\rroot@server:~$ ${commandBuffer.current}`);
  };

  useEffect(() => {
    if (!terminalRef.current) {
      console.error("Terminal konteyneri topilmadi");
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      rows: 40,
      cols: 100,
      fontFamily: "Courier New, monospace", // Monospace shrift
      fontSize: 14,
      theme: {
        background: "#1a1a1a", // Qora fon (klassik terminal rangi)
        foreground: "#00ff00", // Yashil matn
        cursor: "#00ff00", // Yashil kursor
        selectionBackground: "#ffffff33" // Tanlangan qism rangi
      }
    });
    xtermRef.current = term;

    term.open(terminalRef.current);
    term.write("Connecting to server...\r\n");

    if (!token) {
      term.write("❌ Error: Token topilmadi!\r\n");
      prompt();
      return;
    }

    socketService.current = new SocketService(token);

    // Progressni ko'rsatish
    socketService.current.onProgress((progressData) => {
      if (progressData === "50") {
        term.write("\x1b[33mUlanmoqda... 50%\x1b[0m\r\n"); // Sariq rang
      } else if (progressData === "70") {
        term.write("\x1b[33mSSH ulanish boshlandi... 70%\x1b[0m\r\n"); // Sariq rang
      } else if (progressData === "100") {
        term.write("\x1b[32mUlandi! Terminal tayyor.\x1b[0m\r\n"); // Yashil rang
        prompt();
      } else {
        term.write(`${progressData}\r\n`);
      }
    });

    // Serverdan kelgan javoblarni ko'rsatish
    socketService.current.onMessage((data) => {
      const { success, result } = data.data || data;
      term.write(
        `${success ? ` ${result || ""}` : `\x1b[31m❌ Error: ${result}\x1b[0m`}`
      );
    });
    socketService.current.onCommandResponse((data) => {
      const { success, result } = data.data || data;
      term.write(
        `${success ? ` ${result || ""}` : `\x1b[31m❌ Error: ${result}\x1b[0m`}`
      );
      prompt();
    });

    // Foydalanuvchi kiritgan buyruqlarni serverga yuborish
    term.onData((data) => {
      if (data === "\r") {
        const input = commandBuffer.current.trim();
        term.write("\r\n");
        if (input) {
          socketService.current?.sendCommand(input);
        } else {
          prompt();
        }
        commandBuffer.current = "";
      } else if (data === "\u007F") {
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1);
          rewriteLine();
        }
      } else {
        commandBuffer.current += data;
        term.write(data);
      }
    });

    return () => {
      term.dispose();
      if (socketService.current) {
        socketService.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#1a1a1a", // Qora fon
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Soya effekti
        border: "1px solid #333" // Chegara
      }}
    />
  );
};

export default TerminalComponent;
