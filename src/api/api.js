import axios from "axios";

const API = axios.create({
  baseURL: "https://patient-case-taking-backend.vercel.app",
});

export default API;