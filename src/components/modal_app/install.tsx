import { Modal, Box, Typography, Tabs, Tab } from "@mui/material";
import { ApplicationType, InistallApplicationType, InstallAppInfoType } from "~/types";
import { BiMemoryCard } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { BsCpuFill } from "react-icons/bs";
import { RiComputerLine } from "react-icons/ri";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { FiGlobe } from "react-icons/fi";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { useState } from "react";
import { useQueryApi } from "~/hooks/useQuery";
import { useInstallApplication } from "~/hooks/useQuery/useQueryaction";

const steps = ["System requirements", "Server configs", "Completed"];

const LicenseModalinstall = ({
  app,
  onClose
}: {
  app: ApplicationType;
  onClose: () => void;
}) => {
  console.log(app);

  const [formData, setFormData] = useState({
    host: "209.38.250.43",
    port: "22",
    username: "root",
    password: "Datagaze2134$Platform"
  });

  const data2 = {
    host: "209.38.250.43",
    port: "22",
    username: "root",
    password: "Datagaze2134$Platform"
  };

  const { mutate } = useInstallApplication();
  const [activeStep, setActiveStep] = useState(0);
  const [OpenModal, SetOpenModal] = useState(false);

  const { data } = useQueryApi({
    pathname: "information_app",
    url: `/api/1/desktop/${app.id}`
  });

  const configs: InstallAppInfoType = data;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate({ id: app.id, data: data2 });
    setActiveStep((prev) => prev + 1);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    SetOpenModal(false);
  };

  const OpenInstallModal = () => {
    SetOpenModal(true);
  };
  const CloseModal = () => {
    SetOpenModal(false);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "8px",
          padding: 2,
          paddingX: 2,
          paddingY: 1,
          backgroundColor: "#e0e3fa",
          height: 446,
          width: 579,
          alignItems: "start",
          boxShadow: 124
        }}
      >
        <div className="flex items-center absolute top-0 w-[100%] left-0  m-auto  bg-[#fdfcfe]  px-4 h-[30px] gap-2  rounded-[2px]">
          <IoMdCloseCircle
            size={18}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
          <p className="text-[13px] font-600 text-[grey]">{configs?.application_name}</p>
        </div>
        <Typography
          variant="h4"
          className="flex items-center gap-3 !mt-[50px]"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
        >
          <img
            className="w-[56px] h-[56px]"
            src={`/icons/${configs?.pathToIcon}`}
            alt={configs?.application_name}
          />
          <p className="text-[40px] font-[500]">{configs?.application_name}</p>
        </Typography>
        <div className="mt-[30px] mb-[20px]">
          <p className="text-[grey] text-[14px] font-400">Basic requirements</p>

          <div className="w-[100%] mt-1 p-6 gap-[30px] pt-4 justify-center h-[200px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <BsCpuFill color="grey" />
                <p>CPU</p>
              </div>
              <p className="text-[16px] font-500">{configs?.cpu}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <BiMemoryCard />
                <p>RAM</p>
              </div>
              <p className="text-[16px] font-500">{configs?.ram}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <RiComputerLine />
                <p>Storage</p>
              </div>
              <p className="text-[16px] font-500">{configs?.storage}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <FiGlobe />
                <p>Network</p>
              </div>
              <p className="text-[16px] font-500">{configs?.network_bandwidth}</p>
            </div>
          </div>
        </div>

        <div className="flex text-[10px] font-normal items-center justify-end">
          <div className="flex items-center gap-1">
            <Button
              onChange={CloseModal}
              sx={{
                textTransform: "capitalize",
                mr: 1,
                fontFamily: "Inter, sans-serif"
              }}
              onClick={onClose}
              color="primary"
            >
              Cancel
            </Button>
            <button
              onClick={OpenInstallModal}
              className="flex w-[90px] h-[40px] rounded-[12px] text-[#1A79D8] font-500 text-[14px] items-center justify-center gap-1 bg-[white]"
            >
              Install
              <FiCheck size={19} />
            </button>
          </div>
          {OpenModal && (
            <div>
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[650px] h-[620px]">
                  <div className="flex flex-col gap-2 mb-[30px]">
                    <h2 className="text-2xl font-semibold flex justify-between">
                      Datagaze {configs.application_name}
                      <img
                        className="w-[70px] h-[70px]"
                        src={`/icons/${configs.pathToIcon}`}
                        alt="logo"
                      />
                    </h2>
                    <p className="text-sm text-gray-600">
                      Publisher:
                      <span className="text-blue-500 cursor-pointer">
                        {configs.publisher}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">Version: {configs?.version}</p>
                    <p className="text-sm text-gray-600">
                      Release date: {configs?.release_date}
                    </p>
                  </div>

                  <Stepper activeStep={activeStep} className="mt-4 text-[18px]">
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <div className="mt-[40px]">
                    {activeStep === 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[18px] font-600">Basic requirements</h3>
                        <p className="text-[16px] text-[grey] mt-[60px] font-400">
                          CPU:<span className="text-black">{configs?.cpu}</span>
                        </p>
                        <p className="text-[16px] text-[grey] font-400">
                          RAM:<span className="text-black">{configs?.ram}</span>
                        </p>
                        <p className="text-[16px] text-[grey] font-400">
                          Storage:<span className="text-black">{configs?.storage}</span>
                        </p>
                        <p className="text-[16px] text-[grey] font-400">
                          Network:
                          <span className="text-black">{configs?.network_bandwidth}</span>
                        </p>
                      </div>
                    )}
                    {activeStep === 1 && (
                      <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="mt-[30px] grid grid-cols-2 gap-5">
                          <label className="flex flex-col text-[13px] font-600 gap-1">
                            IP address
                            <input
                              name="ipAddress"
                              onChange={handleChange}
                              value={formData.host}
                              type="text"
                              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                              placeholder="Ip adress"
                            />
                          </label>
                          <label className="flex flex-col text-[13px] font-600 gap-1">
                            Port number
                            <input
                              name="portNumber"
                              value={formData.port}
                              onChange={handleChange}
                              type="text"
                              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                              placeholder="Port number "
                            />
                          </label>
                          <label className="flex flex-col text-[13px] font-600 gap-1">
                            Username
                            <input
                              name="username"
                              onChange={handleChange}
                              value={formData.username}
                              type="text"
                              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                              placeholder="Username"
                            />
                          </label>
                          <label className="flex flex-col text-[13px] font-600 gap-1">
                            Password
                            <input
                              name="password"
                              onChange={handleChange}
                              value={formData.password}
                              type="text"
                              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                              placeholder="Password"
                            />
                          </label>
                        </div>
                        <label className="flex flex-col text-[13px] mt-4 mb-5 font-600 gap-1">
                          Remind it checkbox
                          <input
                            name="remindCheckbox"
                            onChange={handleChange}
                            type="text"
                            className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                            placeholder="Remind it checkbox"
                          />
                        </label>
                        <div className="flex gap-2 justify-between items-center mt-[70px]">
                          <ReportGmailerrorredIcon className="text-[#1380ED] cursor-pointer" />
                          <div className="flex gap-3">
                            <Button
                              onClick={handleBack}
                              className="w-[137px]"
                              variant="outlined"
                              sx={{ textTransform: "capitalize" }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="w-[137px]"
                              variant="contained"
                              sx={{ textTransform: "capitalize" }}
                              color="primary"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                    {activeStep === 2 && (
                      <div className="fixed inset-0 bg-white mt-3 flex flex-col items-center justify-start overflow-hidden">
                        <div className="flex items-center p-1 gap-2 justify-start w-full bg-gray-200">
                          <IoMdCloseCircle
                            onClick={onClose}
                            size={15}
                            className="cursor-pointer text-gray-500"
                          />
                          <span className="text-sm font-normal">Terminal</span>
                        </div>
                        <div className="w-full h-full overflow-hidden">
                          <Terminal autoSsh={true} />
                        </div>
                      </div>
                    )}
                  </div>

                  {activeStep === 0 && (
                    <div className="flex gap-2 justify-between items-center mt-[70px]">
                      <ReportGmailerrorredIcon className="text-[#1380ED] cursor-pointer" />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleBack}
                          className="w-[137px]"
                          variant="outlined"
                          sx={{ textTransform: "capitalize" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleNext}
                          className="w-[137px]"
                          variant="contained"
                          sx={{ textTransform: "capitalize" }}
                          color="primary"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default LicenseModalinstall;
