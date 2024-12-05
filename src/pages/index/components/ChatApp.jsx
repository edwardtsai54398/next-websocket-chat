/** @jsxImportSource @emotion/react */
import indexStyles from "@/pages/index/style/indexStyle";
import ChatList from "@/pages/index/components/ChatList";
import { Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {forwardRef, useContext, useEffect, useReducer, useState, useImperativeHandle} from "react";
import useAxios from "@/lib/useAxios";
import {ApiHeadersContext} from "@/pages";
import Conversation from "@/pages/index/components/Conversation";
import concatArrSort from "@/lib/concatArrSort";
import { socket } from "@/lib/socket-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import Messendger from "./Messenger";

function chatListReducer(state, action) {
  switch (action.type) {
    case 'add_chats':
      console.log('chatListReducer/add_chats', action.payload)
      return concatArrSort(state, action.payload, 'timestamp', false)
    case 'update_unread_count':
      const {id, count} = action.payload
      return state.map(chat =>
        chat.conversationId === id ?
          {
            ...chat,
            unreadTotal: count
          } :
          chat
      )
    case 'update_latestMsg':
      const {latestMsg, conversationId, timestamp} = action.payload
      const conversationIndex = state.findIndex(item => item.conversationId === conversationId)
      const arrayBefore = state.filter((item, i) => i < conversationIndex)
      const arrayAfter = state.filter((item, i) => i > conversationIndex)
      const conversation = state[conversationIndex]
      conversation.latestMessage = latestMsg
      conversation.timestamp = timestamp
      return [
        {
          ...conversation,
          latestContent: latestMsg,
          timestamp,
        },
         ...arrayBefore,
          ...arrayAfter
      ]
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
      let result = state[conversationId].map(message => 
        messageIds.some(m => m === message.messageId) ?
        {
          ...message,
          readUser: [...message.readUser, readUser]
        } : 
        message
      )
      console.log('update_read_status REsult', result);
      
      return {
        ...state,
        [conversationId]: state[conversationId].map(message => 
        messageIds.some(m => m === message.messageId) ?
        {
          ...message,
          readUser: [...message.readUser, readUser]
        } : 
        message
      )
      }
    case 'add_messages':
      let newMessageArray = action.payload.messagesArray
      let currentMessages = state[action.payload.conversationId]
      if(newMessageArray.length === 1 && typeof newMessageArray[0].messageId === 'number'){
        //自己發訊息先暫存
        let newMessage = {
          ...newMessageArray[0],
          timestamp: Math.floor(Date.now() / 1000),
        }
        return {
          ...state,
          [action.payload.conversationId]: [...currentMessages, newMessage]
        }
      }
       return {
          ...state,
          [action.payload.conversationId]: concatArrSort(currentMessages, newMessageArray, 'timestamp', true)
        }
    case 'update_message_id':
      let update = state[action.payload.conversationId].find(m => m.messageId === action.payload.tempId)
      
      update.messageId = action.payload.messageId
      return state
  }
}

const ChatApp = forwardRef(function ChatApp(props, ref) {
  const [isSocketConnected, setSocketConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")
  const [isListLoading, setListLoading] = useState(false)
  const [chatList, listDispatch] = useReducer(chatListReducer, [])
  const [currentId, setCurrentId] = useState('')
  const [chatCache, cacheDispatch] = useReducer(chatCacheReducer, {});
  const [feedback, setFeedback] = useState(null)

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
    setCurrentId(item.conversationId)
    console.log('checkthis item.latestMessages', chatCache[item.conversationId]);
    
    const messageIds = chatCache[item.conversationId].map(m => {
      if (m.speakerId === thisUserId || !!m.readUser.find(user => user === thisUserId)) return null
      return m.messageId
    }).filter(m => m)
    if(messageIds.length === 0) return
    const url = process.env.NEXT_PUBLIC_API_UPDATE_READ_STATUS
    console.log({messageIds})
    useAxios('POST', url, apiHeaders, {messageIds, conversationId: item.conversationId}).then((response)=>{
      if(response.status === 204){
        socket.emit('update_read_status', {conversationId: item.conversationId, readUser: apiHeaders['user-id'], messageIds})
      }
    })
    listDispatch({type: 'update_unread_count', payload: {id: item.conversationId, count: 0}})
    
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
    const {conversationId} = e
    
    if(chatCache.hasOwnProperty(conversationId)){
      cacheDispatch({
        type: 'add_messages',
        payload: {
          conversationId,
          messagesArray: [e.message]
        }
      })
      //更新chatList、順序、最新訊息
      listDispatch({
        type: 'update_latestMsg',
        payload: {
          latestMsg: e.message.content,
          timestamp: e.message.timestamp,
          conversationId
        }
      })
      if(conversationId === currentId){
        //如果剛好在這個chatroom，更新chatCache內的已讀並且立即發送已讀API
        const messageIds = [e.message.messageId]
        cacheDispatch({
          type: 'update_read_status',
          payload: {conversationId, messageIds, readUser:apiHeaders['user-id'] }
        })
        const url = process.env.NEXT_PUBLIC_API_UPDATE_READ_STATUS
        useAxios('POST', url, apiHeaders, {messageIds, conversationId}).then((response)=>{
          if(response.status === 204){
            socket.emit('update_read_status', {conversationId, readUser: apiHeaders['user-id'], messageIds})
          }
        })
      } else {
        //如果沒有，更新chatList的未讀數量
        let conversation = chatList.find(item =>item.conversationId === conversationId)

        listDispatch({
          type: 'update_unread_count',
          payload: {
            id: conversationId,
            count: conversation.unreadTotal + 1
          }
        })
      }
    }else{
      console.log('this cannot happen');
      
      //若chatList裡沒有發出訊息的chatroom(不是最新的20個chatroom)，則fetch getChat
      getChat(conversationId)
    }
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
  }, [chatCache, chatList])
  
  const handleMessageSend = (text, feedback) => {
    console.log('handleMessageSend', text);
    //先創建cache，待後端回傳正確的messageId再將tempId替換掉
    //找出有沒有其他暫存tempId，有的話比最大的+1
    let tempId = 1
    let cacheTempIdArray = chatCache[currentId].filter(m => typeof m.messageId === 'number').map(m => m.messageId)
    if(cacheTempIdArray.length > 0){
      tempId = Math.max(cacheTempIdArray) + 1
    }
    let newMessge = {
      messageId: tempId,
      content: text,
      speakerName: JSON.parse(sessionStorage.getItem('user-info')).userName,
      speakerId: apiHeaders['user-id'],
      timestamp: 0,
      readUser: [apiHeaders['user-id']],
      feedback: feedback ? {...feedback} : null
    }
    cacheDispatch({
      type:'add_messages', 
      payload: {
        conversationId: currentId,
        messagesArray: [newMessge]
      }
    })
    setFeedback(null)
    //發送api
    const url = process.env.NEXT_PUBLIC_API_SEND_MESSAGE
    const body = {
      content: text, 
      conversationId:currentId,
      tempId,
      feedback: feedback ? feedback.messageId : null
    }
    useAxios("POST", url, apiHeaders,body)
      .then((response) => {
        if(response.status === 200){
          //更新成正確的messageId和timestamp
          let result = response.data.result
          
          cacheDispatch({
            type:'update_message_id', 
            payload: {
              conversationId: result.conversationId,
              tempId: result.tempId,
              messageId: result.messageId,
              timestamp: result.timestamp
            }
          })
          socket.emit('create_message', {
            conversationId: result.conversationId,
            message: {
              messageId: result.messageId,
              content: result.content,
              speakerName: result.speakerName,
              speakerId: result.speakerId,
              readUser: result.readUser,
              timestamp: result.timestamp,
              feedback: result.feedback
            } 
          })
        }
      })
  }
  
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
              <>
                <Conversation messages={chatCache[currentId]} onScrollGet={handleMsgScrollGet} onFeedbackClick={setFeedback}/>
                <Messendger onMessageSend={handleMessageSend} feedbackOn={feedback} onFeedbcakClose={() => setFeedback(null)}/>
              </>
            ) :
            (
              <div className="d-flex flex-center flex-column h-100 text-disabled">
                <span css={{fontSize: '60px'}}>
                  <FontAwesomeIcon icon={faCommentDots} className="mb-2"/>
                </span>
                <span css={{fontSize: '20px'}}>Start to chat!</span>
              </div>
            )
        }</div>
      </div>
    </div>
  )
})

export default ChatApp