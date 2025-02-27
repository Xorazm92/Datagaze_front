import React, { useState, useEffect, useRef } from "react";
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";

interface TerminalProps {
  token?: string | null; // JWT token WebSocket uchun
  autoSsh?: boolean; // ssh avtomatik ishga tushishi uchun
}
const Terminal = ({ token, autoSsh = false }: TerminalProps) => {
  const [content, setContent] = useState<JSX.Element[]>([]);
  const [rmrf, setRmrf] = useState(false);
  const history = useRef<string[]>([]);
  const curHistory = useRef(0);
  const curInputTimes = useRef(0);
  const curDirPath = useRef<string[]>([]);
  const curChildren = useRef<any>(terminal);
  const ws = useRef<WebSocket | null>(null);

  // Funksiyalarni commands dan oldin e’lon qilish
  const reset = () => {
    const terminal = document.querySelector("#terminal-content") as HTMLElement;
    if (terminal) terminal.innerHTML = "";
  };

  const addRow = (row: JSX.Element) => {
    setContent((prev) => {
      if (prev.find((item) => item.key === row.key)) return prev;
      return [...prev, row];
    });
  };

  const getCurDirName = () => {
    return curDirPath.current.length === 0
      ? "~"
      : curDirPath.current[curDirPath.current.length - 1];
  };

  const getCurChildren = () => {
    let children = terminal as any;
    for (const name of curDirPath.current) {
      children = children.find(
        (item: TerminalData) => item.title === name && item.type === "folder"
      ).children;
    }
    return children;
  };

  const cd = (args?: string) => {
    if (args === undefined || args === "~") {
      curDirPath.current = [];
      curChildren.current = terminal;
    } else if (args === ".") {
      return;
    } else if (args === "..") {
      if (curDirPath.current.length === 0) return;
      curDirPath.current.pop();
      curChildren.current = getCurChildren();
    } else {
      const target = curChildren.current.find(
        (item: TerminalData) => item.title === args && item.type === "folder"
      );
      if (!target) {
        generateResultRow(
          curInputTimes.current,
          <span>{`cd: no such file or directory: ${args}`}</span>
        );
      } else {
        curChildren.current = target.children;
        curDirPath.current.push(target.title);
      }
    }
  };

  const ls = () => {
    const result = curChildren.current.map((item: TerminalData) => (
      <span
        key={`terminal-result-ls-${curInputTimes.current}-${item.id}`}
        className={`${item.type === "file" ? "text-black" : "text-purple-300"}`}
      >
        {item.title}
      </span>
    ));
    generateResultRow(
      curInputTimes.current,
      <div className="grid grid-cols-4 w-full">{result}</div>
    );
  };

  const cat = (args?: string) => {
    const file = curChildren.current.find(
      (item: TerminalData) => item.title === args && item.type === "file"
    );
    if (!file) {
      generateResultRow(
        curInputTimes.current,
        <span>{`cat: ${args}: No such file or directory`}</span>
      );
    } else {
      generateResultRow(curInputTimes.current, <span>{file.content}</span>);
    }
  };

  const clear = () => {
    curInputTimes.current += 1;
    reset();
    setContent([]);
  };

  const help = () => {
    const help = (
      <ul className="list-disc ml-6 pb-1.5">
        <li>
          <span className="text-red-400">cat {"<file>"}</span> - See the content of{" "}
          {"<file>"}
        </li>
        <li>
          <span className="text-red-400">cd {"<dir>"}</span> - Move into {"<dir>"}, "cd
          .." to move to the parent directory, "cd" or "cd ~" to return to root
        </li>
        <li>
          <span className="text-red-400">ls</span> - See files and directories in the
          current directory
        </li>
        <li>
          <span className="text-red-400">clear</span> - Clear the screen
        </li>
        <li>
          <span className="text-red-400">help</span> - Display this help menu
        </li>
        <li>
          <span className="text-red-400">ssh</span> - Connect to WebSocket terminal
        </li>
        <li>
          <span className="text-red-400">rm -rf /</span> - :)
        </li>
        <li>
          press <span className="text-red-400">up arrow / down arrow</span> - Select
          history commands
        </li>
        <li>
          press <span className="text-red-400">tab</span> - Auto complete
        </li>
      </ul>
    );
    generateResultRow(curInputTimes.current, help);
  };

  const ssh = (args?: string) => {
    const url = `wss://datagaze-platform-9cab2c02bc91.herokuapp.com/terminal?token=${token}`;
    console.log(token);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ command: args || "ls -la" }));
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      generateResultRow(
        curInputTimes.current,
        <span>✅ Connected to WebSocket server</span>
      );
      ws.current?.send(JSON.stringify({ command: args || "ls -la" }));
    };

    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.event === "command_response") {
        const { success, result } = response.data;
        generateResultRow(
          curInputTimes.current,
          <span>{success ? `🚀 ${result}` : `❌ Error: ${result}`}</span>
        );
      }
    };

    ws.current.onerror = (error) => {
      console.log(error);

      generateResultRow(
        curInputTimes.current,
        <span>❌ WebSocket error: {error.toString()}</span>
      );
    };

    ws.current.onclose = () => {
      generateResultRow(
        curInputTimes.current,
        <span>🔌 WebSocket connection closed</span>
      );
    };
  };

  // Endi commands ob'ektini funksiyalardan keyin e’lon qilamiz
  const commands: { [key: string]: (arg?: string) => void } = {
    cd,
    ls,
    cat,
    clear,
    help,
    ssh
  };

  useEffect(() => {
    reset();
    generateInputRow(curInputTimes.current);

    if (autoSsh) {
      ssh();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [autoSsh]);

  const autoComplete = (text: string) => {
    if (!text) return text;
    const [cmd, args] = text.split(" ");
    if (!args) {
      return Object.keys(commands).find((item) => item.startsWith(cmd)) || text;
    }
    if (cmd === "cd" || cmd === "cat") {
      const type = cmd === "cd" ? "folder" : "file";
      const guess = curChildren.current.find(
        (item: TerminalData) => item.type === type && item.title.startsWith(args)
      );
      return guess ? `${cmd} ${guess.title}` : text;
    }
    return text;
  };

  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    const inputText = inputElement.value.trim();
    const [cmd, args] = inputText.split(" ");

    if (e.key === "Enter") {
      history.current.push(inputText);
      inputElement.setAttribute("readonly", "true");

      if (inputText.startsWith("rm -rf")) {
        setRmrf(true);
      } else if (cmd && commands[cmd]) {
        commands[cmd](args);
      } else {
        generateResultRow(
          curInputTimes.current,
          <span>{`zsh: command not found: ${cmd}`}</span>
        );
      }

      curHistory.current = history.current.length;
      curInputTimes.current += 1;
      generateInputRow(curInputTimes.current);
    } else if (e.key === "ArrowUp") {
      if (history.current.length > 0 && curHistory.current > 0) {
        curHistory.current--;
        inputElement.value = history.current[curHistory.current];
      }
    } else if (e.key === "ArrowDown") {
      if (history.current.length > 0) {
        curHistory.current++;
        inputElement.value =
          curHistory.current < history.current.length
            ? history.current[curHistory.current]
            : "";
      }
    } else if (e.key === "Tab") {
      inputElement.value = autoComplete(inputText);
      e.preventDefault();
    }
  };

  const focusOnInput = (id: number) => {
    const input = document.querySelector(`#terminal-input-${id}`) as HTMLInputElement;
    input?.focus();
  };

  const generateInputRow = (id: number) => {
    const newRow = (
      <div key={`terminal-input-row-${id}`} className="flex">
        <div className="w-max hstack space-x-1.5">
          <span className="text-black">
            solikhov <span className="text-green-300">{getCurDirName()}</span>
          </span>
          <span className="text-red-400">{">"}</span>
        </div>
        <input
          id={`terminal-input-${id}`}
          className="flex-1 px-1 text-black outline-none bg-transparent"
          onKeyDown={keyPress}
          autoFocus
        />
      </div>
    );
    addRow(newRow);
  };

  const generateResultRow = (id: number, result: JSX.Element) => {
    const newRow = (
      <div key={`terminal-result-row-${id}`} className="break-all">
        {result}
      </div>
    );
    addRow(newRow);
  };

  return (
    <div
      className="terminal font-terminal font-normal relative h-full bg-white overflow-y-scroll"
      style={{ fontSize: "14px" }}
      onClick={() => focusOnInput(curInputTimes.current)}
    >
      <div className="py-2 px-1.5">
        Hey, you found the terminal! Type `help` to get started.
      </div>
      <div id="terminal-content" className="px-1.5 pb-2">
        {content}
      </div>
    </div>
  );
};

export default Terminal;
