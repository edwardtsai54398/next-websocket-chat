/** @jsxImportSource @emotion/react */
import { useState } from "react";
import Image from "next/image";
import styles from "./indexStyle";
import { ConfigProvider, Button } from "antd";
import globalTheme from "../styles/designToken/globals";
import buttonTheme from "../styles/designToken/button";
import modalTheme from "../styles/designToken/modal";
import formTheme from "../styles/designToken/form";
import { inputTheme } from "../styles/designToken/input";
import FunctionalButtonGroup from "./index/components/FunctionalButtonGroup/FunctionalButtonGroup";
import AddFriends from "./index/components/AddFriends";
import style from "./indexStyle";

export default function Home() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(true);
  return (
    <ConfigProvider
      theme={{
        token: globalTheme,
        components: {
          Button: buttonTheme,
          Modal: modalTheme,
          Form: formTheme,
          Input: inputTheme,
        },
      }}
    >
      <div className="px-5" css={style.containerOuter}>
        <div
          className="w-100 h-100 line-2 round-md bg-prim d-flex"
          css={style.container}
        >
          <div className="line-e-1 bg-second d-flex flex-column" css={style.aside}>
            <FunctionalButtonGroup />
          </div>
        </div>
      </div>
      <AddFriends />
    </ConfigProvider>
  );
}
