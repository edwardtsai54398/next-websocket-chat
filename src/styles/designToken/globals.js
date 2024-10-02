import { themeColor } from "../colors/theme";
import { bgColor } from "../colors/background";
import { textColor } from "../colors/text";
import { primaryBtn, dangerBtn, infoBtn } from "../colors/button";

const lineColor = {
  prim: "#D7DAE0",
  second: "#5C6370",
};

const globalTheme = {
  colorBgContainer: bgColor.third,
  colorBgContainerDisabled: bgColor.second,
  // colorBgTextActive,
  colorPrimary: themeColor.prim,
  colorPrimaryBorder: themeColor.prim,
  colorPrimaryHover: primaryBtn.hover,
  colorPrimaryActive: primaryBtn.active,
  colorLink: themeColor.prim,
  colorLinkHover: primaryBtn.hover,
  colorLinkActive: primaryBtn.active,
  colorError: themeColor.danger,
  colorErrorHover: dangerBtn.hover,
  colorErrorBorderHover: dangerBtn.hover,
  colorText: textColor.default,
  colorTextDisabled: textColor.disabled,
  colorBorder: textColor.default,
  // colorTextLightSolid: textColor.highlight,
};

export default globalTheme;
