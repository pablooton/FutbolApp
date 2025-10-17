import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type TeamCardProps = {
    team: Team;
    edit : () => void;
    remove: () => void;
};
const TeamCard: React.FC<TeamCardProps> = ({team,edit,remove}) => {
    const logo = team.logo ? {uri: team.logo} : require('@/assets/images/default-team-logo.png')
return (

    <View style={styles.container}>
        <Image style={styles.logo} source={logo}/>
        <View style={styles.detailsContainer}>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.location}>{team.location.city} ({team.location.country})</Text>
            <Text style={styles.stadium}>{team.stadium.name} ({team.stadium.capacity})</Text>
            <View style={styles.iconContainer}>
                <Pressable onPress={edit}>
                    {
                        ({pressed}) => <FontAwesome name="pencil" size={24} color="black" style={{opacity:pressed ? 0.5 : 1.0}}/>
                    }
                </Pressable>
                 <Pressable onPress={remove}>
                    {
                        ({pressed}) => <FontAwesome name="trash" size={24} color="black" style={{opacity:pressed ? 0.5 : 1.0}}/>
                    }
                </Pressable>
            </View>
        </View>
    </View>
        );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    margin: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  detailsContainer: {
    marginHorizontal: 20,
    justifyContent: "center",
    width: "65%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 16,
  },
  stadium: {
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 10,
  },
});

export default TeamCard;