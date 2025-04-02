export interface ComputerType {
  id?: number;
  adress?: string;
  about?: string;
  platform?: string;
  version?: string;
  build_number?: string;
  CPU?: string;
  cores?: number;
  model?: string;
  Nic_name?: string;
  Mac_adress?: string;
  Aviable?: string;
  Ram?: number;
  Disk_D?: number;
  Disk_C?: number;
}
export interface ComputersType {
  name: string;
  hostname?: string;
  id: string;
  os_type: string;
  os_version: string;
  status: string;
  ip_address: string;
  mac_address: string;
}
export interface computersbyIdType {
  os_details?: {
    os?: string;
    platform?: string;
    build_number?: string;
    version?: string;
  };
  processor_details?: {
    cpu?: string;
    core?: string;
    generation?: string;
  };
  network_details: NetworkDetail[];

  memory_storage_details?: {
    ram?: string;
    drives: RamType[];
  };
}
export interface NetworkDetail {
  nic_name?: string;
  ip_address?: string;
  available?: string;
  type?: string;
  wifi_name?: string;
  either_net_name?: string;
  mac_address?: string;
  status?: string;
}

export interface RamType {
  drive_name: string;
  total_size: string;
  free_size: string;
}

export interface ComputersAppType {
  id: string;
  name: string;
  file_size: string;
  installation_type: string;
  installed_date: string;
}
