import { primaryColor } from "@/constants/variables";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  starSize?: number;
  starColor?: string;
  emptyStarColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  starSize = 20,
  starColor = primaryColor,
  emptyStarColor = "#D3D3D3",
}) => {
  const renderStar = (position: number) => {
    const isFilled = position <= rating;
    const isHalfFilled = position > rating && position - 0.5 <= rating;

    if (isFilled) {
      return <Ionicons name="star" size={starSize} color={starColor} />;
    } else if (isHalfFilled) {
      return <Ionicons name="star-half" size={starSize} color={starColor} />;
    } else {
      return (
        <Ionicons name="star-outline" size={starSize} color={emptyStarColor} />
      );
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(maxStars)].map((_, index) => (
        <View key={index}>{renderStar(index + 1)}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default StarRating;
