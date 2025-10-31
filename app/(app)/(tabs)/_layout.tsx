import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 55, elevation: 0 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "map-pin" : "map-pin"} color={color} />
          ),
          tabBarLabel(props) {
            return (
              <ThemedText
                style={{ color: props.color }}
                type="subtitle"
                className="text-sm"
              >
                {props.children}
              </ThemedText>
            );
          },
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "car" : "car"} color={color} />
          ),
          tabBarLabel: (props) => (
            <ThemedText
              style={{ color: props.color }}
              type="subtitle"
              className="text-sm"
            >
              {props.children}
            </ThemedText>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "user" : "user"} color={color} />
          ),
          tabBarLabel: (props) => (
            <ThemedText
              style={{ color: props.color }}
              type="subtitle"
              className="text-sm"
            >
              {props.children}
            </ThemedText>
          ),
        }}
      />
    </Tabs>
  );
}
