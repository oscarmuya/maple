import { Dimensions, PixelRatio } from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { ThemedView } from "@/components/ThemedView";
import { Photo } from "@/types";
import { url } from "@/lib/server/server";

const { width } = Dimensions.get("window");

interface SliderProps {
  images: Photo[];
}

const Photos: React.FC<SliderProps> = ({ images }) => {
  const pixelRatio = PixelRatio.get();
  const actualWidth = width * pixelRatio;

  return (
    <ThemedView className="justify-center items-center">
      <Carousel
        windowSize={3}
        style={{ borderRadius: 16 }}
        mode="parallax"
        width={width - 24}
        height={width * 0.7}
        data={images}
        scrollAnimationDuration={200}
        renderItem={({ item }) => (
          <ThemedView className="bg-gray-200">
            <Image
              className="w-full bg-gray-200 h-full"
              source={`${url}/photo?width=${actualWidth}&photo_reference=${item.name}`}
            />
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

export default Photos;
