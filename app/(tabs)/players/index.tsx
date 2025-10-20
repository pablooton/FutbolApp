import FilterBadge from "@/components/FilterBadge";
import PlayerCard from "@/components/PlayerCard";
import SearchBar from "@/components/SearchBar";
import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";


type PlayerPositionFilter = {
  label: PlayerPositionLabel;
  value: PlayerPosition;
  active: boolean;
  onClick: () => void;
};

const PlayersScreen = () => {

    const db = getFirestore();
    const [players, setPlayers] = useState<Player[]>([]);

    const [filters, setFilters] = useState<PlayerPositionFilter[]>([
    { label: "GK", value: "Goalkeeper", active: false, onClick: () => toggleFilter("Goalkeeper") },
    { label: "DF", value: "Defender", active: false, onClick: () => toggleFilter("Defender") },
    { label: "MF", value: "Midfielder", active: false, onClick: () => toggleFilter("Midfielder") },
    { label: "FW", value: "Forward", active: false, onClick: () => toggleFilter("Forward") },
  ]);
   const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players);
    const [searchString, setSearchString] = useState<string>("");
  const [searchBarClicked, setSearchBarClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPlayers = () => {
    setLoading(true);
    getDocs(collection(db, "players"))
      .then(querySnapshot => {
        const queryPlayers: Player[] = [];
        querySnapshot.forEach(async snapshot => {
          const snapshotData = { ...snapshot.data() } as PlayerSnapshotData;
          const player = { id: snapshot.id, ...snapshotData };
          queryPlayers.push(player);
        });
        setPlayers(queryPlayers);
      })
      .catch(() => Alert.alert("Error loading players data"))
      .finally(() => setLoading(false));
  };

  useEffect(loadPlayers, []);

   const toggleFilter = (position: PlayerPosition) => {
    setFilters(previousFilters =>
      previousFilters.map(filter =>
        filter.value === position ? { ...filter, active: !filter.active } : filter
      )
    );
  };
   useEffect(() => {

    const lowerCaseSearchString = searchString.toLowerCase();
    const searchedPlayers = lowerCaseSearchString ? players.filter(player => player.name.toLowerCase().includes(lowerCaseSearchString)) : players;

    if (filters.every(filter => !filter.active)) {
      setFilteredPlayers(searchedPlayers);
      return;
    }
    
    setFilteredPlayers(searchedPlayers.filter(player => filters.find(filter => filter.active && filter.value === player.position)));
  }, [players, filters, searchString]);
  const edit = (player:Player) =>{
    router.push({
              pathname: "./players/form",
              params: {
                id: player.id,
              },
            });
  }

    const remove = (player : Player) => (
        Alert.alert("Remove Player",`Are you sure you want to remove ${player.name}?`,[
            {
                text:"Cancel",
                style:"cancel",
            },
            {
                text:"Remove",
                onPress: () => {
                  deleteDoc(doc(db,"players",player.id));
                  loadPlayers();
                }
            },
        ])
    );
     if (loading) {
    <Text style={styles.text}>Loading...</Text>;
  }
    return(
    <>
    <SearchBar
        placeholder="Enter player name..."
        clicked={searchBarClicked}
        setClicked={setSearchBarClicked}
        searchString={searchString}
        setSearchString={setSearchString}
      />
    <FlatList
        data={filters}
        keyExtractor={filter => filter.label}
        horizontal
        renderItem={({ item }) => (
            <FilterBadge
            label={item.label}
            active={item.active}
            onPress={item.onClick}
            />
        )}
        contentContainerStyle={{
            marginBottom:20,
            marginHorizontal: "auto",
            gap: 20,
            paddingVertical: 10,
            height: 60,
        }}
        />
    <FlatList
        data={filteredPlayers}
        keyExtractor={player => player.id}
        renderItem={({ item }) => (
        <PlayerCard
            player={item}
            edit={() => edit(item)}
            remove={() => remove(item)}
            />
        )}
        ListEmptyComponent={<Text style={styles.text}>No players found</Text>}
        refreshing={loading}
        onRefresh={loadPlayers}
    />
    </>
    );
}
const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 32,
    marginTop: 10,
  },
});

export default PlayersScreen;