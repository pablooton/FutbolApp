
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type PlayerCardProps = {
    player: Player;
    edit : () => void;
    remove: () => void;
};
const PlayerCard: React.FC<PlayerCardProps> = ({player,edit,remove}) => {
    const db = getFirestore();
    const photo = player.logo ? {uri: player.logo} : require('@/assets/images/default-player-photo.png')
    const [team, setTeam] = useState<Team>();
    useEffect(() => {
    if (!player.teamId) {
      setTeam(undefined);
      return;
    }

    getDoc(doc(db, "teams", player.teamId))
      .then(snapshot => {
        if (snapshot.exists()) {
          const snapshotData = { ...snapshot.data() } as TeamSnapshotData;
          const snapshotTeam = { id: snapshot.id, ...snapshotData };
          setTeam(snapshotTeam);
        } else {
          setTeam(undefined);
        }
      })
      .catch(() => setTeam(undefined));
  }, [player.teamId]);
    
return (

    <View style={styles.container}>
        <Image style={styles.photo} source={photo}/>
        <View style={styles.detailsContainer}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.position}>{player.position}</Text>
            {team &&<Text style={styles.teamName}>{team.name}</Text>}
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
  photo: {
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
  teamName:{
    fontSize:16,
  },
  position:{
    fontSize:16,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 10,
  },
});

export default PlayerCard;