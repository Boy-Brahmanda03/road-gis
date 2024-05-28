"use client";
import { useState } from "react";

export default function DropdownRoad({ data, handleSelected, title }) {
  const [selectedValue, setSelectedValue] = useState();

  const handleOption = (e) => {
    setSelectedValue(e.target.value);
    handleSelected(e.target.value);
  };

  console.log(data);
  return (
    <>
      <div className="w-full">
        <select name="options" id="options" value={selectedValue} onChange={handleOption}>
          <option>{title}</option>
          {data &&
            data.map((value) => (
              <option key={value.id} value={value.id} className="w-full right-0 z-10 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {value.value}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}
