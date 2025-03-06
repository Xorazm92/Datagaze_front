import React, { useState } from "react";
import { app_comp } from "~/configs";
import TextField from "@mui/material/TextField";
import { FormControl, Select, MenuItem } from "@mui/material";
import { FilterList } from "@mui/icons-material";

const Computers_app = () => {
  const [value, Setvalue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState(app_comp);

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    Setvalue(query);
    const filtered = app_comp.filter((comp) =>
      comp.Product_name?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
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
          <div className="flex gap-2">
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                size="small"
                displayEmpty
                defaultValue=""
                sx={{
                  height: 36,
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
          </div>
        </div>
        <div className="max-h-[600px]  overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#ccdbf7]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Product name</th>
                <th className="p-3">File size</th>
                <th className="p-3">Type</th>
                <th className="p-3">Installed date</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredComputers.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 p-4 text-sm ${index % 2 == 0 ? "bg-[grey-50]" : "bg-[#ccdaf8]"}`}
                >
                  <td className="p-3">{item.Product_name}</td>
                  <td className="p-3">{item.File_size}</td>
                  <td className="p-3">{item.Type}</td>
                  <td className="p-3">{item.Instaled_date}</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-[#1A79D8] cursor-pointer">Update</td>
                  <td className="p-3 text-[red] cursor-pointer">Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Computers_app;
