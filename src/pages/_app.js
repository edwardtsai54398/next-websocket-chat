import { Inter } from "next/font/google";
import { Global } from "@emotion/react";
import classNames from "@/styles/emotion/classNames";
import "../styles/globals.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";

//icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
library.add(faCommentDots);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function MyApp({ Component, pageProps }) {
  // connectDB();
  const router = useRouter();

  useEffect(() => {
    const handleRouterChange = (url) => {

      if (router.pathname === "/" && url === "/login") {
        sessionStorage.removeItem("user-credential");
        sessionStorage.removeItem("user-info");
      }
    };
    if (router.pathname === "/login") {
      sessionStorage.removeItem("user-credential");
      sessionStorage.removeItem("user-info");
    }

    router.events.on("routeChangeStart", handleRouterChange);

    return () => {
      router.events.off("routeChangeStart", handleRouterChange);
      console.log("handleRouterChange clear");
    };
  }, [router.pathname]);
  return (
    <>
      <Global styles={classNames} />
      <Component {...pageProps}></Component>
    </>
  );
}
