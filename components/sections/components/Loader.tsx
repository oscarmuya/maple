import { ThemedView } from "@/components/ThemedView";
import AnimatedLottieView from "lottie-react-native";

const Loader = () => {
  return (
    <ThemedView className="relative w-full items-center justify-center">
      <AnimatedLottieView
        source={require("../../../assets/lottie/loader_2.json")}
        autoPlay
        style={{ width: 140, height: 60 }}
        loop
      />
    </ThemedView>
  );
};

export default Loader;
