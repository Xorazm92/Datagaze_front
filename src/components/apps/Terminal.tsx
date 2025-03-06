import React, { useState, useEffect, useRef } from "react";
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";
import { SocketService } from "~/types/configs/SockedServis";

interface TerminalProps {
  autoSsh?: boolean;
}

const Terminal = ({ autoSsh = false }: TerminalProps) => {
  const token = localStorage.getItem("token");
  const [content, setContent] = useState<JSX.Element[]>([]);
  const [progress, setProgress] = useState<string | number | null>(null);
  const history = useRef<string[]>([]);
  const curInputTimes = useRef(0);
  const curDirPath = useRef<string[]>([]);
  const curChildren = useRef<TerminalData[]>(terminal);
  const socketService = useRef<SocketService | null>(null);

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
  };

  const clear = () => {
    curInputTimes.current++;
    reset();
    setProgress(null);
    setContent(() => []);
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

  const ssh = (args?: string) => {
    if (!token) {
      generateResultRow("❌ Error: Token topilmadi!");
      return;
    }

    if (!socketService.current) {
      socketService.current = new SocketService(token);
      socketService.current.onMessage((data) => {
        const { success, result } = data.data || data;
        generateResultRow(
          success ? `🚀 ${result || "Command executed"}` : `❌ Xato: ${result}`
        );
      });
      socketService.current.onProgress((progressData) => {
        console.log("Progress set to:", progressData);
        setProgress(progressData !== undefined ? progressData : null);
      });
      socketService.current.onCommandResponse((data) => {
        const { success, result } = data.data || data;
        console.log("Command response data:", data);
        generateResultRow(
          success ? `🚀 ${result || "Command executed"}` : `❌ Xato: ${result}`
        );
      });
    }

    socketService.current.sendCommand(args || "ssh root@209.38.250.43");
    console.log("SSH command sent with args:", args);
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
        ssh("ssh root@209.38.250.43");
      }
    };

    initializeTerminal();

    return () => {
      if (socketService.current) {
        socketService.current.disconnect();
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
          solikhov <span className="text-green-300">{getCurDirName()}</span>
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
      {progress !== null && (
        <div className="px-1.5 py-1 text-blue-500">
          <p>O‘rnatish boshlandi...</p>
          Progress:
          {typeof progress === "number" && progress <= 100 ? `${progress}%` : progress}
          {typeof progress === "number" && (
            <div className="w-full bg-gray-200 h-2">
              <div className="bg-blue-500 h-2" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          <p>✅ Jarayon yakunlandi</p>
        </div>
      )}
      <div className="px-1.5 pb-2">{content}</div>
    </div>
  );
};

export default Terminal;
