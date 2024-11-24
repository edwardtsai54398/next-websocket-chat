/** @jsxImportSource @emotion/react */
import {ApiHeadersContext} from "@/pages";
import {useContext, useEffect, useState, Fragment} from "react";
import Avatar from "@/components/Avatar";
import {css} from "@emotion/react";
import {bgColor} from "@/styles/colors/background";
import {themeColor} from "@/styles/colors/theme";
import {textColor} from "@/styles/colors/text";
import moment from "moment";
import formatTimeSince from "@/lib/formatTimeSince"

const dialog = css`
    padding: 10px 16px;
    border-radius: 12px;
    margin-left: 10px;
    background-color: ${bgColor.second};
`
const selfDialog = css`
    margin-left: 0px;
    margin-right: 12px;
    background-color: ${themeColor.prim};
    color: ${textColor.highlight};
`
export default function Conversation({messages, onScrollGet}) {
  const apiHeaders = useContext(ApiHeadersContext)
  const [thisUserId, setThisUserId] = useState('');

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

  const handleScroll = () => {
    if(messages.length < 50) return
    onScrollGet(messages[0])
  }
  return (
    
      <ul onScroll={handleScroll} className="conversation w-100 pt-2 layout-content overflow-auto">
        {messages.map((item, index) => (
          <Fragment key={item.messageId}>
            {isFirstMessageOfTheDay(item, index) &&
              <li className="p-2 d-flex justify-content-center">
                <span className="bg-third rounded-pill py-1 px-3">{formatTimeSince(item.timestamp * 1000)}</span>
              </li>
            }
            {isFirstNotRead(item, index) &&
              <li className="px-4 py-2">
                <div className="py-1 round-sm text-center bg-third">message below you have not read yet.</div>
              </li>
            }
            <li className={`${isSelfSpeak(item) ? 'flex-row-reverse ' : ''}py-2 px-3 d-flex align-items-stretch w-100`}>
              <Avatar name={item.speakerName}/>
              <div css={[dialog, isSelfSpeak(item) && selfDialog]}>{item.content}</div>
              <div className={`${isSelfSpeak(item) ? 'me-2' : 'ms-2'} d-flex flex-column`}>
                {isSelfSpeak(item) && isOtherRead(item) && (<div className="align-self-start">read</div>)}
                <div className="mt-auto">{moment(item.timestamp * 1000).format('HH:mm')}</div>
              </div>
            </li>
          </Fragment>
        ))}
      </ul>
    
  )
}