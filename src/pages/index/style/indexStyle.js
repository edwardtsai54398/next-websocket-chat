import { css } from "@emotion/react";

const header = css``;

const flex1 = css`
  flex: 100% 1 1;
`;

const containerOuter = css`
  label: containerOuter;
  width: 100%;
  max-width: 1000px;
  height: 900px;
  max-height: 90vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const container = css`
  label: container;
  max-width: 100%;
  overflow: hidden;
  box-shadow: 0 0 8px 5px rgba(0, 0, 0, 0.3);
`;

const aside = css`
  label: aside;
  width: 30%;
  max-width: 500px;
  min-width: 300px;
`;

export default { container, aside };
