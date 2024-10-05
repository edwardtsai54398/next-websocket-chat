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
`;

const user = css`
  background-color: ${bgColor.second};
  &:hover{
    background-color: ${bgColor.prim};
  }
`
export default { btn, user };
