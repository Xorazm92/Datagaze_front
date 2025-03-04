import { io, Socket } from "socket.io-client";

export class SocketService {
  private terminalSocket: Socket;

  constructor(token: string) {
    this.terminalSocket = io(
      "wss://datagaze-platform-9cab2c02bc91.herokuapp.com/terminal",
      {
        transports: ["websocket"],
        query: { token }
      }
    );
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.terminalSocket.on("connect", () => {
      console.log("Connected to terminal socket");
    });

    this.terminalSocket.on("connect_error", (err) => {
      console.error("Terminal connection error:", err);
    });

    this.terminalSocket.on("progressUpdate", (data) => {
      console.log("Progress received:", data);
    });
  }

  sendCommand(command: string): void {
    if (this.terminalSocket.connected) {
      this.terminalSocket.emit("command", { command });
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.terminalSocket.on("message", callback);
  }

  onProgress(callback: (progress: number | string) => void): void {
    this.terminalSocket.on("progressUpdate", (data) => {
      console.log("onProgress triggered with:", data);
      callback(data.progress || data);
    });
  }

  disconnect(): void {
    if (this.terminalSocket) {
      this.terminalSocket.disconnect();
    }
  }
}
