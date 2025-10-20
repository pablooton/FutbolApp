import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, Link, router, Tabs, usePathname } from 'expo-router';
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";


const TabLayout = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getUserEmail = async () => {
      setLoadingUser(true);
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
      setLoadingUser(false);
    };

    getUserEmail();
  }, []);

  if (loadingUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (!userEmail) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Please login to view this page</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    );
  }

const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout", onPress: () => {
          const auth = getAuth();
          signOut(auth).then(async () => {
            await AsyncStorage.removeItem("userEmail");
            router.dismissAll();
            router.push("/");
          }).catch(() => {
            Alert.alert("Error during logout process");
          });
        }
      },
    ]);
  }
   const goToForm = () => {
    const path = `${pathname}/form` as Href;
    router.push(path);
  };

  const validPathname = () => pathname === "/teams" || pathname === "/players";


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
            validPathname() &&
            <Pressable onPress={goToForm}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    fontSize: 20,
  },
  error: {
    fontSize: 20,
    color: "red",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

export default TabLayout;