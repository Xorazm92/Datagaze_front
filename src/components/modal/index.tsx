import { Modal, Box, Typography, Button } from "@mui/material";
import { LaunchpadData } from "~/types";

const LicenseModal = ({ app, onClose }: { app: LaunchpadData; onClose: () => void }) => {
  return (
    <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "10px",
          p: 3,
          backgroundColor: ["#e0e3fa"],
          height: 430,
          width: 580,
          boxShadow: 24
        }}
      >
        <Typography variant="subtitle1" className="text-[14px] font-[400] opacity-[50%]">
          Produced by
        </Typography>
        <Typography
          variant="h4"
          className="flex items-center gap-3"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
        >
          <img className="w-[56px] h-[56px]" src={app.img} alt="" />
          <p className="text-[40px] font-[500]">{app.title}</p>
        </Typography>

        <div className="mt-[20px] mb-[10px]">
          <p className="text-[14px] font-[400] opacity-[50%]">Details</p>
          <div className="w-[100%] p-4 gap-3 h-[180px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <img src="../../../public/img/icons/file_market.png" alt="count" />
                <p>License count</p>
              </div>
              <p className="text-[20px] font-bold">{app.License_count}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <img src="../../../public/img/icons/Vector.png" alt="cersion" />
                <p>Agent version</p>
              </div>
              <p className="text-[20px] font-bold">{app.Agent_version}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <img src="../../../public/img/icons/computer.png" alt="adress" />
                <p>IP address</p>
              </div>
              <p className="text-[20px] font-bold">{app.adress}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <img src="../../../public/img/icons/computer.png" alt="adress" />
                <p>File size</p>
              </div>
              <p className="text-[20px] font-bold">{app.File_size}GB</p>
            </div>
          </div>
        </div>

        <div className="flex !text-[18px] !font-[700] items-center justify-between">
          <Button color="error" onClick={onClose}>
            Uninstall
          </Button>
          <div className="flex items-center gap-1 ">
            <Button color="primary" sx={{ mr: 1 }}>
              Go to server
            </Button>
            <Button variant="text" onClick={onClose}>
              Edit details
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default LicenseModal;
