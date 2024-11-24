/** @jsxImportSource @emotion/react */ 
import { createContext, useState } from "react"
import { useRouter } from "next/router"
import { Spin, Modal, Button, notification } from "antd"
import axios from "axios"
import moment from "moment"
import {LoadingOutlined} from "@ant-design/icons"
import styles from "../style/SquareButtonStyle"

export default function UserButton({user, disabled, setLogInLoading,onDeleteUser, className}){
  const [isLoading, setLoading] = useState(false)
  const [isExpiredModalOpen, setExpiredModalOpen] = useState(false)
  const router = useRouter()
  //notify
  const [notifyApi, contextHolder] = notification.useNotification()
  const handleLogIn = () => {
    // console.log('user expiredTime:', moment(user.expiredTimestamp*1000).format('YYYY-MM-DD HH:mm:ss'), user.expiredTimestamp);
    
    if(moment().isAfter(user.expiredTimestamp*1000)){
      console.log('Expired!!!');
      removeUser()
      setExpiredModalOpen(true)
      return
    }
    setLoading(true)
    setLogInLoading(true)
    const api = process.env.NEXT_PUBLIC_API_LOGIN
    const body = {userId: user.userId}
    axios.post(api,body)
      .then((res)=>{
        console.log(res);
        if(res.status === 200 && res.data.status === 1){
          sessionStorage.setItem('user-credential', res.data.result.credential)
          const {userName, userId, displayId} = user
          sessionStorage.setItem('user-info', JSON.stringify({userName, userId, displayId}))
          router.push('/')
        }else{
          if(res.data.status === 0){
            notifyApi['error']({
              description: res.data.errorMessage,
            })
            if(res.data.errorMessage === "User account has expired"){
              removeUser()
            }
          }
        }
      })
      .finally(()=>{
        setLoading(false)
        setLogInLoading(false)
      })
  }

  const removeUser = () => {
    axios({
      url: process.env.NEXT_PUBLIC_API_REMOVE_USER,
      method: "DELETE",
      body:{userId: user.userId}
    })
  }
  return(
    <>
      <div onClick={!disabled ? handleLogIn : null} css={[styles.btn, styles.user]} className={`${className} ${disabled || isLoading ? 'is-disabled' : ''}`}>
        <span className="font-lg mb-2">{user.userName}</span>
        <span className="text-disabled">{user.displayId}</span>
        {isLoading ? <Spin indicator={<LoadingOutlined spin/>} size="large" className="position-absolute"></Spin> : null}  
      </div>
      <Modal open={isExpiredModalOpen} closable={false} maskClosable={false}
        title={<h6 className="text-danger font-lg">User expired</h6>}
        footer={[
        <Button key="comfirm-delete" type="primary" danger onClick={()=>{onDeleteUser(user.displayId)}}>
          OK
        </Button>,
      ]}
        >
          <p>This user <span>{user.userName}</span> have expired! We will delete it automatcally.</p>
        </Modal>
    </>
  )
}