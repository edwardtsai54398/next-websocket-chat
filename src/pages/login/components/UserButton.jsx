/** @jsxImportSource @emotion/react */ 
import styles from "./SquareButtonStyle"
export default function UserButton({userName, displayId, userId, className}){
  return(
      <div css={[styles.btn, styles.user]} className={className}>
        <span className="font-lg mb-2">{userName}</span>
        <span className="text-disabled">{displayId}</span>
      </div>
  )
}