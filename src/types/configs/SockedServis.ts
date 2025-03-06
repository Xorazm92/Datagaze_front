import { io, Socket } from "socket.io-client";

export class SocketService {
  private terminalSocket: Socket;
  private progressSocket: Socket;
  private baseUrl: string = "wss://datagaze-platform-9cab2c02bc91.herokuapp.com";

  constructor(token: string) {
    const options = {
      transports: ["websocket"],
      query: { token }
    };

    this.terminalSocket = io(`${this.baseUrl}/terminal`, options);
    this.progressSocket = io(`${this.baseUrl}/progress`, options);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.terminalSocket.on("connect", () => {
      console.log("Connected to terminal socket");
    });

    this.terminalSocket.on("connect_error", (err) => {
      console.error("Terminal connection error:", err);
    });

    this.terminalSocket.on("command_response", (data) => {
      console.log("Terminal response received:", data);
    });

    this.progressSocket.on("connect", () => {
      console.log("Connected to progress socket");
    });

    this.progressSocket.on("connect_error", (err) => {
      console.error("Progress connection error:", err);
    });

    this.progressSocket.on("progressUpdate", (data) => {
      console.log("Progress update received:", data);
    });
  }

  sendCommand(command: string): void {
    if (this.terminalSocket.connected) {
      console.log("Sending command:", command);
      this.terminalSocket.emit("command", { command });
    } else {
      console.log("Terminal socket not connected");
    }
  }

  onProgress(callback: (progress: number | string) => void): void {
    this.progressSocket.on("progressUpdate", (data) => {
      console.log("onProgress triggered with:", data);
      callback(data.progress || data);
    });
  }

  onCommandResponse(callback: (data: any) => void): void {
    this.terminalSocket.on("command_response", (data) => {
      console.log("onCommandResponse triggered with:", data);
      callback(data);
    });
  }

  onMessage(callback: (data: any) => void): void {
    this.terminalSocket.on("message", callback);
  }

  disconnect(): void {
    if (this.terminalSocket) this.terminalSocket.disconnect();
    if (this.progressSocket) this.progressSocket.disconnect();
  }
}
