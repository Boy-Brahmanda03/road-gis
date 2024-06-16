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

export const getRuasJalanById = async (token, id) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/ruasjalan/" + id, {
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
    if (data.ruasjalan == null) {
      return new Error("Id Tidak Ditemukan");
    }
    console.log(data);
    return data.ruasjalan;
  } catch (error) {
    console.error("Get Ruas Jalan By Id error:", error.message);
    return error.message;
  }
};

export const addRuasJalan = async (token, paths, desa_id, kode_ruas, nama_ruas, panjang, lebar, eksisting_id, kondisi_id, jenisjalan_id, keterangan) => {
  console.log(desa_id);
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

export const deleteRuasJalan = async (token, id) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/ruasjalan/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Delete Ruas Jalan error:", error.message);
    return error.message;
  }
};

export const editRuasJalan = async (token, id, paths, desa_id, kode_ruas, nama_ruas, panjang, lebar, eksisting_id, kondisi_id, jenisjalan_id, keterangan) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/ruasjalan/" + id, {
      method: "PUT",
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
    console.error("Update Ruas Jalan error:", error.message);
    return error.message;
  }
};

export const getPerkerasanEksisting = async (token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/meksisting", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    return data.eksisting;
  } catch (error) {
    console.error("Perkerasan Eksisting error:", error.message);
    return error.message;
  }
};

export const getKondisiJalan = async (token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/mkondisi", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    return data.eksisting;
  } catch (error) {
    console.error("Kondisi Jalan error:", error.message);
    return error.message;
  }
};

export const getJenisJalan = async (token) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(url + "/mjenisjalan", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    return data.eksisting;
  } catch (error) {
    console.error("Jenis Jalan error:", error.message);
    return error.message;
  }
};
