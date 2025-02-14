import { ModalLicenseType } from "~/types/configs/Liceses";

const ModalLicenseTable: ModalLicenseType[] = [
  {
    id: 1,
    icons: "../../../public/logo/logoRegister.png",
    name: "DataGaze DLP",
    adress: "192.168.1.1",
    computer_count: 10,
    uploaded: "2025-02-14",
    valid: "2026-02-14",
    valid_upload: "Upload license"
  },
  {
    id: 2,
    icons: "../../../public/logo/logoRegister.png",
    name: "DataGaze Siem",
    adress: "192.168.1.1",
    computer_count: 15,
    uploaded: "2025-02-14",
    valid: "2026-02-14",
    valid_upload: "Upload license"
  },
  {
    id: 3,
    icons: "../../../public/logo/logoRegister.png",
    name: "DataGaze Waf",
    adress: "192.168.1.1",
    computer_count: 20,
    uploaded: "2025-02-14",
    valid: "2026-02-14",
    valid_upload: "Upload license"
  }
];

export default ModalLicenseTable;
