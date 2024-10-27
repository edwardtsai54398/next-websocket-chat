/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {Modal, Button} from 'antd';
import style from '../style/buttonGroupStyle'

function AddFriends(){
  const [targetElement, setTargetElement] = useState(null);
  const [isFriendsSearchShow,setFriendsSearchShow] = useState(false)
  useEffect(() => {
    const element = document.getElementById('add-friends-btn');
    if (element) {
      setTargetElement(element);
    }
  }, []);
  return(
    <>
    {targetElement && createPortal(
      <Button onClick={()=>{setFriendsSearchShow(true)}}><FontAwesomeIcon icon={faUserPlus}/></Button>,
      document.getElementById('add-friends-btn') 
    )}
    <div className={`bg-prim ${isFriendsSearchShow ? '' : 'd-none'}`} css={{flex: '100% 1 1'}}>

    </div>
    </>
    
  )
}

export default AddFriends