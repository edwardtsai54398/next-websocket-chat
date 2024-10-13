/** @jsxImportSource @emotion/react */ 
import styles from "../style/SquareButtonStyle.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { Tooltip } from "antd"

export default function AddUserButton({onClick, disabled}){
  return(
      <Tooltip title="Add a new user">
        <div onClick={!disabled ? onClick : null} css={styles.btn} className={`position-relative${disabled ? ' is-disabled' : ''}`}>
          <FontAwesomeIcon icon={faCirclePlus} css={{fontSize: '36px'}}/>
        </div>
      </Tooltip>
  )
}