import axios from "axios";
import { BASE_URL } from "../config";
import { Platform } from "react-native";


const api = axios.create({
  baseURL: BASE_URL || Platform.OS === "ios" ? "http://localhost:3000" : "http://10.0.2.2:3000",
  timeout: 5000
});

export default api;
