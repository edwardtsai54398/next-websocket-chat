import { useRef, useState } from 'react'
import {Button, Input, ConfigProvider} from 'antd'
import {SendOutlined, CloseOutlined} from '@ant-design/icons'
import { bgColor } from '@/styles/colors/background'
import { borderColor } from '@/styles/base/border'

export default function Messendger({onMessageSend, feedbackOn, onFeedbcakClose}){
  const [text, setText] = useState('')
  const inputRef = useRef() 

  const handleChange = (e) => {
    setText(e.target.value)
  }
  const clearText = () => {
    setText('')
  }

  const sendMessage = () => {
    onMessageSend(text, feedbackOn)
    clearText()
  }
  return(
    <div>
      {!!feedbackOn &&
        (
          <div className="position-relative line-t-1 pt-2">
            <span onClick={onFeedbcakClose} type="button" className="position-absolute top-0 end-0 p-2 me-3">
              <CloseOutlined />
            </span>
            <div className="ps-4">
              <div>{feedbackOn.speakerName}</div>
              <div className='font-xs text-disabled'>{feedbackOn.content}</div>
            </div>
          </div>
        )
      }
      <ConfigProvider
        theme={{
          token:{
            colorBgContainer: bgColor.second,
            colorBorder: borderColor.prim
          }
        }}
      >
        <div className="p-2">
          <Input
          ref={inputRef}
          value={text}
          onPressEnter={sendMessage}
          onChange={handleChange}
            suffix={
              <Button type="primary" onClick={sendMessage}>
                <SendOutlined />Send
              </Button>
            }
          >
          </Input>
        </div>
      </ConfigProvider>
    </div>
  )
}