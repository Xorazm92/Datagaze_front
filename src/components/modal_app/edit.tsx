import { Box, Button, Modal, Typography } from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { LaunchpadData } from "~/types";

interface EditDetailsModalProps {
  onClose: () => void;
  app: LaunchpadData;
}

export const EditDetailsModal = ({ onClose, app }: EditDetailsModalProps) => (
  <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
    <Box
      sx={{
        position: "absolute",
        fontFamily: "sans-serif",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        borderRadius: "10px",
        p: 2,
        backgroundColor: ["#e0e3fa"],
        height: 478,
        width: 520,
        boxShadow: 24
      }}
    >
      <div className="flex items-center gap-2 mb-8  justify-start">
        <IoMdCloseCircle
          size={18}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onClose}
        />
        <p className="text-[13px] font-600 text-[grey]">{app.title}</p>
      </div>
      <Typography
        variant="h4"
        className="flex items-center gap-3"
        sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
      >
        <img className="w-[56px] h-[56px]" src={app.img} alt="" />
        <p className="text-[40px] font-500">{app.title}</p>
      </Typography>

      <div>
        <div className="mt-[30px] grid grid-cols-2 gap-5 ">
          <label className="flex flex-col text-[13px] font-600 gap-1">
            IP address
            <input
              type="text"
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder="Ip adress"
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Port number
            <input
              type="text"
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder="Port number "
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Username
            <input
              type="text"
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder="Username"
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Password
            <input
              type="text"
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder="Password"
            />
          </label>
        </div>
        <label className="flex flex-col text-[13px] mt-4 mb-5 font-600 gap-1">
          Remind it checkbox
          <input
            type="text"
            className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
            placeholder="Remind it checkbox"
          />
        </label>
      </div>
      <div className="flex text-[18px] font-700 justify-end">
        <div className="flex items-center gap-1 ">
          <Button
            onClick={onClose}
            sx={{
              textTransform: "capitalize",
              mr: 1,
              fontFamily: "Inter, sans-serif" // Shrfit turi
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            sx={{
              textTransform: "capitalize",
              mr: 1,
              fontFamily: "Inter, sans-serif",
              background: "white",
              padding: "8px",
              borderRadius: "8px"
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </Box>
  </Modal>
);
