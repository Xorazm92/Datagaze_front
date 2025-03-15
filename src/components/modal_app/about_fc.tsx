import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { IoMdCloseCircle } from "react-icons/io";
import { LinearProgress, Typography } from "@mui/material";
import { computersbyIdType } from "~/types/configs";
import { useQueryApi } from "~/hooks/useQuery";

// Hajmlarni son sifatida olish uchun yordamchi funksiya
const getSizeInGB = (size: string): number => {
  const num = parseFloat(size.replace(/[^0-9.]/g, ""));
  return size.includes("TB") ? num * 1024 : num;
};

const About_fc = ({ id, close }: { id: string; close: () => void }) => {
  const { data }: { data?: computersbyIdType } = useQueryApi({
    url: `/api/1/device/${id}`,
    pathname: "Modal_info_application"
  });
  console.log(data?.network_details);

  const [tabValue, setTabValue] = useState("os");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-blue-100 to-blue-100 rounded-lg shadow-lg p-3 flex flex-col overflow-auto w-[75vh] m-auto relative">
        <div className="flex justify-start h-[12px] ml-[20px] items-center mb-4">
          <IoMdCloseCircle
            size={20}
            className="cursor-pointer text-gray-500 hover:text-gray-700 absolute top-3 left-4"
            onClick={close}
          />
          <h2 className="text-[13px] font-bold text-gray-600 top-3 left-[50px] absolute">
            About PC
          </h2>
        </div>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              backgroundColor: "#e4ebfd",
              borderRadius: "999px",
              padding: "2px",
              display: "flex",
              justifyContent: "space-between",
              height: "40px",
              width: "100%",
              marginBottom: "30px"
            }}
          >
            <Tab
              value="os"
              label="OS"
              sx={{
                minWidth: "100px",
                borderRadius: "999px",
                textTransform: "none",
                height: "40px",
                fontWeight: 500,
                backgroundColor: tabValue === "os" ? "#fff" : "transparent",
                boxShadow: tabValue === "os" ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"
              }}
            />
            <Tab
              value="processor"
              label="Processor"
              sx={{
                minWidth: "100px",
                borderRadius: "999px",
                textTransform: "none",
                height: "40px",
                fontWeight: 500,
                backgroundColor: tabValue === "processor" ? "#fff" : "transparent",
                boxShadow:
                  tabValue === "processor" ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"
              }}
            />
            <Tab
              value="network"
              label="Network"
              sx={{
                minWidth: "100px",
                borderRadius: "999px",
                textTransform: "none",
                height: "40px",
                fontWeight: 500,
                backgroundColor: tabValue === "network" ? "#fff" : "transparent",
                boxShadow:
                  tabValue === "network" ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"
              }}
            />
          </Tabs>
        </Box>
        <div className="pb-3 rounded-lg bg-[#FFFFFF] p-2">
          {tabValue === "os" && (
            <div className="grid grid-cols-2 gap-3">
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Operation System</p>
                <p className="text-lg font-medium">{data?.os_details?.os}</p>
              </span>
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Platform</p>
                <p className="text-lg font-medium">{data?.os_details?.platform}</p>
              </span>
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Build number</p>
                <p className="text-lg font-medium">{data?.os_details?.build_number}</p>
              </span>
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Version</p>
                <p className="text-lg font-medium">{data?.os_details?.version}</p>
              </span>
            </div>
          )}
          {tabValue === "processor" && (
            <div className="grid grid-cols-2 gap-4">
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">CPU</p>
                <p className="text-lg font-medium">{data?.processor_details?.cpu}</p>
              </span>
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Model</p>
                <p className="text-lg font-medium">
                  {data?.processor_details?.generation}
                </p>
              </span>
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Cores</p>
                <p className="text-lg font-medium">{data?.processor_details?.core}</p>
              </span>
            </div>
          )}
          {tabValue === "network" && (
            <div>
              {data?.network_details?.map((info, index) => (
                <div
                  className="grid grid-cols-2 gap-4 border-b-[1px] py-3 border-solid"
                  key={index}
                >
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">NIC Name</p>
                    <p className="text-lg font-medium">{info.nic_name}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Mac Address</p>
                    <p className="text-lg font-medium">{info.mac_address}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">IP Address</p>
                    <p className="text-lg font-medium">{info.ip_address}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Available</p>
                    <p
                      className={`text-[12px] font-medium p-2 w-[51px] rounded-[6px] flex items-center ${
                        info.available === "Online"
                          ? "text-[#1A8F44] bg-[#e5fbef]"
                          : "text-red-600 bg-[#fee7e6]"
                      }`}
                    >
                      {info.available}
                    </p>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bitta box ichida RAM va barcha disklar */}
        <div className="mb-[30px] mt-5 p-2 rounded-lg bg-[#FFFFFF]">
          {/* RAM qismi */}
          <Box display="flex" alignItems="center" marginTop={1}>
            <Box width="100%" mr={1}>
              <label className="block font-medium text-[17px]">
                RAM
                <span className="text-gray-500 text-[14px] font-normal">
                  ({data?.memory_storage_details?.ram})
                </span>
              </label>
              <LinearProgress
                variant="determinate"
                value={50}
                className="h-[10px] p-1 mt-3 rounded-[5px]"
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(12)}%`}
            </Typography>
          </Box>

          {data?.memory_storage_details?.drives.map((val, idx) => {
            const totalSize = getSizeInGB(val.total_size || "0GB");
            const freeSize = getSizeInGB(val.free_size || "0GB");
            const usagePercentage = totalSize
              ? ((totalSize - freeSize) / totalSize) * 100
              : 0;

            return (
              <Box key={idx} display="flex" alignItems="center" marginTop={1}>
                <Box width="100%" mr={1}>
                  <label className="block font-medium text-[17px]">
                    Disk {val.drive_name}
                    <span className="text-gray-500 text-[14px] font-normal">
                      ({val?.total_size})
                    </span>
                  </label>
                  <LinearProgress
                    variant="determinate"
                    value={usagePercentage}
                    className="h-[10px] p-1 mt-3 rounded-[5px]"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(usagePercentage)}%`}
                </Typography>
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About_fc;
