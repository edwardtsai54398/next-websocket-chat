/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { borderColor, borderRadius } from "@/styles/base/border";
import { bgColor } from "@/styles/colors/background";
import { textColor } from "@/styles/colors/text";

const btnSize = 150;

const btn = css`
  width: ${btnSize}px;
  height: ${btnSize}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${borderColor.prim};
  border-radius: ${borderRadius.md};
  background-color: ${bgColor.prim};
  cursor: pointer;
  &:hover {
    background-color: ${bgColor.second};
  }
  &.is-disabled{
    background-color: ${bgColor.prim}!important;
    cursor: not-allowed;
  }
`;

const user = css`
  background-color: ${bgColor.second};
  &:hover{
    background-color: ${bgColor.prim};
  }
  &.is-disabled{
    background-color: ${bgColor.second}!important;
    cursor: not-allowed;
  }
`
export default { btn, user };
