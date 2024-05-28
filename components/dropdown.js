"use client";

import { getProvinceById, getDistrictsByProvinceId, getSubDistrictsByDistrictId, getVillagesBySubDistrictId } from "@/lib/region"; // Update import to include districts API
import { useEffect, useState } from "react";

const Option = ({ datas, onSelect }) => {
  if (!datas || datas.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="w-full right-0 z-10 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
      {datas.map((item) => (
        <div key={item.id} className="py-1 w-fit" role="none">
          <button className="text-gray-700 block px-4 py-2 text-sm w-full text-left" role="menuitem" tabIndex="-1" onClick={() => onSelect(item)}>
            {item.value}
          </button>
        </div>
      ))}
    </div>
  );
};

export default function Dropdown({ title, handleSelect }) {
  const [showProvince, setShowProvince] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showSubDistrict, setShowSubDistrict] = useState(false);
  const [showVillage, setShowVillage] = useState(false);
  const [token, setToken] = useState();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [village, setVillage] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token != null && token !== undefined) {
      getProvinceById(1, token).then((data) => {
        setProvinces(data);
      });
    }
  }, [token]);

  useEffect(() => {
    if (selectedProvince) {
      getDistrictsByProvinceId(selectedProvince.id, token).then((data) => {
        setDistricts(data);
        setShowDistrict(true); // Show the district dropdown
      });
    }
  }, [selectedProvince, token]);

  useEffect(() => {
    if (selectedDistrict) {
      getSubDistrictsByDistrictId(selectedDistrict.id, token).then((data) => {
        setSubDistricts(data);
        setShowSubDistrict(true);
      });
    }
  }, [selectedDistrict, token]);

  useEffect(() => {
    if (selectedSubDistrict) {
      getVillagesBySubDistrictId(selectedSubDistrict.id, token).then((data) => {
        setVillage(data);
        setShowVillage(true);
      });
    }
  }, [selectedSubDistrict, token]);

  const handleSubDistrictsSelect = (subDistrict) => {
    setSelectedSubDistrict(subDistrict);
    setShowSubDistrict(false);
  };

  const handleVillage = (village) => {
    setSelectedVillage(village);
    setShowVillage(false);
    handleSelect(village);
  };

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setShowProvince(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowDistrict(false);
  };

  const showSubDistricHandler = () => {
    setShowSubDistrict(!showSubDistrict);
  };

  const showVillageHandler = () => {
    setShowVillage(!showVillage);
  };

  const showProvinceHandler = () => {
    setShowProvince(!showProvince);
  };

  const showDistrictHandler = () => {
    setShowDistrict(!showDistrict);
  };

  return (
    <div className="w-full text-left">
      <div className="w-full">
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={showProvinceHandler}
        >
          {selectedProvince ? selectedProvince.value : title}
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {showProvince && <Option datas={provinces} onSelect={handleProvinceSelect} />}

      {selectedProvince && (
        <div className="mt-2">
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="district-menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={showDistrictHandler}
          >
            {selectedDistrict ? selectedDistrict.value : "Kabupaten"}
            <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {showDistrict && <Option datas={districts} onSelect={handleDistrictSelect} />}
        </div>
      )}

      {selectedDistrict && (
        <div className="mt-2">
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="district-menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={showSubDistricHandler}
          >
            {selectedSubDistrict ? selectedSubDistrict.value : "Kecamatan"}
            <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {showSubDistrict && <Option datas={subDistricts} onSelect={handleSubDistrictsSelect} />}
        </div>
      )}

      {selectedSubDistrict && (
        <div className="mt-2">
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="district-menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={showVillageHandler}
          >
            {selectedVillage ? selectedVillage.value : "Desa"}
            <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {showVillage && <Option datas={village} onSelect={handleVillage} />}
        </div>
      )}
    </div>
  );
}
