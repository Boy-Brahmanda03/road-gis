export const login = async (email, password) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);
    const res = await fetch(url + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return err.meta.message;
    }

    const data = await res.json();
    return data.meta;
  } catch (error) {
    console.error("Login error:", error);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const register = async (regName, email, password) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);
    const res = await fetch(url + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: regName, email, password }),
    });
    const data = await res.json();
    console.log(data);
    if (data.meta.code === 200 && data.meta.status === "failed") {
      return data.meta.message;
    }

    return data.meta;
  } catch (error) {
    console.error("Register error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const logout = async (token) => {
  try {
    console.log(token);
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);
    const res = await fetch(url + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      return err.meta.message;
    }
    const data = await res.json();
    return data.meta;
  } catch (error) {
    console.error("Logout error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};

export const getUser = async (token) => {
  try {
    console.log(token);
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);
    const res = await fetch(url + "/user", {
      method: "GET",
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
    return data.data;
  } catch (error) {
    console.error("GetUser error:", error.message);
    return { error: error.message || "An unknown error occurred." };
  }
};
