import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{ headerTitleStyle: { fontFamily: "Jost_600SemiBold" } }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="checklists"
        options={{ headerShown: true, headerTitle: "Your checklists" }}
      />
      <Stack.Screen
        name="currency"
        options={{ headerShown: true, headerTitle: "Choose your currency" }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: true, headerTitle: "Settings" }}
      />
      <Stack.Screen
        name="preferences"
        options={{ headerShown: true, headerTitle: "My preferences" }}
      />
    </Stack>
  );
};

export default ProfileLayout;
