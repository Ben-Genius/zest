import api from "@/src/api/api";

export const getClassProfile = async () => {
  const response = await api.get("/class_profile");
  return response.data;
};
