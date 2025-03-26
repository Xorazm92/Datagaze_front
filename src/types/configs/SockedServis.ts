import { io, Socket } from "socket.io-client";

export class SocketService {
  private terminalSocket: Socket;
  private progressSocket: Socket;
  private baseUrl: string = "http://localhost:3000"; // Updated to use local backend
  
  constructor(token: string) {
    const options = {
      transports: ["websocket"],
      query: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    };

    this.terminalSocket = io(`${this.baseUrl}/terminal`, options);
    this.progressSocket = io(`${this.baseUrl}/progress`, options);

    this.setupEventListeners();
    this.autoConnect();
  }

  private setupEventListeners(): void {
    this.terminalSocket.on("connect", () => {
      console.log("Connected to terminal socket");
      this.progressSocket.emit("progressUpdate", "50");
    });

    this.terminalSocket.on("connect_error", (err) => {
      console.error("Terminal connection error:", err);
      this.progressSocket.emit("progressUpdate", "Error: Socket connection failed");
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
  }

  private autoConnect(): void {
    this.terminalSocket.on("connect", () => {
      this.progressSocket.emit("progressUpdate", "70");
      setTimeout(() => {
        this.progressSocket.emit("progressUpdate", "100");
      }, 1000);
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
      callback(data);
    });
  }

  onCommandResponse(callback: (data: any) => void): void {
    this.terminalSocket.on("command_response", (data) => {
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
