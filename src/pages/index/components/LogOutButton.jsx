/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import styles from "../style/buttonGroupStyle"
import { ApiHeadersContext } from "@/pages";

export default function LogOutButton(){
  const apiHeaders = useContext(ApiHeadersContext)
  const [isLoading, setLoading ] = useState(false)


  const router = useRouter()
  const logOut = () => {
  setLoading(true)
    axios({
      url: process.env.NEXT_PUBLIC_API_LOGOUT,
      method: 'POST',
      headers: apiHeaders
    }).then((res)=>{
      console.log("logOut");
      router.push("/login")
    }).finally(()=>{
      setLoading(false)
    })
  }

  return(
    <button css={[styles.btn, styles.logoutBtn]} onClick={logOut}><FontAwesomeIcon icon={faArrowRightToBracket}/></button>
  )
}