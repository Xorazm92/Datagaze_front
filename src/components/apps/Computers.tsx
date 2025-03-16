import React, { useState, useEffect } from "react";
import { ComputersType } from "~/types/configs/computers";
import { FiColumns } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import { FormControl, Select, MenuItem } from "@mui/material";
import Computers_app from "./Computer_app";
import { useQueryApi } from "~/hooks/useQuery";
import { useSearchParams } from "react-router-dom";
import About_fc from "../modal_app/about_fc";

const Computers = () => {
  const [params, setSearchparams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [selectedId, setSelected] = useState<string | null>(null);
  const [selectedTableId, setSelectedTable] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState<ComputersType[]>([]);
  const [allComputers, setAllComputers] = useState<ComputersType[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const Status = params.get("status") || "all";

  const { data, isLoading, isError } = useQueryApi({
    url: `/api/1/device/computers?page=${page + 1}&limit=${rowsPerPage}`,
    pathname: "computers"
  });

  const showModal = (id: string) => {
    setOpenModal(true);
    setSelected(id);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelected(null);
  };
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAllComputers(data);
      filterComputers(data, Status, value);
    }
  }, [data]);

  const filterComputers = (
    computers: ComputersType[],
    status: string,
    search: string
  ) => {
    let filtered = [...computers];

    if (status !== "all") {
      filtered = filtered.filter((comp) => comp.status === status);
    }

    if (search) {
      filtered = filtered.filter((comp) =>
        comp?.computer_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredComputers(filtered);
  };

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    filterComputers(allComputers, Status, query);
    setPage(0);
  };

  const handleFilterChange = (event: any) => {
    const newStatus = event.target.value;
    setSearchparams({ status: newStatus });
    filterComputers(allComputers, newStatus, value);
    setPage(0);
  };

  const apptable = (id: string) => {
    setOpenTable(true);
    setSelectedTable(id);
  };

  const paginatedComputers: ComputersType[] = filteredComputers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredComputers.length / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {openTable && selectedTableId && <Computers_app id={selectedTableId || ""} />}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e2eafb] w-full flex items-center justify-between h-[64px] px-4">
          <TextField
            value={value}
            onChange={searchFunctions}
            sx={{ "& .MuiInputLabel-root": { fontSize: "18px" } }}
            placeholder="Search"
            slotProps={{
              input: {
                type: "search",
                className: "w-[200px] h-[30px] bg-white flex items-center justify-center"
              }
            }}
          />
          <div className="flex gap-2">
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                size="small"
                value={Status}
                onChange={handleFilterChange}
                displayEmpty
                renderValue={(selected) => (selected === "all" ? "All" : selected)}
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
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
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
                  <FiColumns /> Customize columns
                </MenuItem>
                <MenuItem value="column1">Column 1</MenuItem>
                <MenuItem value="column2">Column 2</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600 text-sm bg-[#ccdaf8]">
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
              {isLoading || isError
                ? "Loading..."
                : paginatedComputers.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 p-4 text-sm ${
                        index % 2 === 0 ? "bg-[grey-50]" : "bg-[#ccdaf8]"
                      }`}
                    >
                      <td className="p-3">
                        <input type="checkbox" />
                      </td>
                      <td className="p-3">{index + 1}</td>
                      <td
                        className="p-3 cursor-pointer"
                        onClick={() => apptable(item.id)}
                      >
                        {item.computer_name}
                      </td>
                      <td className="p-3">{item.os}</td>
                      <td className="p-3">{item.ip_address}</td>
                      <td>
                        <p
                          className={`${
                            item.status === "active"
                              ? "bg-[#DCFCE7] flex text-green-600 w-[49px] h-[20px] items-center justify-center p-2 rounded-[8px] text-[12px]"
                              : "text-[grey] bg-[#dfe8fb] flex w-[49px] h-[20px] text-[12px] items-center justify-center px-2 py-2 rounded-[8px]"
                          }`}
                        >
                          {item.status}
                        </p>
                      </td>
                      <td
                        className="p-3 text-blue-500 cursor-pointer"
                        onClick={() => showModal(item.id)}
                      >
                        About PC
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-t">
          <div>
            <span>Rows per page: </span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div>
            <span>
              {page * rowsPerPage + 1}–
              {Math.min((page + 1) * rowsPerPage, filteredComputers.length)} of{" "}
              {filteredComputers.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i)}
                className={`px-3 py-1 border rounded ${page === i ? "bg-gray-200" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      {openModal && selectedId && <About_fc id={selectedId} close={closeModal} />}
    </div>
  );
};

export default Computers;
