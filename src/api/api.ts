import axios from "axios";
import { Platform } from "react-native";
import { BASE_URL } from "../config";

const getBaseURL = () => {
  if (BASE_URL) return BASE_URL;
  return Platform.OS === "ios" ? "http://localhost:3000" : "http://10.0.2.2:3000";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000 // Increased timeout for network requests
});
export default api;
