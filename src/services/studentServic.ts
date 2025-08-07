
import api from "@/src/api/api";
import { StudentDetails } from "@/src/types";

export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getStudentById = async (id: string): Promise<StudentDetails> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};