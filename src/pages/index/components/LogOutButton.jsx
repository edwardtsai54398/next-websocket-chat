/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import styles from "../style/buttonGroupStyle"
import { ApiHeadersContext } from "@/pages";
import { Button } from "antd";
import logOut from "@/lib/logOut";

export default function LogOutButton(){
  const apiHeaders = useContext(ApiHeadersContext)

  return(
    <Button onClick={logOut} ghost>
      <FontAwesomeIcon icon={faArrowRightToBracket} css={{transform:'rotate(180deg)'}}/>
      <span className="ms-2">Log out</span>
      </Button>
  )
}