import { useState } from "react";
import { computers } from "~/configs";
import { ComputerType } from "~/types/configs/computers";
import { Progress } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { IoMdCloseCircle } from "react-icons/io";

const Computers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<ComputerType | null>(null);
  const [tabValue, setTabValue] = useState("os");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
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
    <div className="p-4 bg-gray-100 min-h-screen overflow-x-auto p-4 bg-gray-100 h-[100vh]">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600 text-sm bg-[#ccdbf7]">
              <th className="p-3">#</th>
              <th className="p-3">Computer name</th>
              <th className="p-3">Operation System (OS)</th>
              <th className="p-3">IP address</th>
              <th className="p-3">Activity</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {computers.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 p-4 text-sm hover:bg-gray-50"
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.OS}</td>
                <td className="p-3">{item.adress}</td>
                <td
                  className={`p-3 ${item.active === "Active" ? "text-green-600" : "text-gray-500"}`}
                >
                  {item.active}
                </td>
                <td
                  className="p-3 text-blue-500 text-[15px] cursor-pointer"
                  onClick={() => showModal(item)}
                >
                  About PC
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[80vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <Box sx={{ width: "100%" }}>
              <div className="flex justify-end">
                <IoMdCloseCircle
                  size={24}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                />
              </div>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab value="os" label="OS" />
                <Tab value="processor" label="Processor" />
                <Tab value="network" label="Network" />
              </Tabs>
            </Box>

            <div className="mt-4">
              {tabValue === "os" && (
                <div className="grid grid-cols-2 gap-3">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Operation System</p>
                    <p className="text-lg font-bold">{selected.OS}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Platform</p>
                    <p className="text-lg font-bold">{selected.platform}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Build number</p>
                    <p className="text-lg font-bold">{selected.build_number}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Version</p>
                    <p className="text-lg font-bold">{selected.version}</p>
                  </span>
                </div>
              )}
              {tabValue === "processor" && (
                <div className="grid grid-cols-2 gap-3">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">CPU</p>
                    <p className="text-lg font-bold">{selected.CPU}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Model</p>
                    <p className="text-lg font-bold">{selected.model}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">Cores</p>
                    <p className="text-lg font-bold">{selected.cores}</p>
                  </span>
                </div>
              )}
              {tabValue === "network" && (
                <div className="grid grid-cols-2 gap-3">
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">NIC name</p>
                    <p className="text-lg font-bold">{selected.Nic_name}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">IP Address</p>
                    <p className="text-lg font-bold">{selected.adress}</p>
                  </span>
                  <span className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm">IP Address</p>
                    <p className="text-lg font-bold">{selected.adress}</p>
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

            <div className="mt-4">
              <label className="block font-semibold">
                RAM <span className="text-gray-500">(8GB)</span>
              </label>
              <Progress percent={selected.Ram} />
              <label className="block font-semibold">
                Disk D <span className="text-gray-500">(1TB)</span>
              </label>
              <Progress percent={selected.Disk_D} />
              <label className="block font-semibold">
                Disk C <span className="text-gray-500">(1TB)</span>
              </label>
              <Progress percent={selected.Disk_C} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Computers;
