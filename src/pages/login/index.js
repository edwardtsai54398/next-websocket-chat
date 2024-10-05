import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import MyConfigProvider from "@/components/MyConfigProvider.jsx";
import SignUpModal from "./components/SignUpModal.jsx";
import AddUserButton from "./components/AddUserButton.jsx";
import UserButton from "./components/UserButton.jsx";

export default function Login() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isFormSending, setFormSending] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let users = JSON.parse(localStorage.getItem("userlist"));
    if (users) {
      setUserList(users);
    }
  }, []);

  const handleSignUpSuccess = (result) => {
    localStorage.setItem("userlist", JSON.stringify([...userList, result]));
    setUserList([...userList, result]);
  };
  return (
    <MyConfigProvider>
      <div className="d-flex flex-center w-100 h-100">
        {userList.map((user) => {
          return (
            <UserButton
              key={user.displayId}
              userName={user.userName}
              displayId={user.displayId}
              className="me-3"
            />
          );
        })}
        {userList.length < 3 ? (
          <AddUserButton
            onClick={() => {
              setSignUpModalOpen(true);
            }}
          />
        ) : null}
      </div>
      <SignUpModal
        open={isSignUpModalOpen}
        setModalOpen={setSignUpModalOpen}
        onSignupSuccess={handleSignUpSuccess}
        loading={isFormSending}
      ></SignUpModal>
    </MyConfigProvider>
  );
}
