export const getProvinceById = async (id, token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/provinsi/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data.provinsi;
  } catch (error) {
    console.error("Get Provinisi By ID error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getDistrictsByProvinceId = async (id, token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/kabupaten/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data.kabupaten;
  } catch (error) {
    console.error("Get Kabupaten By Provinsi ID error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getSubDistrictsByDistrictId = async (id, token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/kecamatan/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data.kecamatan;
  } catch (error) {
    console.error("Get Kecamatan By Kabupaten ID error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getVillagesBySubDistrictId = async (id, token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/desa/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data.desa;
  } catch (error) {
    console.error("Get Desa By Kecamatan ID error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getMasterRegion = async (token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/mregion", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data.desa;
  } catch (error) {
    console.error("Get Master Region error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getKecamatanByDesaId = async (token, id) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/kecamatanbydesaid/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.message;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Get Kecamatan By Desa ID error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};
