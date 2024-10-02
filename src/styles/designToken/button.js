import { primaryBtn, dangerBtn, infoBtn } from "../colors/button";
import { themeColor } from "../colors/theme";
import { textColor } from "../colors/text";

const buttonTheme = {
  contentFontSizeLG: 16,
  contentFontSizeSM: 12,
  borderColorDisabled: textColor.disabled,
  primaryColor: "#FFF",
  primaryShadow: "none",
  dangerColor: "#FFF",
  dangerShadow: "none",
  defaultColor: infoBtn.text,
  defaultBorderColor: themeColor.info,
  defaultBg: themeColor.info,
  defaultShadow: "none",
  defaultHoverColor: infoBtn.text,
  defaultHoverBg: infoBtn.hover,
  defaultHoverBorderColor: infoBtn.hover,
  defaultActiveBg: infoBtn.active,
  defaultActiveBorderColor: infoBtn.active,
  defaultActiveColor: textColor.default,
  defaultGhostBorderColor: themeColor.info,
  defaultGhostColor: infoBtn.text,
  primaryShadow: "none",
  textHoverBg: "tranparent",
};
export default buttonTheme;
