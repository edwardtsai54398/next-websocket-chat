/** @jsxImportSource @emotion/react */ 
import styles from "./SquareButtonStyle.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { Tooltip } from "antd"

export default function AddUserButton({onClick}){
  return(
      <Tooltip title="Add a new user">
        <div onClick={onClick} css={styles.btn} className="position-relative">
          <FontAwesomeIcon icon={faCirclePlus} css={{fontSize: '36px'}}/>
        </div>
      </Tooltip>
  )
}