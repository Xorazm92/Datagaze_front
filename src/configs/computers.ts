import { ComputerType } from "~/types/configs/computers";

export const computers: ComputerType[] = [
  {
    id: 1,
    name: "Jaxon-PC",
    OS: "Linux",
    adress: "192.39.32.11",
    active: "Active",
    about: "About PC",
    platform: "x64",
    version: "11.0.123",
    build_number: "10.256.333",
    CPU: "Inter i7 1280h",
    cores: 24,
    model: "14900H",
    Nic_name: "Realtek Wireless x43",
    Mac_adress: "AC:00:2E:11:88:0C",
    Aviable: "Online",
    Ram: 50,
    Disk_A: 50,
    Disk_C: 90
  },
  {
    id: 2,
    name: "Luna-PC",
    OS: "Windows",
    adress: "192.39.32.11",
    active: "Inactive",
    about: "About PC",
    platform: "x80",
    version: "11.0.123",
    build_number: "10.256.333",
    CPU: "Inter i7 1280h",
    cores: 14,
    model: "14900H",
    Nic_name: "Realtek Wireless x43",
    Mac_adress: "AC:00:2E:11:88:0C",
    Aviable: "Offline",
    Ram: 50,
    Disk_A: 50,
    Disk_C: 90
  }
];
