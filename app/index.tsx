import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const IndexScreen = () => (
    <View style={styles.container}>
        <Link href="/players" style={styles.link}>
            <Text style={styles.linkText}>Go to players screen</Text>
        </Link>
        <Link href="/teams" style={styles.link}>
            <Text style={styles.linkText} >Go to teams screen</Text>
        </Link>
    </View>
);

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    padding: 20,
  },
  linkText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default IndexScreen;