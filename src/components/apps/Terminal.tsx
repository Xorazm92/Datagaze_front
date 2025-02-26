import React, { useState, useEffect, useRef } from "react";
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";

interface TerminalState {
  rmrf: boolean;
  content: JSX.Element[];
}

export default class Terminal extends React.Component<any, TerminalState> {
  private history = [] as string[];
  private curHistory = 0;
  private curInputTimes = 0;
  private curDirPath = [] as any;
  private curChildren = terminal as any;
  private commands: {
    [key: string]: { (): void } | { (arg?: string): void };
  };

  constructor(props: any) {
    super(props);
    this.state = {
      content: [],
      rmrf: false
    };
    this.commands = {
      cd: this.cd,
      ls: this.ls,
      cat: this.cat,
      clear: this.clear,
      help: this.help,
      ssh: this.ssh
    };
  }

  componentDidMount() {
    this.reset();
    this.generateInputRow(this.curInputTimes);
  }

  reset = () => {
    const terminal = document.querySelector("#terminal-content") as HTMLElement;
    terminal.innerHTML = "";
  };
  ssh = () => {
    this.generateResultRow(this.curInputTimes, <span>Hello, world!</span>);
  };
  addRow = (row: JSX.Element) => {
    if (this.state.content.find((item) => item.key === row.key)) return;

    const content = this.state.content;
    content.push(row);
    this.setState({ content });
  };

  getCurDirName = () => {
    if (this.curDirPath.length === 0) return "~";
    else return this.curDirPath[this.curDirPath.length - 1];
  };

  getCurChildren = () => {
    let children = terminal as any;
    for (const name of this.curDirPath) {
      children = children.find((item: TerminalData) => {
        return item.title === name && item.type === "folder";
      }).children;
    }
    return children;
  };

  cd = (args?: string) => {
    if (args === undefined || args === "~") {
      this.curDirPath = [];
      this.curChildren = terminal;
    } else if (args === ".") {
      return;
    } else if (args === "..") {
      if (this.curDirPath.length === 0) return;
      this.curDirPath.pop();
      this.curChildren = this.getCurChildren();
    } else {
      const target = this.curChildren.find((item: TerminalData) => {
        return item.title === args && item.type === "folder";
      });
      if (target === undefined) {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`cd: no such file or directory: ${args}`}</span>
        );
      } else {
        this.curChildren = target.children;
        this.curDirPath.push(target.title);
      }
    }
  };

  ls = () => {
    const result = [];
    for (const item of this.curChildren) {
      result.push(
        <span
          key={`terminal-result-ls-${this.curInputTimes}-${item.id}`}
          className={`${item.type === "file" ? "text-black" : "text-purple-300"}`}
        >
          {item.title}
        </span>
      );
    }
    this.generateResultRow(
      this.curInputTimes,
      <div className="grid grid-cols-4 w-full">{result}</div>
    );
  };

  cat = (args?: string) => {
    const file = this.curChildren.find((item: TerminalData) => {
      return item.title === args && item.type === "file";
    });

    if (file === undefined) {
      this.generateResultRow(
        this.curInputTimes,
        <span>{`cat: ${args}: No such file or directory`}</span>
      );
    } else {
      this.generateResultRow(this.curInputTimes, <span>{file.content}</span>);
    }
  };

  clear = () => {
    this.curInputTimes += 1;
    this.reset();
  };

  help = () => {
    const help = (
      <ul className="list-disc ml-6 pb-1.5">
        <li>
          <span text-red-400>cat {"<file>"}</span> - See the content of {"<file>"}
        </li>
        <li>
          <span text-red-400>cd {"<dir>"}</span> - Move into
          {" <dir>"}, "cd .." to move to the parent directory, "cd" or "cd ~" to return to
          root
        </li>
        <li>
          <span text-red-400>ls</span> - See files and directories in the current
          directory
        </li>
        <li>
          <span text-red-400>clear</span> - Clear the screen
        </li>
        <li>
          <span text-red-400>help</span> - Display this help menu
        </li>
        <li>
          <span text-red-400>rm -rf /</span> - :)
        </li>
        <li>
          press <span text-red-400>up arrow / down arrow</span> - Select history commands
        </li>
        <li>
          press <span text-red-400>tab</span> - Auto complete
        </li>
      </ul>
    );
    this.generateResultRow(this.curInputTimes, help);
  };

  autoComplete = (text: string) => {
    if (text === "") return text;

    const input = text.split(" ");
    const cmd = input[0];
    const args = input[1];

    let result = text;

    if (args === undefined) {
      const guess = Object.keys(this.commands).find((item) => {
        return item.substring(0, cmd.length) === cmd;
      });
      if (guess !== undefined) result = guess;
    } else if (cmd === "cd" || cmd === "cat") {
      const type = cmd === "cd" ? "folder" : "file";
      const guess = this.curChildren.find((item: TerminalData) => {
        return item.type === type && item.title.substring(0, args.length) === args;
      });
      if (guess !== undefined) result = cmd + " " + guess.title;
    }
    return result;
  };

  keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    const inputElement = document.querySelector(
      `#terminal-input-${this.curInputTimes}`
    ) as HTMLInputElement;
    const inputText = inputElement.value.trim();
    const input = inputText.split(" ");

    if (keyCode === "Enter") {
      this.history.push(inputText);
      const cmd = input[0];
      const args = input[1];
      inputElement.setAttribute("readonly", "true");

      if (inputText.substring(0, 6) === "rm -rf") this.setState({ rmrf: true });
      else if (cmd && Object.keys(this.commands).includes(cmd)) {
        this.commands[cmd](args);
      } else {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`zsh: command not found: ${cmd}`}</span>
        );
      }

      this.curHistory = this.history.length;
      this.curInputTimes += 1;
      this.generateInputRow(this.curInputTimes);
    } else if (keyCode === "ArrowUp") {
      if (this.history.length > 0) {
        if (this.curHistory > 0) this.curHistory--;
        const historyCommand = this.history[this.curHistory];
        inputElement.value = historyCommand;
      }
    } else if (keyCode === "ArrowDown") {
      if (this.history.length > 0) {
        if (this.curHistory < this.history.length) this.curHistory++;
        if (this.curHistory === this.history.length) inputElement.value = "";
        else {
          const historyCommand = this.history[this.curHistory];
          inputElement.value = historyCommand;
        }
      }
    } else if (keyCode === "Tab") {
      inputElement.value = this.autoComplete(inputText);
      e.preventDefault();
    }
  };

  focusOnInput = (id: number) => {
    const input = document.querySelector(`#terminal-input-${id}`) as HTMLInputElement;
    input.focus();
  };

  generateInputRow = (id: number) => {
    const newRow = (
      <div key={`terminal-input-row-${id}`} flex>
        <div className="w-max hstack space-x-1.5">
          <span text-black>
            solikhov <span text-green-300>{this.getCurDirName()}</span>
          </span>
          <span text-red-400>{">"}</span>
        </div>
        <input
          id={`terminal-input-${id}`}
          className="flex-1 px-1 text-black outline-none bg-transparent"
          onKeyDown={this.keyPress}
          autoFocus={true}
        />
      </div>
    );
    this.addRow(newRow);
  };

  generateResultRow = (id: number, result: JSX.Element) => {
    const newRow = (
      <div key={`terminal-result-row-${id}`} break-all>
        {result}
      </div>
    );
    this.addRow(newRow);
  };

  render() {
    return (
      <div
        className="terminal font-terminal font-normal relative h-full bg-white overflow-y-scroll"
        text="black sm"
        onClick={() => this.focusOnInput(this.curInputTimes)}
      >
        <div p="y-2 x-1.5">Hey, you found the terminal! Type `help` to get started.</div>
        <div id="terminal-content" p="x-1.5 b-2">
          {this.state.content}
        </div>
      </div>
    );
  }
}
