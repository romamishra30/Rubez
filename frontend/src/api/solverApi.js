import axios from "axios";

const API_URL = "http://localhost:5000";

export async function solveCube(scramble) {
  const response = await axios.post(`${API_URL}/solve`, {
    scramble,
  });

  return response.data;
}