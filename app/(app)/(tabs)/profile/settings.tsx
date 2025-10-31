import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { auth } from "@/firebase/firebase";
import { Image } from "expo-image";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  if (!auth.currentUser) return null;

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          <ThemedView className="mb-5 items-center">
            <ThemedView className="mb-4">
              {auth.currentUser.photoURL ? (
                <Image
                  contentFit="cover"
                  className="rounded-full bg-white border border-gray-200"
                  style={{ height: 100, width: 100 }}
                  source={auth.currentUser.photoURL}
                  alt=""
                />
              ) : (
                <ThemedView
                  style={{ height: 100, width: 100 }}
                  className="rounded-full items-center justify-center bg-white border border-gray-200"
                >
                  {auth.currentUser.email && (
                    <ThemedText className="text-4xl" type="title">
                      {auth.currentUser.email[0]}
                    </ThemedText>
                  )}
                </ThemedView>
              )}
            </ThemedView>

            <ThemedText>{auth.currentUser.email}</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={() => auth.signOut()}>
            <ThemedView>
              <ThemedText type="subtitle" className="underline">
                Log out
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default settings;
