import API from "../lib/axios";

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const res = await API.post("/auth/login", { email, password });

    const token = res.data.token;

    localStorage.setItem("token", token);

    return token;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await API.post("/auth/register", { name, email, password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};