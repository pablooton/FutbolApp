import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from 'expo-router';
import { Alert, Pressable } from "react-native";


const TabLayout = () => {
  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout", onPress: () => {
          router.dismissAll();
          router.push("/");
        }
      },
    ]);
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="teams"
        options={{
          title: "Teams",
          tabBarIcon: ({ color }) => <FontAwesome name="shield" color={color} size={28} />,
          headerLeft: () =>
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={25}
                  color="black"
                  style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>,
          headerRight: () =>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="plus-circle"
                  size={25}
                  color="black"
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: "Players",
          tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={28} />,
          headerLeft: () =>
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={25}
                  color="black"
                  style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>,
          headerRight: () =>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="plus-circle"
                  size={25}
                  color="black"
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;