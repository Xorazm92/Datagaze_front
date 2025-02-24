import React, { useState } from "react";
import { computers } from "~/configs";
import { ComputerType } from "~/types/configs/computers";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { FiColumns } from "react-icons/fi";

import TextField from "@mui/material/TextField";
import { FormControl, Select, MenuItem } from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { FilterList, ViewColumn } from "@mui/icons-material";
import { LinearProgress, Typography } from "@mui/material";
import Computers_app from "./Computer_app";

const Computers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [selected, setSelected] = useState<ComputerType | null>(null);
  const [tabValue, setTabValue] = useState("os");
  const [value, Setvalue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState(computers);
  const searchFuctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    Setvalue(query);
    const filtered = computers.filter((comp) => comp.name?.toLowerCase().includes(query));
    setFilteredComputers(filtered);
  };

  const apptable = () => {
    setOpenTable(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const showModal = (item: ComputerType) => {
    setOpenModal(true);
    setSelected(item);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelected(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen ">
      {openTable && <Computers_app />}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <TextField
            value={value}
            onChange={searchFuctions}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: "18px"
              }
            }}
            placeholder="Search"
            slotProps={{
              input: {
                type: "search",
                className: "w-[200px] h-[30px] bg-white flex items-center justify-center"
              }
            }}
          />
          <div className="flex gap-2">
            {/* Filters Select */}
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                size="small"
                displayEmpty
                defaultValue=""
                sx={{
                  height: 30,
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  fontSize: "14px",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "8px 12px"
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <FilterList fontSize="small" /> Filters
                </MenuItem>
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
              </Select>
            </FormControl>

            {/* Customize Columns Select */}
            <FormControl sx={{ minWidth: 180 }}>
              <Select
                size="small"
                displayEmpty
                defaultValue=""
                sx={{
                  height: 30,
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  fontSize: "14px",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "8px 12px"
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <FiColumns />
                  Customize columns
                </MenuItem>
                <MenuItem value="column1">Column 1</MenuItem>
                <MenuItem value="column2">Column 2</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white  shadow-md rounded-lg">
            <thead>
              <tr className="border-b border-gray-300  text-gray-600 text-sm bg-[#ccdbf7]">
                <th className="p-3">
                  <input type="checkbox" />
                </th>
                <th className="p-3">#</th>
                <th className="p-3">Computer name</th>
                <th className="p-3">Operation System (OS)</th>
                <th className="p-3">IP address</th>
                <th className="p-3">Activity</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredComputers.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 p-4 text-sm hover:bg-gray-50"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">{item.id}</td>
                  <td className="p-3 cursor-pointer" onClick={() => apptable()}>
                    {item.name}
                  </td>
                  <td className="p-3">{item.OS}</td>
                  <td className="p-3">{item.adress}</td>
                  <td
                    className={`p-3 ${item.active === "Active" ? "text-green-600" : "text-gray-500"}`}
                  >
                    {item.active}
                  </td>
                  <td
                    className="p-3 text-blue-500 cursor-pointer"
                    onClick={() => showModal(item)}
                  >
                    About PC
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && openModal && (
        <div className="fixed inset-0 flex items-center  w-[100vh] m-auto justify-center  bg-opacity-50">
          <div className="bg-[#d3def7]  rounded-lg shadow-lg p-4  flex flex-col overflow-auto">
            <Box sx={{ width: "100%" }}>
              <div className="flex items-center gap-2 py-3 mt-4 justify-start">
                <IoMdCloseCircle
                  size={18}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                />
                <p className="text-[13px] font-600 text-[grey]">About PC</p>
              </div>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                textColor="inherit"
                variant="fullWidth"
                TabIndicatorProps={{
                  style: {
                    display: "none"
                  }
                }}
                sx={{
                  backgroundColor: "#e4ebfd",
                  borderRadius: "999px",
                  padding: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  height: "18px",
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
                    boxShadow:
                      tabValue === "os" ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"
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
                    borderRadius: "15px",
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

            <div className=" pb-3 rounded-4 bg-[#FFFFFF] p-2">
              {tabValue === "os" && (
                <div className="grid grid-cols-2 gap-3">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Operation System</p>
                    <p className="text-lg font-500">{selected.OS}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Platform</p>
                    <p className="text-lg font-500">{selected.platform}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Build number</p>
                    <p className="text-lg font-500">{selected.build_number}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Version</p>
                    <p className="text-lg font-500">{selected.version}</p>
                  </span>
                </div>
              )}
              {tabValue === "processor" && (
                <div className="grid grid-cols-2 gap-4">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">CPU</p>
                    <p className="text-lg font-500">{selected.CPU}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Model</p>
                    <p className="text-lg font-500">{selected.model}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Cores</p>
                    <p className="text-lg font-500">{selected.cores}</p>
                  </span>
                </div>
              )}
              {tabValue === "network" && (
                <div className="grid grid-cols-2 gap-3">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">NIC name</p>
                    <p className="text-lg font-500">{selected.Nic_name}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">IP Address</p>
                    <p className="text-lg font-500">{selected.adress}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">IP Address</p>
                    <p className="text-lg font-500">{selected.adress}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Aviable</p>
                    <p
                      className={`text-[12px]  font-[500] p-2  w-[51px] rounded-[6px] flex  items-center  ${selected.Aviable === "Online" ? "text-[#1A8F44] bg-[#e5fbef] " : "text-[red] bg-[#fee7e6] "}`}
                    >
                      {selected.Aviable}
                    </p>
                  </span>
                </div>
              )}
            </div>
            <div className="mb-[30px] mt-5 p-2 rounded-4 bg-[#FFFFFF]">
              <Box display="flex" alignItems="center" marginTop={1}>
                <Box width="100%" mr={1}>
                  <label className="block font-500 text-[17px]">
                    RAM
                    <span className="text-gray-500 text-[14px] font-normal">(8GB)</span>
                  </label>
                  <LinearProgress
                    variant="determinate"
                    value={selected.Ram}
                    className="h-[10px] p-1 mt-3 rounded-[5px]"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(selected.Ram)}%`}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" marginTop={1}>
                <Box width="100%" mr={1}>
                  <label className="block font-500 text-[17px]">
                    Disk D{" "}
                    <span className="text-gray-500 text-[14px] font-normal">(1TB)</span>
                  </label>
                  <LinearProgress
                    variant="determinate"
                    value={selected.Disk_D}
                    className="h-[10px] p-1 mt-3 rounded-[5px]"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(selected.Disk_D)}%`}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" marginTop={1}>
                <Box width="100%" mr={1}>
                  <label className="block font-500 text-[17px]">
                    Disk C{" "}
                    <span className="text-gray-500 text-[14px] font-normal">(1TB)</span>
                  </label>
                  <LinearProgress
                    variant="determinate"
                    value={selected.Disk_C}
                    className="h-[10px] p-1 mt-3 rounded-[5px]"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(selected.Disk_C)}%`}
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Computers;
