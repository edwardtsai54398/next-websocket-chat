import { ConfigProvider, Button } from "antd";
import globalTheme from "../styles/designToken/globals";
import buttonTheme from "../styles/designToken/button";
import modalTheme from "../styles/designToken/modal";
import formTheme from "../styles/designToken/form";
import { inputTheme } from "../styles/designToken/input";

export default function MyConfigProvider({children}){
  return (
  <ConfigProvider
      theme={{
        token: globalTheme,
        components: {
          Button: buttonTheme,
          Modal: modalTheme,
          Form: formTheme,
          Input: inputTheme,
        },
      }}
    >
      {children}
    </ConfigProvider>
    )
}