import { RiDownloadLine } from "react-icons/ri";
import ModalLicenseTable from "~/configs/license";
import { ModalLicenseType } from "~/types/configs/Liceses";

const ModalLicense = () => {
  return (
    <div className="overflow-x-auto p-4 bg-gray-100 h-[100vh]">
      <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="border-b border-gray-300 text-gray-600 text-sm bg-[#ccdbf7]">
            <th className="p-3">Product name</th>
            <th className="p-3">Server address</th>
            <th className="p-3">Computers count</th>
            <th className="p-3">Uploaded date</th>
            <th className="p-3">Valid until</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ModalLicenseTable.map((item: ModalLicenseType) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 text-sm hover:bg-gray-50"
            >
              <td className="p-3 flex items-center gap-2">
                <img className="w-[30px] h-[30px]" src={item.icons} alt="icon" />
                {item.name}
              </td>
              <td className="p-3">{item.adress}</td>
              <td className="p-3">{item.computer_count}</td>
              <td className="p-3">{item.uploaded}</td>
              <td className="p-3">{item.valid}</td>
              <td className="p-3 flex items-center cursor-pointer gap-1 mb-3 text-[#1A79D8]">
                {item.valid_upload}
                <RiDownloadLine size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModalLicense;
