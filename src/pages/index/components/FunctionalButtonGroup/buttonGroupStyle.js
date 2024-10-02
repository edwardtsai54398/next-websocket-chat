import { css } from "@emotion/react";
import { bgColor } from "@/styles/colors/background";
import { fontSize } from "@/styles/base/font";
import { borderColor, borderRadius } from "@/styles/base/border";

const container = css`
  label: container;
  overflow: hidden;
`;

const btnwrapper = css`
  label: btnwrapper;
  padding: 4px;
  flex: 100% 1 1;
  &:not(:last-child) {
    border-right: 2px solid ${borderColor.prim};
  }
`;

const btn = css`
  label: btn;
  width: 100%;
  height: 50px;
  font-size: ${fontSize.lg};
  border-radius: ${borderRadius.sm};
  &:hover {
    background-color: ${bgColor.prim};
  }
`;

const logoutBtn = css`
  label: logoutBtn;
  width: 100%;
`;

export default { container, logoutBtn, btnwrapper, btn };
