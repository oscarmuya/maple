import AnimatedLottieView from "lottie-react-native";
import { ThemedView } from "../ThemedView";
import { Image } from "expo-image";

const Loader = () => {
  return (
    <ThemedView className="flex bg-white h-full items-center justify-center">
      <Image
        className="h-full w-full"
        contentFit="contain"
        source={require("../../assets/images/splash.png")}
      />
      {/* <ThemedView className="relative w-full items-center justify-center">
        <AnimatedLottieView
          source={require("../../assets/lottie/loader.json")}
          autoPlay
          style={{ width: 75, height: 40 }}
          loop
        />
      </ThemedView> */}
    </ThemedView>
  );
};

export default Loader;
