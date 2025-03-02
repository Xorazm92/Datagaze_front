import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client"; // Socket.IO ishlatiladi
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";

interface TerminalProps {
  token?: string | null;
  autoSsh?: boolean;
}

const Terminal = ({ autoSsh = false }: TerminalProps) => {
  const token = localStorage.getItem("token");
  const [content, setContent] = useState<JSX.Element[]>([]);
  const history = useRef<string[]>([]);
  const curInputTimes = useRef(0);
  const curDirPath = useRef<string[]>([]);
  const curChildren = useRef<any>(terminal);
  const socket = useRef<Socket | null>(null);

  const reset = () => setContent([]);
  const addRow = (row: JSX.Element) => setContent((prev) => [...prev, row]);

  const getCurDirName = () =>
    curDirPath.current.length === 0 ? "~" : curDirPath.current.slice(-1)[0];

  const getCurChildren = () =>
    curDirPath.current.reduce(
      (acc, name) =>
        acc.find((item: TerminalData) => item.title === name && item.type === "folder")
          ?.children || acc,
      terminal
    );

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
        curDirPath.current.push(target.title);
        curChildren.current = target.children;
      } else {
        generateResultRow(`cd: no such file or directory: ${args}`);
      }
    }
  };

  const ls = () => {
    generateResultRow(
      <div className="grid grid-cols-4 w-full">
        {curChildren.current.map((item: TerminalData) => (
          <span
            key={item.id}
            className={item.type === "file" ? "text-black" : "text-purple-300"}
          >
            {item.title}
          </span>
        ))}
      </div>
    );
  };

  const cat = (args?: string) => {
    const file = curChildren.current.find(
      (item: TerminalData) => item.title === args && item.type === "file"
    );
    generateResultRow(file ? file.content : `cat: ${args}: No such file or directory`);
  };

  const clear = () => {
    curInputTimes.current++;
    reset();
  };

  const help = () => {
    generateResultRow(
      <ul className="list-disc ml-6 pb-1.5">
        {["cat <file>", "cd <dir>", "ls", "clear", "help", "ssh"].map((cmd, i) => (
          <li key={i} className="text-red-400">
            {cmd}
          </li>
        ))}
      </ul>
    );
  };

  const connectSocket = () => {
    if (!token) {
      generateResultRow("❌ Error: Token topilmadi!");
      return null;
    }

    if (socket.current?.connected) {
      console.log(socket.current);

      return socket.current;
    }

    socket.current = io(
      `wss://datagaze-platform-9cab2c02bc91.herokuapp.com/terminal?token=${token}`,
      {
        transports: ["websocket"]
      }
    );
    console.log(socket.current);

    socket.current.on("connect", () => {
      console.log("Socket.IO ulandi");
      generateResultRow("✅ Socket.IO serveriga ulandi");
    });

    socket.current.on("message", (data) => {
      const { success, result } = data.data || data;
      generateResultRow(success ? `🚀 ${result}` : `❌ Xato: ${result}`);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket.IO xatoligi:", error);
      generateResultRow(`❌ Ulanish xatosi: ${error.message}`);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket.IO yopildi");
      generateResultRow("🔌 Socket.IO ulanishi yopildi");
      socket.current = null;
    });

    return socket.current;
  };

  const ssh = (args?: string) => {
    if (!token) {
      generateResultRow("❌ Error: Token topilmadi!");
      return;
    }

    const sock = connectSocket();
    if (!sock) return;

    if (sock.connected) {
      sock.emit("command", args);
    } else {
      sock.on("connect", () => {
        sock.emit("command", args);
      });
    }
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
    const initializeTerminal = () => {
      reset();
      generateInputRow();

      if (autoSsh) {
        const sock = connectSocket();
        if (sock) {
          sock.on("connect", () => {
            sock.emit("command", { command: "ssh root@209.38.250.43" });
          });
        }
      }
    };

    initializeTerminal();

    return () => {
      if (socket.current?.connected) {
        socket.current.disconnect();
      }
    };
  }, [autoSsh]);

  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = e.currentTarget;
    if (e.key === "Enter") {
      history.current.push(inputElement.value);
      inputElement.setAttribute("readonly", "true");

      const [cmd, ...args] = inputElement.value.trim().split(" ");
      if (commands[cmd]) {
        commands[cmd](args.join(" "));
      } else {
        generateResultRow(<span>{`zsh: command not found: ${cmd}`}</span>);
      }

      curInputTimes.current++;
      generateInputRow();
    }
  };

  const generateInputRow = () => {
    addRow(
      <div key={curInputTimes.current} className="flex">
        <span className="text-black">
          solikhov <span className="text-green-300">{getCurDirName()}</span>{" "}
          <span className="text-red-400"></span>
        </span>
        <input
          id={`terminal-input-${curInputTimes.current}`}
          className="flex-1 px-1 text-black bg-transparent outline-none"
          onKeyDown={keyPress}
          autoFocus
        />
      </div>
    );
  };

  const generateResultRow = (result: JSX.Element | string) => {
    addRow(
      <div key={curInputTimes.current} className="break-all">
        {result}
      </div>
    );
  };

  return (
    <div
      className="terminal font-terminal relative h-full bg-white overflow-y-scroll text-sm"
      onClick={() =>
        document.getElementById(`terminal-input-${curInputTimes.current}`)?.focus()
      }
    >
      <div className="py-2 px-1.5">
        Hey, you found the terminal! Type `help` to get started.
      </div>
      <div className="px-1.5 pb-2">{content}</div>
    </div>
  );
};

export default Terminal;
