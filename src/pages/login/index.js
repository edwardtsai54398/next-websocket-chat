import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import MyConfigProvider from "@/components/MyConfigProvider.jsx";
import SignUpModal from "./components/SignUpModal.jsx";
import AddUserButton from "./components/AddUserButton.jsx";
import UserButton from "./components/UserButton.jsx";

export default function Login() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isLogInLoading, setLogInLoading] = useState(false);
  const [shouldUpdateLocalStorage, setUpdateLocalStorage] = useState(false);

  useEffect(() => {
    let users = JSON.parse(localStorage.getItem("userlist"));
    if (users) {
      setUserList(users);
    }
  }, []);
  useEffect(() => {
    if (shouldUpdateLocalStorage) {
      localStorage.setItem("userlist", JSON.stringify(userList));
      setShouldUpdateLocalStorage(false);
    }
  }, [userList, shouldUpdateLocalStorage]);

  const handleSignUpSuccess = (result) => {
    setUserList([...userList, result]);
    setUpdateLocalStorage(true);
  };
  const handleDeleteUser = (displayId) => {
    setUpdateLocalStorage(true);
    setUserList((prevList) =>
      prevList.filter((user) => user.displayId !== displayId)
    );
  };
  return (
    <MyConfigProvider>
      <div className="d-flex flex-center w-100 h-100">
        {userList.map((user, i) => {
          return (
            <UserButton
              key={user.displayId}
              user={user}
              userName={user.userName}
              displayId={user.displayId}
              disabled={isLogInLoading}
              setLogInLoading={setLogInLoading}
              onDeleteUser={handleDeleteUser}
              className="me-3"
            />
          );
        })}
        {userList.length < 3 ? (
          <AddUserButton
            onClick={() => {
              setSignUpModalOpen(true);
            }}
            disabled={isLogInLoading}
          />
        ) : null}
      </div>
      <SignUpModal
        open={isSignUpModalOpen}
        setModalOpen={setSignUpModalOpen}
        onSignupSuccess={handleSignUpSuccess}
      ></SignUpModal>
    </MyConfigProvider>
  );
}
