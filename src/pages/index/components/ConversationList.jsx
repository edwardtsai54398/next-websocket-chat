/** @jsxImportSource @emotion/react */
import useAxios from "@/lib/useAxios";
import { forwardRef, useImperativeHandle, useState, useContext, useEffect } from "react";
import { ApiHeadersContext } from "@/pages";
import {LoadingOutlined} from '@ant-design/icons' 
import { css } from "@emotion/react";
import { bgColor } from "@/styles/colors/background";
import Avatar from "@/components/Avatar";
import { themeColor } from "@/styles/colors/theme";
import { textColor } from "@/styles/colors/text";
import formatTimeSince from "@/lib/formatTimeSince";
import { Spin } from "antd";

const li = css`
  cursor: pointer;
  padding: 12px 18px;
  display: flex;
  &:hover{
    background-color: ${bgColor.second};
  }
  .is-active{
    background-color: ${bgColor.second};
  }
`
const unReadCount = css`
  background-color: ${themeColor.prim};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: ${textColor.highlight}
`

const ConversationList = (props) => {
  const [conversations, setConversations] = useState([])
  const [isLoading, setLoading] = useState(false)
  const apiHeaders = useContext(ApiHeadersContext)

  const getConversations = () => {
    const url = process.env.NEXT_PUBLIC_API_GET_CHAT_LIST
    setLoading(true)
    useAxios("GET", url, apiHeaders)
      .then((response)=>{
        console.log(response.data);
        if(response.status === 200 && response.data.status === 1){
          setConversations(response.data.result)
        }
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  useEffect(()=>{
    if(apiHeaders['user-credential'] !== '' && apiHeaders['user-id'] !== ''){
      getConversations()
    }
  }, [apiHeaders])

  const handleConversationItemClick = (conversation) => {
    setConversations((preList) => preList.map(item => 
      item.conversationId === conversation.conversationId ?
      {
        ...item,
        unreadTotal: 0
      }:
      item 
      ))
    props.onItemClick({
      id:conversation.conversationId,
      messages: conversation.latestMessages
    })
  }

  useImperativeHandle(ref, ()=>({
    getConversations
  }))
  return(
    <>
      {
        isLoading ?
        <div className="line-b-1 py-1 d-flex flex-center flex-column">
          <Spin indicator={<LoadingOutlined spin/>}></Spin>
          Loading...
          </div> :
        null
      }
      {
        conversations.length > 0 ? 
        <ul className="h-100 overflow-auto">
          {
            conversations.map(item=>(
              <li 
                key={item.conversationId} 
                css={li}
                onClick={() => {handleConversationItemClick(item)}}
              >
                <Avatar name={item.conversationName}/>
                <div className="ms-3 flex-grow-1 h-100 d-flex flex-column">
                  <div className="fw-bold mb-auto">{item.conversationName}</div>
                  <p className="mt-2">{item.latestContent}</p>
                </div>
                <div className="ms-3 h-100 d-flex flex-column flex-center">
                  <div className="mb-auto">{formatTimeSince(item.timestamp * 1000)}</div>
                  {!!item.unreadTotal ? 
                    (<div className="mt-2" css={unReadCount}>{item.unreadTotal}</div>) :
                    null
                  }
                  
                </div>
              </li>

            ))
          }
        </ul> :
        !isLoading ? <div className="py-5 d-flex flex-center">No chats...</div> : null
      }
    </>
  )
}
export default  ConversationList