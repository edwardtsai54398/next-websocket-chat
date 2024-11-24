/** @jsxImportSource @emotion/react */
import { createContext, useEffect, useState, useReducer, useRef } from "react";
import { useRouter } from "next/router";
import MyConfigProvider from "@/components/MyConfigProvider";
import indexStyles from "./index/style/indexStyle";
import btnGroupStyles from "./index/style/buttonGroupStyle";
import LogOutButton from "./index/components/LogOutButton";
import Avatar from "@/components/Avatar";
import { Popover, Button } from "antd";
import SearchUsers from "./index/components/SearchUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import NotificationPopover from "./index/components/NotificationPopover";
import ChatApp from "@/pages/index/components/ChatApp";

const ApiHeadersContext = createContext();
export { ApiHeadersContext };

export default function Home() {
  const [apiHeaders, setApiHeaders] = useState({
    "user-credential": "",
    "user-id": "",
  });
  const [userInFo, setUserInfo] = useState({});
  const [isSearchUserOpen, setSearchUserOpen] = useState(false);
  const chatAppRef = useRef(null);

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
        "user-id": sessionUserInfo.userId,
      });
    } else if (sessionCredential !== apiHeaders["User-crendential"]) {
      router.push("/login");
    }
  });

  const handleSearchUserClose = (userId) => {
    console.log("handleSearchUserClose", userId);
  };
  const handleAccpetFriend = () => {
    if (chatAppRef.current) {
      chatAppRef.current.getChatList();
    }
  };
  const handleAddFriendSuccess = () => {
    if (chatAppRef.current) {
      chatAppRef.current.getChatList();
    }
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
              <NotificationPopover
                onAcceptFriend={handleAccpetFriend}
              ></NotificationPopover>
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
            <ChatApp ref={chatAppRef}/>
          </div>
        </div>
        <SearchUsers
          isOpen={isSearchUserOpen}
          setSearchUserOpen={setSearchUserOpen}
          onClose={handleSearchUserClose}
          onAddFriendSuccess={handleAddFriendSuccess}
        />
      </ApiHeadersContext.Provider>
    </MyConfigProvider>
  );
}
