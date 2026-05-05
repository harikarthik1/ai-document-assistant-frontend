import API from "../lib/axios";

export const documentsService = {
  getAll: async () => {
    const res = await API.get("/documents");
    return res.data;
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteDocument: async (id: number) => {
    await API.delete(`/documents/${id}`);
  },

  askQuestion: async (id: number, question: string) => {
    const res = await API.post(`/documents/${id}/ask`, { question });
    return res.data;
  },

  getChats: async (id: number) => {
    const res = await API.get(`/chats/${id}`);
    return res.data;
  },

  deleteChats: async (id: number) => {
    await API.delete(`/chats/${id}`);
  },

  generateSummary: async (id: number) => {
    const res = await API.post(`/documents/${id}/summary`);
    return res.data;
  },
};