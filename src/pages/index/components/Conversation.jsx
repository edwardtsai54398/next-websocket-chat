/** @jsxImportSource @emotion/react */
import {ApiHeadersContext} from "@/pages";
import {useContext, useEffect, useState, Fragment, useRef} from "react";
import Avatar from "@/components/Avatar";
import {Dropdown} from 'antd'
import {css} from "@emotion/react";
import {bgColor} from "@/styles/colors/background";
import {themeColor} from "@/styles/colors/theme";
import {textColor} from "@/styles/colors/text";
import moment from "moment";
import formatTimeSince from "@/lib/formatTimeSince"

const dialogWrapper = css`
  margin-left: 10px;
`
const ml = css`
  margin-left: 12px;
`
const mr = css`
  margin-right: 12px;
`
const dialog = css`
    padding: 10px 16px;
    border-radius: 12px;
    background-color: ${bgColor.third};
    max-width: 280px;
    word-break: break-all;
`
const selfDialog = css`
    background-color: ${themeColor.prim};
    color: ${textColor.highlight};
`
const withFeedback = css`
  background-color: ${bgColor.second};
  border-radius: 12px;
`
const feedbackContent = css`
  max-width: 160px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${textColor.disabled};
  font-size: 12px;
`
export default function Conversation({messages, onScrollGet, onFeedbackClick}) {
  const apiHeaders = useContext(ApiHeadersContext)
  const [thisUserId, setThisUserId] = useState('');
  const containerRef = useRef()
  const unreadDevider = useRef()
  let feedback

  useEffect(() => {
    if (apiHeaders['user-id'] !== '') {
      setThisUserId(apiHeaders['user-id'])
    }
  }, [apiHeaders])

  const isSelfSpeak = (message) => {
    return thisUserId === '' ? true : message.speakerId === thisUserId
  }
  const isOtherRead = (message) => {
    return message.readUser.filter(user => user !== thisUserId).length > 0
  }
  const isFirstMessageOfTheDay = (message, index) => {
    return index === 0 ? true : moment(message.timestamp * 1000).diff(moment(messages[index-1].timestamp * 1000),'days') === 1
  }
  const isFirstNotRead = (message, index) => {
    return !message.readUser.find(user => user === thisUserId) ? index === 0 || messages[index - 1].readUser.find(user => user === thisUserId) : false
  }

  const handleScroll = (e) => {
    console.log('handleScroll', e);
    
    if(messages.length < 50) return
    onScrollGet(messages[0])
  }
  useEffect(()=>{
    const scrollToBottom = () => {
      console.log(containerRef.current.scrollHeight);
      console.log(containerRef.current.offsetHeight);
      containerRef.scrollTo(containerRef.current.scrollHeight - containerRef.current.offsetHeight)
    }
    const scrollToUnread = () => {
      containerRef.scrollTo(unreadDevider.current.offsetTop)
    }
    if(containerRef.current.scrollHeight > containerRef.current.offsetHeight){
      if(unreadDevider.current){
        scrollToUnread()
      }else{
        scrollToBottom()

      }
    }
  },[thisUserId])

  const handleContextMenu = (message) => {
    console.log('handleContextMenu', message);
    feedback = {
      messageId: message.messageId,
      speakerName: message.speakerName,
      speakerId: message.speakerId,
      content: message.content,
    }
  }
  const dropdownMenu = [
    {
      key: 'feedback',
      label: (
        <div className="text-center">Comment</div>
      ),
    }
  ]
  const handleDropdownItemClick = (e) => {
    console.log('handleDropdownItemClick', feedback);
    onFeedbackClick(feedback)
  }
  return (
      <ul ref={containerRef} onScroll={handleScroll} className="conversation w-100 pt-2 layout-content overflow-auto">
        {messages.map((item, index) => (
          <Fragment key={item.messageId}>
            {isFirstMessageOfTheDay(item, index) &&
              <li className="p-2 d-flex justify-content-center">
                <span className="bg-third rounded-pill py-1 px-3">{formatTimeSince(item.timestamp * 1000)}</span>
              </li>
            }
            {isFirstNotRead(item, index) &&
              <li ref={unreadDevider} className="px-4 py-2">
                <div className="py-1 round-sm text-center bg-third">message below you have not read yet.</div>
              </li>
            }
            <Dropdown
              menu={{
                items: dropdownMenu,
                onClick: handleDropdownItemClick
              }}
              trigger={['contextMenu']}
              disabled={isSelfSpeak(item)}
            >
              <li className={`${isSelfSpeak(item) ? 'flex-row-reverse ' : ''}py-2 px-3 d-flex w-100`} onContextMenu={() => handleContextMenu(item)}>
                <Avatar name={item.speakerName}/>
                <div css={[dialogWrapper, !!item.feedback && withFeedback, isSelfSpeak(item) ? mr : ml]}>
                  {!!item.feedback && 
                  (<div className="p-1 px-3">
                    <div>{item.feedback.speakerName}</div>
                    <div css={[feedbackContent]}>{item.feedback.content}</div>
                  </div>)
                  }
                  <div css={[dialog, isSelfSpeak(item) && selfDialog]}>{item.content}</div>
                </div>
                <div className={`${isSelfSpeak(item) ? 'me-2' : 'ms-2'} d-flex flex-column`}>
                  {isSelfSpeak(item) && isOtherRead(item) && (<div className="align-self-start">read</div>)}
                  <div className="mt-auto">{moment(item.timestamp * 1000).format('HH:mm')}</div>
                </div>
              </li>
            
            </Dropdown>
          </Fragment>
        ))}
      </ul>
    
  )
}