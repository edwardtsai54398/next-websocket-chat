import { css } from "@emotion/react";
import { bgColor } from "@/styles/colors/background";
import { textColor } from "@/styles/colors/text";
import { fontSize, fontFamily } from "@/styles/base/font";
import { borderColor, borderRadius } from "../base/border";

const classNames = () => {
  const generateCssClassName = (prfixString, cssAttribute, objectMap) => {
    let cssStr = "";
    for (const [key, value] of Object.entries(objectMap)) {
      cssStr += `.${prfixString}-${key} { ${cssAttribute}: ${value} !important; }\n`;
    }
    return cssStr;
  };
  let borderStr = "";
  for (const [key, value] of Object.entries(borderColor)) {
    for (let i = 1; i < 4; i++) {
      borderStr += `
      .line-${i} { border: ${i}px solid ${value} !important; }\n
      .line-t-${i} {border-top: ${i}px solid ${value} !important; }\n
      .line-b-${i} {border-bottom: ${i}px solid ${value} !important; }\n
      .line-e-${i} {border-right: ${i}px solid ${value} !important; }\n
      .line-s-${i} {border-left: ${i}px solid ${value} !important; }\n
      `;
    }
  }

  return css`
    ${generateCssClassName("bg", "background-color", bgColor)}
    ${generateCssClassName("text", "color", textColor)}
    ${generateCssClassName("font", "font-size", fontSize)}
    ${generateCssClassName("font", "font-family", fontFamily)}
    ${generateCssClassName("round", "border-radius", borderRadius)}
    ${borderStr}
  `;
};

export default classNames;
