/** @jsxImportSource @emotion/react */
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MyConfigProvider from "@/components/MyConfigProvider";
import AddFriends from "./index/components/AddFriends";
import indexStyles from "./index/style/indexStyle";
import btnGroupStyles from "./index/style/buttonGroupStyle"
import LogOutButton from "./index/components/LogOutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const ApiHeadersContext = createContext();
export {ApiHeadersContext}

export default function Home() {
  const [apiHeaders, setApiHeaders] = useState({ 
    "User-crendential": "",
    "user-Id": ""
  });
  const [userInFo, setUserInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    let sessionCredential = sessionStorage.getItem("user-credential");
let sessionUserInfo = JSON.parse(sessionStorage.getItem("user-info"));
if (
  !!sessionUserInfo &&
  typeof sessionUserInfo === "object" &&
  "userName" in sessionUserInfo &&
  "userId" in sessionUserInfo &&
  "displayId" in sessionUserInfo
) {
  if (JSON.stringify(sessionUserInfo) !== JSON.stringify(userInFo)) {
    setUserInfo(sessionUserInfo);
  }
}
    if (
      typeof sessionCredential == "string" &&
      sessionCredential !== "" &&
      sessionCredential !== apiHeaders["User-crendential"]
    ) {
      setApiHeaders({
        "User-crendential": sessionCredential,
        "user-Id": sessionUserInfo.userId,
      });
    } else if (sessionCredential !== apiHeaders["User-crendential"]) {
      router.push("/login");
    }

    
  });
  return (
    <MyConfigProvider>
      <ApiHeadersContext.Provider value={apiHeaders}>
        <div className="px-5" css={indexStyles.containerOuter}>
          <div
            className="w-100 h-100 line-2 round-md bg-prim d-flex"
            css={indexStyles.container}
          >
            <div
              className="line-e-1 bg-second d-flex flex-column"
              css={indexStyles.aside}
            >
              <div className="line-b-1 px-4 py-3">
                <div className="font-lg">{userInFo.userName}</div>
                <div className="text-disabled">@{userInFo.displayId}</div>
              </div>
              <div css={btnGroupStyles.container} className="mt-auto line-t-2">
                <div className="d-flex">
                  <div css={btnGroupStyles.btnwrapper}>
                    <LogOutButton />
                  </div>
                  <div
                    id="add-friends-btn"
                    css={btnGroupStyles.btnwrapper}
                  ></div>
                  <div css={btnGroupStyles.btnwrapper}>
                    <button css={btnGroupStyles.btn}>
                      <FontAwesomeIcon icon={faBell} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddFriends />
      </ApiHeadersContext.Provider>
    </MyConfigProvider>
  );
}
