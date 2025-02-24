import React, { useState } from "react";
import { Admin_users, app_comp } from "~/configs";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";

export const SuperAdmin_users = () => {
  const [value, Setvalue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState(Admin_users);
  const [open, setOpenModal] = useState(false);
  const [openUser, setOpenModalAdd] = useState(false);
  const [openDelete, setOpenModalDelete] = useState(false);

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    Setvalue(query);
    const filtered = Admin_users.filter((comp) =>
      comp.fullname?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
  };

  const EditOpenModal = () => {
    setOpenModal(true);
  };
  const AddModalOpen = () => {
    setOpenModalAdd(true);
  };
  const CloseModal = () => {
    setOpenModal(false);
    setOpenModalAdd(false);
    setOpenModalDelete(false);
  };
  const DeleteModal = () => {
    setOpenModalDelete(true);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <TextField
            value={value}
            onChange={searchFunctions}
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
          <div
            onClick={AddModalOpen}
            className="gap-2 bg-white w-[130px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" /> Add new user
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#ccdbf7]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Full name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Computer name</th>
                <th className="p-3">Degistered date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            {openUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[550px] h-[320px]">
                  <h2 className="text-xl font-semibold mb-4">Add new user</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-700">Full name</label>
                      <input
                        type="text"
                        defaultValue="Morgan Master"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Email</label>
                      <input
                        type="email"
                        defaultValue="david.wilson@data.com"
                        className="w-full border rounded-lg p-2 mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700">Password</label>
                    <input
                      type="password"
                      placeholder="password"
                      className="w-[50%] border rounded-lg p-2 mt-1"
                    />
                  </div>

                  <div className="flex justify-end items-center mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={CloseModal}
                        className="border px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <tbody>
              {filteredComputers.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 p-4 text-sm hover:bg-gray-50"
                >
                  <td className="p-3">{item.fullname}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.computer_name}</td>
                  <td className="p-3">{item.degistered_date}</td>
                  <td
                    className="p-3 text-[#1A79D8] cursor-pointer"
                    onClick={EditOpenModal}
                  >
                    edit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[550px] h-[320px]">
            <h2 className="text-xl font-semibold mb-4">User settings</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700">Full name</label>
                <input
                  type="text"
                  defaultValue="Morgan Master"
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue="david.wilson@data.com"
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                placeholder="password"
                className="w-[50%] border rounded-lg p-2 mt-1"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <button onClick={DeleteModal} className="text-red-500 text-sm font-medium">
                Delete user
              </button>
              <div className="flex gap-2">
                <button onClick={CloseModal} className="border px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
          <div className="className = bg-[#e7ecf8] rounded-2xl shadow-lg text-center p-6 w-[340px] h-[204px]">
            <p className="font-500 text-[20px]">Are you sure you want to delete user?</p>
            <p className="font-400 text-[14px] text-[grey]">
              Confirming process cancellation the <br /> installation
            </p>
            <div className="flex gap-2 mt-5 justify-center">
              <button
                onClick={CloseModal}
                className="border-[solid] font-500 text-[14px] text-[#1A79D8] border-[1px] border-[grey] px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button className="text-red font-500 text-[14px] px-6 py-2 border-[solid] border-[1px] border-[grey] rounded-lg">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
