import Item from "antd/es/list/Item";
import { computers } from "~/configs";
import { ComputerType } from "~/types/configs/computers";

const Computers = () => {
  const [openModal, SetopenModal] = useState(false);
  const [Select, Setselect] = useState<ComputerType | null>(null);

  const Showmodal = (item: ComputerType) => {
    SetopenModal(true);
    Setselect(item);
  };
  const CloseModal = () => {
    SetopenModal(false);
    Setselect(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Filters</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Customize columns</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th>#</th>
              <th className="p-3">Computer name</th>
              <th className="p-3">Operation System (OS)</th>
              <th className="p-3">IP address</th>
              <th className="p-3">Activity</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {computers.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" name="all" className="cursor-pointer" />
                </td>
                <td>{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.OS}</td>
                <td className="p-3">{item.adress}</td>
                <td
                  className={`p-3 ${item.active === "Active" ? " text-green-600" : "text-[grey]"}`}
                >
                  {item.active}
                </td>
                <td
                  className="p-3 text-blue-500 cursor-pointer"
                  onClick={() => Showmodal(item)}
                >
                  {item.about}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {Select && openModal && (
          <div
            key={Select.id}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-4">{Select.name}</h2>
              <p>
                <strong>ID:</strong> {Select.id}
              </p>
              <p>
                <strong>OS:</strong> {Select.OS}
              </p>
              <p>
                <strong>IP:</strong> {Select.adress}
              </p>
              <p
                className={`font-semibold ${Select.active === "Active" ? "text-green-600" : "text-red-500"}`}
              >
                {Select.active}
              </p>
              <button
                onClick={() => CloseModal()}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-gray-600">
        <span>
          Rows per page:
          <select className="border p-1 rounded-md">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded-lg">&lt;</button>
          <button className="px-3 py-1 bg-gray-300 rounded-lg">1</button>
          <button className="px-3 py-1 bg-gray-200 rounded-lg">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Computers;
