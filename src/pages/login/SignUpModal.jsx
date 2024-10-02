import { useState,useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";
import axios from "axios";

export default function SignUpModal({ open, setModalOpen, loading, onSignupClick }) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(true)

  const [formRef] = Form.useForm()
  const idRules = [
    {
      required: true,
      message: 'Please input your username!',
    },
    {
      max:10,
      message: 'Up to 10 characters'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(){}\-\_\/])[A-Za-z\d!@#$%^&*(){}\-\_\/]{8,16}$/,
      message: 'Password must be 8-16 characters long and include letters, numbers, and symbols',
    }
  ]
  const initialValues = {
    username: "Edward",
    displayId: "crank_0398"
  }

  const handleFormItemOnChange = (val) => {
    let formValues = formRef.getFieldValue()
    if(formValues.username && formValues.displayId && formValues.username !== '' && formValues.displayId !== ''){
      setSubmitDisabled(false)
    }else{
      setSubmitDisabled(true)
    }
    
  }
  
  const createUser = (val) => {
    //發出onSignUpClick並傳送值
    console.log('onFinish', val);
    let api = '/api/user/create_user'
    axios.post(api,formRef.getFieldValue())
      .then((res)=>{
        console.log(res);
        setSubmitDisabled(true)
        setModalOpen(false)
      })
  }
  useEffect(() => {
    if (!open) {
      formRef.resetFields(); // 只在 open 變為 false 時重置表單
    }
  }, [open, formRef]);
  
  return (
    <Modal
      open={open}
      closable={false}
      title={"Sign up"}
      footer={[
        <Button key="cancel"
          onClick={() => {
            setModalOpen(false);
          }}
          ghost
          >
          Cancel
        </Button>,
        <Button key="sign-up" type="primary" disabled={isSubmitDisabled} onClick={()=>{formRef.submit()}}>
          Sign up
        </Button>,
      ]}
    >
      <Form
        form={formRef}
        labelCol={{
          span: 5,
          offset: 1
        }}
        wrapperCol={{
          span: 18,
          offset: 0.5
        }}
        labelAlign="left"
        disabled={loading}
        onFinish={createUser}
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item 
          label="Username" 
          name="username" 
          validateTrigger="onBlur"
          rules={[
            {required: true, message:'Please input your username!'},
            {max:10, }
          ]} 
          onChange={handleFormItemOnChange}
        >
          <Input placeholder="Enter up to 10 characters" className="ms-2"/>
        </Form.Item>
        <Form.Item 
          label="User id" 
          name="displayId" 
          validateTrigger="onBlur"
          required
          rules={idRules} 
          onChange={handleFormItemOnChange}
        >
          <Input placeholder="Enter 8 to 16 characters consisting of letters, numbers, and symbols." className="ms-2" disabled/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
