import { useState } from "react";
import { Button, Modal } from "antd";
import SignUpModal from "./SignUpModal.jsx";

export default function Login() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isFormSending, setFormSending] = useState(false)

  const handleSignUpClick = () => {};
  return (
    <>
      <div className="d-flex flex-center">
        <Button
          onClick={() => {
            setSignUpModalOpen(true);
          }}
        >
          Open Modal
        </Button>
      </div>
      <SignUpModal
        open={isSignUpModalOpen}
        setModalOpen={setSignUpModalOpen}
        onSignUpClick={handleSignUpClick}
        loading={isFormSending}
      ></SignUpModal>
    </>
  );
}
