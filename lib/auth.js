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
