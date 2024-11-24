/** @jsxImportSource @emotion/react */
import { useState, useContext, useEffect } from "react";
import { Popover, notification, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {ApiHeadersContext} from '../../index'
import { css, keyframes } from "@emotion/react";
import { themeColor } from "@/styles/colors/theme";
import useAxios from "@/lib/useAxios";

const unReadDot = css`
  background-color: ${themeColor.prim};
  width: 8px;
  height: 8px;
  border-radius: 50%;
`
const unReadCountCss = css`
  background-color: ${themeColor.danger};
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  translate: 50% -50%;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
`
const show = keyframes`
  
    0%{
      width: 0px;
      height: 0px;
    }
    70%{
      height: 23px;
      width: 23px;
    }
    100%{
      width: 20px;
      height: 20px;
    }
`
const readCountShow = css`
  animation: ${show} 0.5s ease-in 1s;
  `
const readCountHide = css`
  animation: ${show} 0.8s ease-in-out 1s backwards;
  
`

export default function NotificationPopover({onAcceptFriend = () => {}}){
  const [acceptLoadingArray, setAcceptLoadingArray] = useState([])
  const [notifyList, setNotifyList] = useState([])
  const [unReadCount, setUnReadCount] = useState(0)
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const apiHeaders = useContext(ApiHeadersContext)
  const [notifyApi, contextHolder] = notification.useNotification()

  
  useEffect(()=>{
    const getNotifyList = () => {
    const url = process.env.NEXT_PUBLIC_API_GET_NOTIFICATIONS
    
    useAxios('GET', url, apiHeaders)
      .then((response)=>{
        if(response.status === 200 && response.data.status === 1){
          let count = 0
          response.data.result.forEach((item)=>{
            if(!item.isRead){
              count += 1
            }
          })
          setUnReadCount(count)
          setNotifyList(response.data.result)
        }
      })
      .catch((error)=>{
      if(error.data?.errorMessage){
          notifyApi.error({
            description: error.data ? error.data.errorMessage : error,
          })
        }else{
          console.error(error);
        }
        
      })
  }
    if(apiHeaders['user-credential'] !== '' && apiHeaders['user-id'] !== ''){
      getNotifyList()
    }
  },[apiHeaders])

  const handlePopoverOpenChange = (isOpen) => {
    setPopoverOpen(isOpen)
    if(isOpen){
      if(unReadCount > 0){
        setUnReadCount(0)
        setReadStatus()
      }
    }else{
      let newArray = notifyList.map(item=>{
        item.isRead = true
        return item
      })
      setNotifyList(newArray)
    }
  }

  const setReadStatus = () => {
    const url = process.env.NEXT_PUBLIC_API_SET_NOTIFICATIONS_STAUS
    const notifyArray = notifyList.map(item=>{
      if(!item.isRead){
        return item.notificationId
      }
    })
    useAxios('POST', url, apiHeaders, {notifyArray})
  }

  const handleAcceptClick = (notification) => {
    const url = process.env.NEXT_PUBLIC_API_ACCEPT_FRIEND
    const body = {notificationId: notification.notificationId}
    setAcceptLoadingArray([...acceptLoadingArray, notification.notificationId])
    useAxios('POST', url, apiHeaders, body)
      .then((response)=>{
        if(response.status === 204){
          notifyApi.success({
            description: `${notification.friendInvitation.userName} and you are friends!`
          })
          onAcceptFriend()
          setPopoverOpen(false)
          setNotifyList((preList)=>
            preList.map(item => 
              item.notificationId === notification.notificationId
              ? {
                ...item,
                isRead: true,
                friendInvitation: {
                  ...item.friendInvitation,
                  isFriend: true
                }
              }
              : item
            )
          )
        }
      })
      .catch((error)=>{
        if(error.data?.errorMessage){
          notifyApi.error({
            description: error.data ? error.data.errorMessage : error,
          })
        }else{
          console.error(error);
        }
      })
      .finally(()=>{
        setAcceptLoadingArray(acceptLoadingArray.filter(item=>item !== notification.notificationId))
      })
  }
  return (
    <>
    {contextHolder}
    <Popover
      trigger="click"
      placement="bottomLeft"
      open={isPopoverOpen}
      onOpenChange={handlePopoverOpenChange}
      content={(
      <div>
        <div className="font-lg fw-bold ps-2">Notification</div>
        <ul className="overflow-auto h-100">
        {notifyList.map((item, i)=>
          <li 
            key={item.notificationId}
            className={`p-2${i === notifyList.length - 1 ? '' : ' line-b-1'}`}
            css={{cursor: 'pointer'}}
          >
            <div className={`p-2${!item.isRead ? ' bg-third' : ''}`}>
              <div className="d-flex font-md">
              {
                item.friendInvitation ? 
                (<div className="flex-grow-1">
                  <p><span className="fw-bold">{item.friendInvitation.userName}</span> {item.content}</p>
                  <div className="d-flex justify-content-end">
                    <Button 
                      type="primary" 
                      disabled={item.friendInvitation.isFriend}
                      onClick={()=>{handleAcceptClick(item)}}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ) : 
                <p className="flex-grow-1">{item.content}</p>
              }

              <div className="d-flex flex-center ms-3" css={{width: '10px'}}>
                <div className={!item.isRead ? null : 'd-none'} css={unReadDot}></div>
              </div>
            </div>
            </div>
          </li>
        )}
        {notifyList.length === 0 ?
          <li className="d-flex flex-center p-4">No notifications</li>
        :null}
      </ul>
      </div>
      
    )}
    overlayStyle={{padding: 0}}
    overlayInnerStyle={{maxHeight: '700px', width: '360px'}}
    >
      <Button className="me-3 position-relative">
        <FontAwesomeIcon icon={faBell} />
        <div className={unReadCount == 0 ? 'd-none' : null} css={[unReadCountCss]}>{unReadCount}</div>
      </Button>
    </Popover>
    </>
  )
}