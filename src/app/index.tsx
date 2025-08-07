import { useEffect } from "react";
import App from "@/App";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";




SplashScreen.preventAutoHideAsync();
export default function Index() {
  const [loaded] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
const _err = console.error;
console.error = (...args) => {
  const msg = String(args[0] || "");
  if (msg.includes("Invalid prop `style` supplied to `React.Fragment`")) {
    // Throw to get a red screen with a precise component stack
    throw new Error(msg);
  }
  _err(...args);
};

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <App />;
}
