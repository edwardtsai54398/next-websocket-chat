/** @jsxImportSource @emotion/react */
import { useState } from "react";
import Image from "next/image";
import styles from "./indexStyle";
import MyConfigProvider from "@/components/MyConfigProvider";
import FunctionalButtonGroup from "./index/components/FunctionalButtonGroup/FunctionalButtonGroup";
import AddFriends from "./index/components/AddFriends";
import style from "./indexStyle";

export default function Home() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(true);
  return (
    <MyConfigProvider>
      <div className="px-5" css={styles.containerOuter}>
        <div
          className="w-100 h-100 line-2 round-md bg-prim d-flex"
          css={style.container}
        >
          <div
            className="line-e-1 bg-second d-flex flex-column"
            css={styles.aside}
          >
            <FunctionalButtonGroup />
          </div>
        </div>
      </div>
      <AddFriends />
    </MyConfigProvider>
  );
}
