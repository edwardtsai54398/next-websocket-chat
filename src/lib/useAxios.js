import axios from "axios";
import logOut from "./logOut";

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 403) {
      logOut();
    }
    return Promise.reject(error.response);
  }
);

async function useAxios(method, url, headers = null, body = null, abortSignal = null){
  return axiosInstance({
    method,
    url,
    headers,
    data: body,
    signal: abortSignal
  })
}

export default useAxios;