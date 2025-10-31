import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const AuthScreen = () => {
  return (
    <ThemedView className="flex relative left-0 top-0 gap-6 items-center justify-center h-full">
      <ThemedText className="text-3xl font-bold">Maple</ThemedText>

      <ThemedView className="w-full flex p-5 px-10">
        {/* <ThemedView>
          <FontAwesome.Button
            style={{ height: 50 }}
            name="google"
            backgroundColor="#A58EFF"
          >
            Continue with Google
          </FontAwesome.Button>
        </ThemedView> */}

        <ThemedView className="mt-4">
          <FontAwesome.Button
            style={{ height: 50 }}
            name="inbox"
            backgroundColor="#A58EFF"
            onPress={() => router.push("login")}
          >
            Continue with Email
          </FontAwesome.Button>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default AuthScreen;
