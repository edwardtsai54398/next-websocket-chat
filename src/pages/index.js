/** @jsxImportSource @emotion/react */
import { createContext, useEffect, useState, forwardRef } from "react";
import { useRouter } from "next/router";
import MyConfigProvider from "@/components/MyConfigProvider";
import AddFriends from "./index/components/AddFriends";
import indexStyles from "./index/style/indexStyle";
import btnGroupStyles from "./index/style/buttonGroupStyle";
import LogOutButton from "./index/components/LogOutButton";
import Avatar from "@/components/Avatar";
import { Popover, Button } from "antd";
import SearchUsers from "./index/components/SearchUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const ApiHeadersContext = createContext();
export { ApiHeadersContext };

export default function Home() {
  const [apiHeaders, setApiHeaders] = useState({
    "user-credential": "",
    "user-id": "",
  });
  const [userInFo, setUserInfo] = useState({});
  const [isSearchUserOpen, setSearchUserOpen] = useState(false);

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

  const handleSearchUserClose = (userId) => {
    console.log("handleSearchUserClose", userId);
  };

  return (
    <MyConfigProvider>
      <ApiHeadersContext.Provider value={apiHeaders}>
        <div className="layout-content">
          <header className="line-b-1 py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="logo"></div>
            <div className="d-flex align-items-center">
              <Button
                onClick={() => {
                  setSearchUserOpen(true);
                }}
                className="me-3"
              >
                <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
              </Button>
              <Popover
                placement="bottomLeft"
                trigger="click"
                content={
                  <div>
                    <div className="d-flex align-items-center">
                      <Avatar name={userInFo.userName} />
                      <div className="ms-3 pe-2">
                        <div className="font-lg">{userInFo.userName}</div>
                        <div className="text-disabled">
                          @{userInFo.displayId}
                        </div>
                      </div>
                    </div>
                    <div className="my-3 line-b-1"></div>
                    <LogOutButton />
                  </div>
                }
              >
                <Avatar name={userInFo.userName} />
              </Popover>
            </div>
          </header>
          <div className="layout-content">
            <div className="layout-inline">
              <div className="line-e-1" css={indexStyles.aside}>
                <div className="h-100"></div>
              </div>
              <div className="layout-inline"></div>
            </div>
          </div>
        </div>
        <SearchUsers
          isOpen={isSearchUserOpen}
          setSearchUserOpen={setSearchUserOpen}
          onClose={handleSearchUserClose}
        />
      </ApiHeadersContext.Provider>
    </MyConfigProvider>
  );
}
