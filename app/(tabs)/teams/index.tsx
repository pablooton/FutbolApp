import TeamCard from "@/components/TeamCard";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";


const teamsScreen = () => {
   const db = getFirestore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTeams = () => {
    setLoading(true);
    getDocs(collection(db, "teams"))
      .then(querySnapshot => {
        const queryTeams: Team[] = [];
        querySnapshot.forEach(snapshot => {
          const snapshotData = { ...snapshot.data() } as TeamSnapshotData;
          const team = { id: snapshot.id, ...snapshotData };
          queryTeams.push(team);
        });
        setTeams(queryTeams);
      })
      .catch(() => Alert.alert("Error loading teams data"))
      .finally(() => setLoading(false));
  };

  useEffect(loadTeams, []);
    const edit = (team : Team) => console.log(`Editing $ {team.name}) (id: $ {team.id})`);
    const remove = (team : Team) => (
        Alert.alert("Remove Team",`Are you sure you want to remove ${team.name}?`,[
            {
                text:"Cancel",
                style:"cancel",
            },
            {
                text:"Remove",
                onPress: () => setTeams(previousTeams => previousTeams.filter(t => t.id !== team.id)),
            },
        ])
    );
    if (loading) {
    <Text style={styles.text}>Loading...</Text>;
  }
    return (
    <FlatList
      data={teams}
      keyExtractor={team => team.id}
      renderItem={({ item }) => (
        <TeamCard
          team={item}
          edit={() => console.log(`Editing ${item.name} (id: ${item.id})`)}
          remove={() => remove(item)}
        />
      )}
      ListEmptyComponent={<Text style={styles.text}>No teams found</Text>}
      refreshing={loading}
      onRefresh={loadTeams}
    />
  );
};
const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 32,
    marginTop: 10,
  },
});

export default teamsScreen;