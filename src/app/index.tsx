import { useEffect } from "react";
import App from "@/App";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";




SplashScreen.preventAutoHideAsync();
export default function Index() {
  const [loaded] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
