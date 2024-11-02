/** @jsxImportSource @emotion/react */
import { useState, useContext, forwardRef } from "react";
import { Input, Modal, Button, Spin, notification } from "antd";
import {LoadingOutlined} from "@ant-design/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@/components/Avatar";
import useAxios from "@/lib/useAxios";
import { ApiHeadersContext } from "@/pages";

export default function SearchUsers({isOpen, setSearchUserOpen, onClose = () => {}}){
   const [searchText, setSearchText] = useState("")
   const [searchResult, setSearchResult] = useState([])
   const [isLoading, setLoading] = useState(false)
   const [isSearched, setSearched] = useState(false)
   const [focusUserId, setFocusUserId] = useState('')

   const apiHeaders = useContext(ApiHeadersContext)
   const [notifyApi, contextHolder] = notification.useNotification()

   const handleClose = (userId) =>{
    setSearchUserOpen(false)
    if(typeof userId === 'string'){
      onClose(userId)
    }else{
      onClose()
    }
    setTimeout(()=>{
      setSearched(false)
      setSearchText('')
      setFocusUserId('')
    }, 500)
   }
   const handleSearchChange = (val) => {
    setSearchText(val.target.value)
   }

   const handleSearch = () => {
    setSearched(true)
    setLoading(true)
    setFocusUserId('')
    const api = process.env.NEXT_PUBLIC_API_GET_USERS
    useAxios('POST',api, apiHeaders, {displayId: searchText})
    .then((res)=>{
      console.log('handleSearch res', res);
      if(res.status === 200 && res.data.status === 1){
        setSearchResult(res.data.result)
      }
    })
    .catch((error)=>{
      notifyApi.error({
        description: error.response.data.errorMessage,
      })
    })
    .finally(()=>{
      setLoading(false)
    })
   }

   const handleUserClick = (userId) => {
    if(!isLoading){
      setFocusUserId(userId)
    }
   }
   const openNotification = (userName, friendId) => {
    const key = friendId;
    const btn = (
      <div className="d-flex">
        <Button type="link" size="small" onClick={() => notifyApi.destroy()}>
          next time...
        </Button>
        <Button type="primary" size="small" onClick={() => notifyApi.destroy(key)} className="ms-2">
          Go to chat !
        </Button>
      </div>
    );
    notifyApi.success({
      message: `Invited ${userName} as a friend successfully.`,
      description:'Go to chat with her/him !',
      btn,
      key,
      onClose: () => {handleClose(friendId)},
      duration: 10
    });
   }
   const handleAddClick = (friendId) => {
      const url = process.env.NEXT_PUBLIC_API_ADD_FRIEND
      setLoading(true)
      useAxios('POST',url,apiHeaders,{friendId})
      .then((res)=>{
        if(res.status === 200 && res.data.status === 1){
          let friendIndex = searchResult.findIndex(user=>user.userId === friendId)
          let userArrayBefore = searchResult.filter((user, i)=> i < friendIndex)
          let userArrayAfter = searchResult.filter((user, i)=> i > friendIndex)
          setSearchResult([...userArrayBefore, res.data.result, ...userArrayAfter])
          openNotification(res.data.result.userName, friendId)
        }
      })
      .catch((error)=>{
        notifyApi.error({
          description: error.response.data.errorMessage,
        })
      })
      .finally(()=>{
        setLoading(false)
      })
   }
  return(
    <>
    {contextHolder}
    <Modal 
      open={isOpen} title="Add Friend"
      closable={false}
      footer={[
        <Button key="close"
          onClick={handleClose}
          ghost
          className="mt-2"
          >
          Close
        </Button>,
      ]}
    >
      <div className="d-flex">
        <Input
          prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          placeholder="Search User"
          value={searchText}
          onChange={handleSearchChange}
        />
        <div className="ms-3 overflow-hidden d-flex justify-content-center" css={{width: searchText === '' ? '0px' : '100px', transition: '0.3s'}}>
          <Button type="primary" ghost onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <div className="overflow-hidden" css={{height: isSearched ? '300px' : '0px', transition: '0.3s'}}>
        <div className="bg-prim p-3 mt-3 round-sm h-100 position-relative">
        {isLoading ? <Spin indicator={<LoadingOutlined spin/>} size="large" className="absolute-center"></Spin> : null}
        <ul className="overflow-auto" css={{display: searchResult.length === 0 ? 'none' : 'block'}}>
          {searchResult.map((item, index)=>{
            return(
              <li
                key={item.userId} 
                onClick={()=>{handleUserClick(item.userId)}}
                className={`d-flex align-items-center justify-content-between py-2${index !== searchResult.length -1 ? ' line-b-1' : ''}`} 
                css={{cursor: 'pointer'}}
              >
                <div className="d-flex align-items-center flex-nowrap overflow-hidden">
                  <Avatar name={item.userName}/>
                  <span className="ms-3">{item.userName}</span>
                  <span className="ms-3">@{item.displayId}</span>
                </div>
                <div
                  className="d-flex align-items-center overflow-hidden" 
                  css={{width: focusUserId == item.userId ? '120px' : '0px', transition: '0.3s'}}
                >
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={()=>{handleAddClick(item.userId)}} 
                    disabled={item.isInvited || item.isFriend || isLoading}
                    >
                      {item.isFriend ? 'Friend' : item.isInvited ? 'Invited' :'Add'}
                  </Button>
                  <Button size="small" ghost onClick={()=>{setFocusUserId('')}} className="ms-3">Cancel</Button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="h-100 flex-center" css={{display: searchResult.length === 0 && !isLoading ? 'flex' : 'none'}}>
          <p>No result...</p>
        </div>
        </div>
      </div>
    </Modal>
    
    </>
  )
}