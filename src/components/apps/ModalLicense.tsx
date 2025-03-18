import React, { useState } from "react";
import ModalLicenseTable from "~/configs/license";
import { ModalLicenseType } from "~/types/configs/Liceses";
import { RiUploadCloud2Fill } from "react-icons/ri";

import { IoCloseCircleSharp } from "react-icons/io5";

const ModalLicense = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="w-full text-left border-collapse bg-white shadow-md !rounded-lg">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600 text-sm bg-[#d4e0f9]">
              <th className="p-3">Product name</th>
              <th className="p-3">Server address</th>
              <th className="p-3">Computers count</th>
              <th className="p-3">Uploaded date</th>
              <th className="p-3">Valid until</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ModalLicenseTable.map((item: ModalLicenseType, index) => (
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
                <td className="p-3">{item.adress}</td>
                <td className="p-3">{item.computer_count}</td>
                <td className="p-3">{item.uploaded}</td>
                <td className="p-3">{item.valid}</td>
                <td
                  className="p-3 flex items-center cursor-pointer gap-1 mb-3 text-[#1A79D8]"
                  onClick={() => setIsOpen(true)}
                >
                  <RiUploadCloud2Fill size={20} />
                  {item.valid_upload}
                </td>
                {!isOpen ? null : (
                  <div>
                    <div className="fixed inset-0 flex items-center justify-center h-[100vh]  bg-opacity-50">
                      <div className="bg-[#d4dffa] rounded-lg border-[solid] relative   border-[1px] border-[grey] flex flex-col justify-between  p-3 w-[330px] pt-[70px]">
                        <div className="flex items-center border-b w-full absolute top-0 left-0 h-[34px]  border-gray-300 text-gray-600 text-sm bg-[white] p-3 rounded-t-lg">
                          <IoCloseCircleSharp
                            className="cursor-pointer text-[15px] mr-[10px]"
                            onClick={() => setIsOpen(false)}
                          />
                          <h2 className="font-semibold">Licenses</h2>
                        </div>
                        <div className="p-5 text-center bg-gray-50 flex-1  m-auto w-[300px] rounded-[8px]  flex flex-col gap-3">
                          <RiUploadCloud2Fill
                            size={30}
                            className="m-auto text-gray-600"
                          />
                          <p className="text-gray-500">
                            Drop your files here, or
                            <span className="text-[#1A79D8] cursor-pointer">
                              click to browse
                            </span>
                          </p>
                          <p className="text-sm text-gray-400">
                            Up to 10 files, 100MB total limit
                          </p>
                        </div>
                        <div className="flex justify-end gap-3 py-5 rounded-b-lg">
                          <button
                            className="px-4 py-2 bg-[white] rounded-lg text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </button>
                          <button className="px-4 py-2 bg-[#1A79D8] text-white rounded-lg text-sm">
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalLicense;
