import ModalLicenseTable from "~/configs/license";
import { ModalLicenseType } from "~/types/configs/Liceses";
import { MdCloudUpload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const ModalLicense = () => {
  const [isOpen, SetIsopen] = useState<boolean>(false);
  return (
    <div className="p-4 bg-gray-100 min-h-screen ">
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
                className={`border-b border-[gray-200] text-sm ${index % 2 == 0 ? "bg-[grey-50]" : "bg-[#ccdaf8]"}`}
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
                  onClick={() => SetIsopen(true)}
                >
                  <MdCloudUpload size={20} />
                  {item.valid_upload}
                </td>
                {!isOpen ? null : (
                  <div>
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="bg-white rounded-lg shadow-lg p-5 w-[400px]">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Licenses</h2>
                          <IoMdClose
                            className="cursor-pointer text-[20px]"
                            onClick={() => SetIsopen(false)}
                          />
                        </div>
                        <div className="border-dashed  rounded-lg p-10 text-center bg-gray-50">
                          <MdCloudUpload size={30} className="m-auto text-[grey]" />

                          <p className="text-gray-500">
                            Drop your files here, or
                            <span className="text-blue-500 cursor-pointer">
                              click to browse
                            </span>
                          </p>
                          <p className="text-sm text-gray-400">
                            Up to 10 files, 100MB total limit
                          </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={() => SetIsopen(false)}
                          >
                            Cancel
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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
