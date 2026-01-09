import api from "../lib/api";

export const getCommunityNotes = async (subject = "") => {
  const params = {};
  if (subject && subject !== "All") {
    params.subject = subject;
  }
  const response = await api.get("/community/notes", { params });
  return response.data.data.notes;
};

export const likeNote = async (noteId) => {
  const response = await api.post(`/community/notes/${noteId}/like`);
  return response.data.data;
};

export const addComment = async (noteId, text) => {
  const response = await api.post(`/community/notes/${noteId}/comment`, { text });
  return response.data.data;
};
