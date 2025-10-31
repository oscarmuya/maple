import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PlaceData } from "@/types";

type Props = {
  details: PlaceData;
  focused?: boolean;
};

const PlacePin = ({ details, focused }: Props) => {
  return (
    <>
      <ThemedView
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        className={`${
          focused ? "bg-primary" : "bg-white"
        } rounded border p-1 px-2`}
      >
        <ThemedView>
          <ThemedText
            className={`${focused && "text-white"} text-xs text-center`}
          >
            {details.displayName.text}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView className="items-center">
        <ThemedView
          style={{
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderBottomWidth: 5,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "black",
            transform: [{ rotate: "180deg" }],
          }}
        />
      </ThemedView>
    </>
  );
};

export default PlacePin;
