/** @jsxImportSource @emotion/react */
import indexStyles from "@/pages/index/style/indexStyle";
import ChatList from "@/pages/index/components/ChatList";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {forwardRef, useContext, useEffect, useReducer, useState, useImperativeHandle} from "react";
import useAxios from "@/lib/useAxios";
import {ApiHeadersContext} from "@/pages";
import Conversation from "@/pages/index/components/Conversation";
import concatArrSort from "@/lib/concatArrSort";
import { socket } from "@/lib/socket-client";

function chatListReducer(state, action) {
  switch (action.type) {
    case 'add_chats':
      console.log('chatListReducer/add_chats', action.payload)
      return concatArrSort(state, action.payload, 'timestamp', false)
    case 'update_unread_count':
      return state.map(chat =>
        chat.conversationId === action.payload.id ?
          {
            ...chat,
            unreadTotal: action.payload.count
          } :
          chat
      )
  }
}

function chatCacheReducer(state, action) {
  switch (action.type) {
    case 'add_chats':
      let newCache = {}
      action.payload.forEach((chat) => {
        if (!state.hasOwnProperty(chat.conversationId)) {
          newCache[chat.conversationId] = chat.latestMessages
        }else{
          state[chat.conversationId] = chat.latestMessages
        }
      })
      return {...state, ...newCache}
    case 'update_read_status':
      const {conversationId, messageIds, readUser} = action.payload
      if(!state[conversationId]) return
      state[conversationId] = state[conversationId].map(message => {
        messageIds.some(m => m === message.messageId) ?
        {
          ...message,
          readUser: [...message.readUser, readUser]
        } : 
        message
      })
      return state
    case 'add_messages':
      return {
        ...state,
        [action.payload.conversationId]: concatArrSort(state[action.payload.conversationId].messages, action.payload.messagesArray, 'timestamp', true)
      }
  }
}



const ChatApp = forwardRef(function ChatApp(props, ref) {
  const [isSocketConnected, setSocketConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")
  const [isListLoading, setListLoading] = useState(false)
  const [chatList, listDispatch] = useReducer(chatListReducer, [])
  const [currentId, setCurrentId] = useState('')
  const [chatCache, cacheDispatch] = useReducer(chatCacheReducer, {});

  const apiHeaders = useContext(ApiHeadersContext)

  const getChatList = (chat) => {
    const url = process.env.NEXT_PUBLIC_API_GET_CHAT_LIST
    setListLoading(true)
    let body = {}
    if(chat){
      body = {oldestConversationId: chat.conversationId}
    }
    useAxios("POST", url, apiHeaders, body)
      .then((response) => {
        if (response.status === 200 && response.data.status === 1) {
          listDispatch({type: 'add_chats', payload: response.data.result})
          cacheDispatch({type: 'add_chats', payload: response.data.result})
        }
      })
      .catch((error)=>{
        console.log(error);
        
      })
      .finally(() => {
        setListLoading(false)
      })
  }
  const getChat = (conversationId) => {
    const url = process.env.NEXT_PUBLIC_API_GET_CHAT
    setListLoading(true)
    useAxios("POST", url, apiHeaders, {conversationId})
      .then((response) => {
        if(response.status === 200 && response.data.status === 1) {
          listDispatch({ type: 'add_chats', payload: [response.data.result] })
          cacheDispatch({ type: 'add_chats', payload: [response.data.result] })
        }
      })
      .finally(() => {
        setListLoading(false)
      })
  }

  useEffect(() => {
    if (apiHeaders['user-credential'] !== '' && apiHeaders['user-id'] !== '') {
      getChatList()
    }
  }, [apiHeaders])

  const handleItemClick = (item) => {
    const thisUserId = apiHeaders['user-id']
    if(currentId !== '' && chatCache[currentId].some(m => !m.readUser.includes(thisUserId))){
      //離開前一個聊天室，若有未讀的訊息，更新每個訊息的已讀狀態
      const messageIds = chatCache[currentId].map(message => 
        message.readUser.some(u => u === thisUserId) ? null : message.messageId
      ).filter(m => m)
      cacheDispatch({
        type: 'update_read_status',
        payload: {
          conversationId: currentId,
          messageIds,
          readUser: thisUserId
        }
      })
    }
    const url = process.env.NEXT_PUBLIC_API_UPDATE_READ_STATUS
    const messageIds = item.latestMessages.map(m => {
      if (m.speakerId !== thisUserId && !m.readUser.find(user => user === thisUserId)) {
        return m.messageId
      }
    }).filter(m => m)
    console.log({messageIds})
    
    socket.emit('update_read_status', {conversationId: item.conversationId, readUser: thisUserId, messageIds})//test
    // useAxios('POST', url, apiHeaders, {messageIds, conversationId: item.conversationId}).then((response)=>{
    //   if(response.status === 204){
    //     socket.emit('update_read_status', {conversationId: item.conversationId, readUser: thisUserId, messageIds})
    //   }
    // })
    listDispatch({type: 'update_unread_count', payload: {id: item.conversationId, count: 0}})
    setCurrentId(item.conversationId)
  }

  const handleMsgScrollGet = (message) => {
    console.log('handleMsgScrollGet')
    getMessage(message.messageId)
  }
  const getMessage = (oldestMessageId) => {
    const url = process.env.NEXT_PUBLIC_API_GET_MESSAGES
    useAxios("POST", url, apiHeaders, {conversationId: currentId, oldestMessageId})
    .then((response) => {
      if(response.status === 200 && response.data.status === 1) {
        cacheDispatch({
          type: 'add_messages',
          payload: {
            conversationId: currentId,
            messageArray: response.data.result.messages
          }
        })
      }
    })
  }

  const handleSocketOnUpdateRead = (e) => {
    console.log('handleSocketOnUpdateRead', e);
    const {conversationId, messageIds, readUser} = e
    if(conversationId && Array.isArray(messageIds)){
      cacheDispatch({
        type: "update_read_status",
        payload: {
          conversationId,
          messageIds,
          readUser
        }
      })
    }
    
  }
  const handleSocketOnCreateMsg = (e) => {
    console.log('handleSocketOnCreateMsg', e);
    
  }
  //socket connect
  useEffect(()=>{
    if(socket.connected){
      handleSocketConnect()
    }
    function handleSocketConnect(){
      setSocketConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name)
      })
    }
    function handelSocketDisconnect(){
      setSocketConnected(false)
      setTransport("N/A")
    }

    socket.on('connect', handleSocketConnect)
    socket.on('disconnect', handelSocketDisconnect)
    socket.on('update_read_status', handleSocketOnUpdateRead)
    socket.on('create_message', handleSocketOnCreateMsg)

    return () => {
      socket.off('connect', handleSocketConnect)
      socket.off('disconnect', handelSocketDisconnect)
      socket.off('update_read_status', handleSocketOnUpdateRead)
      socket.off('create_message', handleSocketOnCreateMsg)
    }
  }, [])
  
  
  useImperativeHandle(ref, () => {
    return{
      getChatList
    }
  })
  return (
    <div className="layout-inline">
      <div className="line-e-1" css={indexStyles.aside}>
      <p>Status: {isSocketConnected ? 'connected' : 'disconnect'}</p>
      <p>Transport: { transport }</p>
        <div className="h-100">
          {
            isListLoading ?
              <div className="line-b-1 py-1 d-flex flex-center flex-column">
                <Spin indicator={<LoadingOutlined spin/>}></Spin>
                Loading...
              </div> :
              null
          }
          {
            chatList.length > 0 ?
              <ChatList list={chatList} onItemClick={handleItemClick} onScrollGet={getChatList}/> :
              !isListLoading ? <div className="py-5 d-flex flex-center">No chats...</div> : null
          }
        </div>
      </div>
      <div className="layout-inline">
        <div className="layout-content">{
          currentId !== '' ?
            (
              <Conversation messages={chatCache[currentId]} onScrollGet={handleMsgScrollGet}/>
            ) :
            null
        }</div>
      </div>
    </div>
  )
})

export default ChatApp