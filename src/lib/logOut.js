import axios from "axios";
import Router from "next/router";
// import { ws } from "./socket-client";

export default function () {
  // const router = useRouter();
  axios({
    url: process.env.NEXT_PUBLIC_API_LOGOUT,
    method: "POST",
  }).then((res) => {
    console.log("logOut");
    Router.push("/login");
    // ws.close();
  });
}
