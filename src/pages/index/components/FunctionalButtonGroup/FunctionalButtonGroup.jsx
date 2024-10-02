/** @jsxImportSource @emotion/react */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import style from './buttonGroupStyle'
import { borderColor } from "@/styles/base/border";

export default function FunctionalButtonGroup(){
  return(
    <div
        css={style.container}
        className="mt-auto line-t-2"
      >
      <div className="d-flex">
        <div css={style.btnwrapper}>
          <button css={[style.btn, style.logoutBtn, {transform: "rotate(180deg)"}]}><FontAwesomeIcon icon={faArrowRightToBracket} /></button>
        </div>
        <div id="add-friends-btn" className="" css={style.btnwrapper} ></div>
        {/* <div css={style.btnwrapper}>
          <button css={style.btn}><FontAwesomeIcon icon={faCommentDots}/></button>
        </div> */}
        <div css={style.btnwrapper}>
          <button css={style.btn}><FontAwesomeIcon icon={faBell}/></button>
        </div>
      </div>  
        
    </div>
  );
}