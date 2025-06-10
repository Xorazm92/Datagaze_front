export interface LaunchpadData {
  id: string;
  icon?: any;
  title: string;
  img: string;
  link?: string;
  License_count?: number;
  Agent_version?: string;
  adress?: string;
  File_size?: string;
  First_upload_date?: string;
  Last_upload_date?: string;
  CPU?: string;
  Network?: string;
  Storage?: string;
}
export interface InstallAppInfoType {
  application_name?: string;
  cpu?: string;
  id: string;
  network_bandwidth?: string;
  pathToIcon?: string;
  publisher?: string;
  ram?: string;
  release_date?: string;
  storage?: string;
  version?: string;
}
