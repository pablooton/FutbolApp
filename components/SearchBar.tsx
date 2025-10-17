import { FontAwesome } from "@expo/vector-icons";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  placeholder: string;
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, clicked, setClicked, searchString, setSearchString }) =>
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <FontAwesome name="search" size={20} color="black" />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={searchString}
        onChangeText={setSearchString}
        onFocus={() => {
          setClicked(true);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        inputMode="text"
        keyboardType="default"
        placeholderTextColor="#888"
      />
      {clicked && (
        <FontAwesome
          name="remove"
          size={20}
          color="black"
          onPress={() => {
            if (searchString) {
              setSearchString("");
            } else {
              Keyboard.dismiss();
              setClicked(false);
            }
          }}
        />
      )}
    </View>
  </View>;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});

export default SearchBar;