import {
  Modal,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import { LaunchpadData } from "~/types";
import { CiClock2 } from "react-icons/ci";
import { BiMemoryCard } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import { EditDetailsModal } from "./edit";
import { useDeleteApplication } from "~/hooks/useQuery/useQueryaction";
import { useState } from "react"; // useState import qilish

const LicenseModal = ({ app, onClose }: { app: LaunchpadData; onClose: () => void }) => {
  const [tabValue, setTabValue] = useState("Server Details");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { mutate, isPending, isError } = useDeleteApplication();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const UninstallApplication = (id: any) => {
    mutate(
      { id },
      {
        onSuccess: () => {
          console.log("Uninstall successful");
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error("Uninstall failed:", error);
        }
      }
    );
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  console.log("Rendering LicenseModal, isModalOpen:", isModalOpen);
  return (
    <Modal open={isModalOpen} onClose={handleModalClose} aria-labelledby="modal-title">
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
          backgroundColor: "#e0e3fa",
          height: 478,
          width: 520,
          boxShadow: 24
        }}
      >
        <div className="flex items-center absolute top-0 w-[100%] left-0  m-auto  bg-transparent  px-4 h-[30px] gap-2  rounded-[8px]">
          <IoMdCloseCircle
            size={18}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleModalClose}
          />
          <p className="text-[13px] font-600 text-gray-500">{app.title}</p>
        </div>
        <Typography
          variant="h4"
          className="flex items-center gap-3 !mt-[50px]"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
        >
          <img className="w-[56px] h-[56px]" src={app.img} alt={app.title} />
          <p className="text-[40px] font-500">{app.title}</p>
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          className="flex items-center justify-center m-auto"
          sx={{
            backgroundColor: "#e4ebfd",
            borderRadius: "999px",
            padding: "2px",
            width: "100%",
            marginBottom: "30px",
            marginTop: "10px"
          }}
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab
            label="Server Details"
            value="Server Details"
            sx={{
              flex: 1,
              borderRadius: "999px",
              textTransform: "none",
              height: "40px",
              fontWeight: 200,
              color: tabValue === "Server Details" ? "black" : "gray",
              backgroundColor: tabValue === "Server Details" ? "white" : "transparent",
              transition: "background-color 0.3s ease"
            }}
          />
          <Tab
            label="Agent Details"
            value="Agent Details"
            sx={{
              flex: 1,
              borderRadius: "999px",
              textTransform: "none",
              height: "40px",
              fontWeight: 200,
              color: tabValue === "Agent Details" ? "black" : "gray",
              backgroundColor: tabValue === "Agent Details" ? "white" : "transparent",
              transition: "background-color 0.3s ease"
            }}
          />
        </Tabs>

        {tabValue === "Server Details" ? (
          <div className="mt-[30px] mb-[20px]">
            <div className="w-[100%] p-6 gap-[30px] pt-4 justify-center h-[180px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/file_market.png" alt="count" />
                  <p>License count</p>
                </div>
                <p className="text-[16px] font-500">{app.License_count}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/Vector.png" alt="version" />
                  <p>Agent version</p>
                </div>
                <p className="text-[16px] font-500">{app.Agent_version}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/computer.png" alt="address" />
                  <p>IP address</p>
                </div>
                <p className="text-[16px] font-500">{app.adress}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <BiMemoryCard />
                  <p>File size</p>
                </div>
                <p className="text-[16px] font-500">{app.File_size}GB</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-[30px] mb-[20px]">
            <div className="w-[100%] p-6 gap-[30px] pt-4 justify-center h-[180px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <CiClock2 />
                  <p>First upload date</p>
                </div>
                <p className="text-[16px] font-500">{app.First_upload_date}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <CiClock2 />
                  <p>Last upload date</p>
                </div>
                <p className="text-[16px] font-500">{app.Last_upload_date}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/Vector.png" alt="version" />
                  <p>Agent version</p>
                </div>
                <p className="text-[16px] font-500">{app.Agent_version}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <BiMemoryCard />
                  <p>File size</p>
                </div>
                <p className="text-[16px] font-500">{app.File_size}GB</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex text-[18px] font-700 items-center justify-between">
          <Button
            onClick={() => UninstallApplication(app.id)}
            sx={{
              textTransform: "capitalize",
              mr: 1,
              fontFamily: "Inter, sans-serif"
            }}
            color="error"
          >
            {isPending || isError ? <CircularProgress size="30px" /> : "Uninstall"}
          </Button>
          <div className="flex items-center gap-1">
            <Button
              sx={{
                textTransform: "capitalize",
                mr: 1,
                fontFamily: "Inter, sans-serif"
              }}
              color="primary"
            >
              Go to server
            </Button>
            <Button
              sx={{
                textTransform: "capitalize",
                mr: 1,
                background: "white",
                padding: "8px",
                borderRadius: "8px",
                fontFamily: "Inter, sans-serif"
              }}
              onClick={handleEditClick}
            >
              Edit details
            </Button>
          </div>
        </div>
        {isEditModalOpen && <EditDetailsModal app={app} onClose={handleEditClose} />}
      </Box>
    </Modal>
  );
};

export default LicenseModal;
