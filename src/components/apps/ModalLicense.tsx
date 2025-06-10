import React, { useState } from "react";
import ModalLicenseTable from "~/configs/license";
import { ModalLicenseType } from "~/types/configs/Liceses";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import AddIcon from "@mui/icons-material/Add";
import { FiUploadCloud } from "react-icons/fi";

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import { RiImageAddLine } from "react-icons/ri";

const ModalLicense = () => {
  const [value, setValue] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const [filteredComputers, setFilteredComputers] =
    useState<ModalLicenseType[]>(ModalLicenseTable);
  const [isOpen, setIsOpen] = useState(false);
  const [tabValue, setTabValue] = useState("Install script");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered = ModalLicenseTable.filter((comp) =>
      comp.name?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
    setPage(0);
  };
  const paginatedComputers = filteredComputers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredComputers.length / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const step = ["General settings", "Scripts settings", "Product files"];
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActiveStep((prev) => prev + 1);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  const handleNext = () => {
    if (activeStep < step.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      setIsOpen(false);
    }
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <div className="flex items-center  relative gap-2">
            <TextField
              value={value}
              onChange={searchFunctions}
              placeholder="Search"
              slotProps={{
                input: {
                  type: "search",
                  className: "w-[200px] h-[30px] bg-white"
                }
              }}
            />
          </div>
          <div
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-white w-[130px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" /> Add new user
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#d4e0f9]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Product name</th>
                <th className="p-3">Publisher</th>
                <th className="p-3">Server version</th>
                <th className="p-3">Agent version</th>
                <th className="p-3">File size</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComputers.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-200 text-sm ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-[#ccdaf8]"
                  }`}
                >
                  <td className="p-3 flex items-center gap-2">
                    <img
                      className="w-[24px] rounded-[8px] h-[24px]"
                      src={item.icons}
                      alt="icon"
                    />
                    {item.name}
                  </td>
                  <td className="p-3">{item.publisher}</td>
                  <td className="p-3">{item.server_version}</td>
                  <td className="p-3">{item.agent_version}</td>
                  <td className="p-3">{item.file_size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="text-gray-700 text-sm border border-gray-300 rounded p-1 bg-white hover:bg-gray-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <span className="text-gray-700 text-sm">
            {page * rowsPerPage + 1}–
            {Math.min((page + 1) * rowsPerPage, filteredComputers.length)} of{" "}
            {filteredComputers.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i)}
                className={`px-3 py-1 border border-gray-300 rounded text-gray-700 ${
                  page === i ? "bg-gray-200" : "hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[620px] h-[610px]">
            <div className="flex flex-col gap-[40px] justify-between">
              <h2 className="text-[30px] font-bold">Add New Product</h2>
              <Stepper activeStep={activeStep} className="mt-4  text-[18px]">
                {step.map((label, idx) => (
                  <Step key={idx}>
                    <StepLabel className="text-[blue]">{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === 0 && (
                <div>
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-gray-700 font-medium">Product icon</p>
                    <label className="flex items-center gap-2  mb-[30px] ">
                      <div className="p-2 bg-[#efefef]">
                        <RiImageAddLine />
                      </div>
                      <input type="file" className="hidden" />
                      <span className="bg-white border border-gray-300 text-gray-700 px-4 py-1 rounded-lg text-sm hover:bg-gray-100">
                        Choose
                      </span>
                      <span className="text-gray-400 text-sm">
                        JPG, GIF or PNG, 1MB Max.
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Product name
                      </label>
                      <input
                        type="text"
                        defaultValue="Solikhov"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Publisher
                      </label>
                      <input
                        type="email"
                        defaultValue="david.wilson@data.com"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                  </div>
                  <div grid grid-cols-2 gap-4>
                    <div className="mb-4 ">
                      <label className="block text-[13px] font-600 text-black">
                        Server version
                      </label>
                      <input
                        type="password"
                        placeholder="password"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[13px] font-600 text-black">
                        Agent version
                      </label>
                      <input
                        type="password"
                        placeholder="password"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 1 && (
                <div>
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
                        value="Install script"
                        label="Install script"
                        sx={{
                          minWidth: "100px",
                          borderRadius: "999px",
                          textTransform: "none",
                          height: "40px",
                          fontWeight: 500,
                          backgroundColor:
                            tabValue === "Install script" ? "#fff" : "transparent",
                          boxShadow:
                            tabValue === "Install script"
                              ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                              : "none"
                        }}
                      />
                      <Tab
                        value="Update script"
                        label="Update script"
                        sx={{
                          minWidth: "100px",
                          borderRadius: "999px",
                          textTransform: "none",
                          height: "40px",
                          fontWeight: 500,
                          backgroundColor:
                            tabValue === "Update script" ? "#fff" : "transparent",
                          boxShadow:
                            tabValue === "Update script"
                              ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                              : "none"
                        }}
                      />
                      <Tab
                        value="Delete scripts"
                        label="Delete scripts"
                        sx={{
                          minWidth: "100px",
                          borderRadius: "999px",
                          textTransform: "none",
                          height: "40px",
                          fontWeight: 500,
                          backgroundColor:
                            tabValue === "Delete scripts" ? "#fff" : "transparent",
                          boxShadow:
                            tabValue === "Delete scripts"
                              ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                              : "none"
                        }}
                      />
                    </Tabs>
                  </Box>
                  {tabValue === "Install script" && (
                    <div className="w-[100%] h-[200px] bg-[grey] rounded-[8px]">
                      Install page
                    </div>
                  )}
                  {tabValue === "Update script" && (
                    <div className="w-[100%] h-[200px] bg-[grey] rounded-[8px]">
                      Update page
                    </div>
                  )}
                  {tabValue === "Delete scripts" && (
                    <div className="w-[100%] h-[200px] bg-[grey] rounded-[8px]">
                      Delete page
                    </div>
                  )}
                </div>
              )}

              {activeStep === 2 && (
                <div className="flex flex-col ">
                  <div>
                    <p className="mb-[10px]">Server Side File</p>
                    <div className="w-[100%] h-[136px] bg-[#FFFFFF] flex rounded-[8px] items-center justify-center px-[10px]">
                      <p className="text-center text-[13px] font-400 text-[grey]">
                        <FiUploadCloud
                          size={25}
                          color="grey"
                          className="m-auto mb-[15px]"
                        />
                        <span className="text-[black]">Drop your files here, or </span>
                        <span className="text-[#1A79D8] cursor-pointer">
                          click to browse
                        </span>
                        <br /> Up to 10 files, 100MB total limit
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-[10px]">Agent Side File</p>
                    <div className="w-[100%] h-[136px] bg-[#FFFFFF] flex rounded-[8px] items-center justify-center ">
                      <p className="text-center text-[13px] font-400 text-[grey]">
                        <FiUploadCloud
                          size={25}
                          color="grey"
                          className="m-auto mb-[5px]"
                        />
                        <span className="text-[black]">Drop your files here, or </span>
                        <span className="text-[#1A79D8] cursor-pointer">
                          click to browse
                        </span>
                        <br /> Up to 10 files, 100MB total limit
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-between items-center mt-[30px]">
              <ReportGmailerrorredIcon className="text-[#1380ED] cursor-pointer" />

              <div className="flex  gap-3">
                <Button
                  onClick={handleBack}
                  className="w-[137px] text-[black]"
                  variant="outlined"
                  color="info"
                  sx={{ textTransform: "capitalize" }}
                >
                  {activeStep > 0 ? "< Back" : "Cancel"}
                </Button>
                <Button
                  onClick={handleNext}
                  className="w-[137px]"
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  color="primary"
                >
                  {activeStep === 2 ? "Save" : "Next >"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalLicense;
