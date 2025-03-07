import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";
import { SocketService } from "~/types/configs/SockedServis";

interface TerminalProps {
  autoSsh?: boolean;
}

const TerminalComponent = ({ autoSsh = false }: TerminalProps) => {
  const token = localStorage.getItem("token");
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const history = useRef<string[]>([]);
  const curDirPath = useRef<string[]>([]);
  const curChildren = useRef<TerminalData[]>(terminal);
  const socketService = useRef<SocketService | null>(null);
  const commandBuffer = useRef<string>("");

  const getCurDirName = () =>
    curDirPath.current.length === 0 ? "~" : curDirPath.current.slice(-1)[0];

  const getCurChildren = () =>
    curDirPath.current.reduce(
      (acc, name) =>
        acc.find((item: TerminalData) => item.title === name && item.type === "folder")
          ?.children || acc,
      terminal
    );

  const clear = () => {
    xtermRef.current?.clear();
    commandBuffer.current = "";
    prompt();
  };

  const prompt = () => {
    xtermRef.current?.write(`\r\n${getCurDirName()}  `);
  };

  // Joriy qatorni qayta yozish funksiyasi (backspace uchun)
  const rewriteLine = () => {
    // Avvalgi qatorni tozalash uchun kursor boshiga qaytib, bo‘shliqlar yozamiz
    xtermRef.current?.write(
      `\r${" ".repeat(getCurDirName().length + 3 + commandBuffer.current.length)}`
    );
    // Kursor boshiga qaytish
    xtermRef.current?.write(`\r${getCurDirName()} > ${commandBuffer.current}`);
  };

  const cd = (args?: string) => {
    if (!args || args === "~") {
      curDirPath.current = [];
      curChildren.current = terminal;
    } else if (args === ".." && curDirPath.current.length) {
      curDirPath.current.pop();
      curChildren.current = getCurChildren();
    } else {
      const target = curChildren.current.find(
        (item: TerminalData) => item.title === args && item.type === "folder"
      );
      if (target) {
        curDirPath.current.push(args);
        curChildren.current = target.children || [];
      } else {
        xtermRef.current?.write(`cd: ${args}: No such directory\r\n`);
      }
    }
    prompt();
  };

  const ls = () => {
    const output = curChildren.current
      .map((item) => (item.type === "file" ? item.title : `${item.title}/`))
      .join("  ");
    xtermRef.current?.write(`${output}\r\n`);
    prompt();
  };

  const cat = (args?: string) => {
    const file = curChildren.current.find(
      (item: TerminalData) => item.title === args && item.type === "file"
    );
    if (file) {
      xtermRef.current?.write(`${file.title} content (simulated)\r\n`);
    } else {
      xtermRef.current?.write(`cat: ${args}: No such file\r\n`);
    }
    prompt();
  };

  const help = () => {
    const helpText = [
      "cat <file> - Fayl mazmunini ko‘rish",
      "cd <dir> - Katalogni o‘zgartirish",
      "ls - Joriy katalogdagi fayllarni ko‘rish",
      "clear - Terminalni tozalash",
      "help - Yordam",
      "ssh - SSH orqali ulanish"
    ].join("\r\n");
    xtermRef.current?.write(`${helpText}\r\n`);
    prompt();
  };

  const ssh = (args?: string) => {
    if (!token) {
      xtermRef.current?.write("❌ Error: Token topilmadi!\r\n");
      prompt();
      return;
    }

    if (!socketService.current) {
      socketService.current = new SocketService(token);
      socketService.current.onMessage((data) => {
        const { success, result } = data.data || data;
        xtermRef.current?.write(
          `${success ? ` ${result || "Command executed"}` : `❌ Xato: ${result}`}\r\n`
        );
        prompt();
      });
      socketService.current.onProgress((progressData) => {
        xtermRef.current?.write(`Progress: ${progressData}%\r\n`);
      });
      socketService.current.onCommandResponse((data) => {
        const { success, result } = data.data || data;
        xtermRef.current?.write(
          `${success ? ` ${result || "Command executed"}` : `❌ Xato: ${result}`}\r`
        );
        prompt();
      });
    }

    const sshCommand = args || "ssh root@209.38.250.43";
    xtermRef.current?.write(`${sshCommand}\r\n`);
    socketService.current.sendCommand(sshCommand);
  };

  const commands: Record<string, (arg?: string) => void> = {
    cd,
    ls,
    cat,
    clear,
    help,
    ssh
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
      theme: {
        background: "#f2f6fd",
        foreground: "#000000",
        cursor: "#000"
      }
    });
    xtermRef.current = term;

    term.open(terminalRef.current);

    term.write("Hey, you found the terminal! Type `help` to get started.\r\n");
    prompt();

    if (autoSsh) {
      ssh("ssh root@209.38.250.43");
    }

    term.onData((data) => {
      if (data === "\r") {
        // Enter
        const input = commandBuffer.current.trim();
        history.current.push(input);
        term.write("\r\n");

        if (input) {
          const [cmd, ...args] = input.split(" ");
          if (commands[cmd]) {
            commands[cmd](args.join(" "));
          } else {
            term.write(`zsh: command not found: ${cmd}\r\n`);
            prompt();
          }
        } else {
          prompt();
        }
        commandBuffer.current = "";
      } else if (data === "\u007F") {
        // Backspace
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1);
          rewriteLine(); // Joriy qatorni qayta yozish
        }
      } else {
        // Har qanday belgi
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
  }, [autoSsh]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#f2f6fd",
        padding: "10px",
        borderRadius: "5px"
      }}
    />
  );
};

export default TerminalComponent;
