export const getMasterRuasJalan = async (token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/ruasjalan", {
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
    console.log(data);
    return data.ruasjalan;
  } catch (error) {
    console.error("Get Master Ruas Jalan error:", error.message);
    return error.message;
  }
};

export const getRuasJalanById = async (token) => {};

export const addRuasJalan = async (token, paths, desa_id, kode_ruas, nama_ruas, panjang, lebar, eksisting_id, kondisi_id, jenisjalan_id, keterangan) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/ruasjalan", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paths, desa_id, kode_ruas, nama_ruas, panjang, lebar, eksisting_id, kondisi_id, jenisjalan_id, keterangan }),
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Create Ruas Jalan error:", error.message);
    return error.message;
  }
};
