import { useState,useEffect } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import axios from "axios";

export default function SignUpModal({ open, setModalOpen, loading, onSignupSuccess }) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [formRef] = Form.useForm()
  const idRules = [
    {
      required: true,
      message: 'Please input your username!',
    },
    {
      max:16,
      message: 'Up to 16 characters'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(){}\-\_\/])[A-Za-z\d!@#$%^&*(){}\-\_\/]{8,16}$/,
      message: 'User id must be 8-16 characters long and include letters, numbers, and symbols',
    }
  ]
  const initialValues = {
    userName: "Hazel",
    displayId: "doggy_lovelove"
  }

  //notify
  const [notifyApi, contextHolder] = notification.useNotification()

  const handleFormItemOnChange = (val) => {
    let formValues = formRef.getFieldValue()
    if(formValues.userName && formValues.displayId && formValues.userName !== '' && formValues.displayId !== ''){
      setSubmitDisabled(false)
    }else{
      setSubmitDisabled(true)
    }
    
  }
  
  const createUser = (val) => {
    //發出onSignUpClick並傳送值
    setIsLoading(true)
    let api = process.env.NEXT_PUBLIC_API_CREATE_USER
    console.log('api', api);
    axios.post(api,formRef.getFieldValue())
      .then((res)=>{
        console.log(res);
        
        if(res.status === 200 && res.data.status === 1){
          setSubmitDisabled(true)
          setModalOpen(false)
          onSignupSuccess(res.data.result)
        }else{
          if(res.data.status === 0){
            notifyApi['error']({
              description: res.data.errorMessage,
            })
          }
        }
      })
      .finally(()=>{
        setIsLoading(false)
      })
  }
  useEffect(() => {
    if (!open && formRef.getFieldInstance('userName')) {
      formRef.resetFields(); // 只在 open 變為 false 時重置表單
    }
  }, [open, formRef]);
  
  return (
    <>
    {contextHolder}
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
          disabled={isLoading}
          >
          Cancel
        </Button>,
        <Button key="sign-up" type="primary" loading={isLoading} disabled={isLoading || isSubmitDisabled} onClick={()=>{formRef.submit()}}>
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
          name="userName" 
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
          <Input placeholder="Enter 8 to 16 characters consisting of letters, numbers, and symbols." className="ms-2"/>
        </Form.Item>
      </Form>
    </Modal>
    </>
    
  );
}
