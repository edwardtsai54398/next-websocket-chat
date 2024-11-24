/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {bgColor} from "@/styles/colors/background";
import Avatar from "@/components/Avatar";
import {themeColor} from "@/styles/colors/theme";
import {textColor} from "@/styles/colors/text";
import formatTimeSince from "@/lib/formatTimeSince";

const li = css`
    cursor: pointer;
    padding: 12px 18px;
    display: flex;

    &:hover {
        background-color: ${bgColor.second};
    }

    .is-active {
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

export default function ChatList({list, onItemClick, onScrollGet}) {
  const handleScroll = () => {
    if(list.length < 20) return
    onScrollGet(list[list.length - 1])
  }
  return (
    <ul onScroll={handleScroll} className="h-100 overflow-auto">
      {
        list.map(item => (
          <li
            key={item.conversationId}
            css={li}
            onClick={() => {
              onItemClick(item)
            }}
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
    </ul>
  )
}