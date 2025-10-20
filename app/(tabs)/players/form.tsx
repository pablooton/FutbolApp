import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  logo: z.string().url().or(z.literal("")),
});

const PlayerFormScreen = () => {
  const { id } = useLocalSearchParams();
  const db = getFirestore();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      logo: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const positionData = [
    { label: "Goalkeeper (GK)", value: "Goalkeeper" },
    { label: "Defender (DF)", value: "Defender" },
    { label: "Midfielder (MF)", value: "Midfielder" },
    { label: "Forward (FK)", value: "Forward" },
  ];
  const [selectedPosition, setSelectedPosition] = useState("Goalkeeper");
  const [teamData, setTeamData] = useState([{ label: "No team", value: "" }]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getDocs(query(collection(db, "teams"), orderBy("name")))
      .then(querySnapshot => {
        const queryTeams: Team[] = [];
        querySnapshot.forEach(snapshot => {
          const snapshotData = { ...snapshot.data() } as TeamSnapshotData;
          const team = { id: snapshot.id, ...snapshotData };
          queryTeams.push(team);
        });
        setTeamData([
          { label: "No team", value: "" },
          ...queryTeams.map(team => ({ label: team.name, value: team.id })),
        ]);
      });

    if (!id) {
      setLoading(false);
    } else {
      getDoc(doc(db, "players", `${id}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const snapshotData = { ...snapshot.data() } as PlayerSnapshotData;
            setValue("name", snapshotData.name);
            setSelectedPosition(snapshotData.position);
            setSelectedTeamId(snapshotData.teamId ? snapshotData.teamId : "");
            setValue("logo", snapshotData.logo ? snapshotData.logo : "");
          }
        }).finally(() => setLoading(false));
    }
  }, [id]);


  const onSubmit = async (formData: { name: string, logo: string; }) => {
    if (!positionData.find(position => position.value === selectedPosition)) {
      Alert.alert("Please select a position");
      return;
    }

    const playerData = {
      name: formData.name,
      position: selectedPosition,
      teamId: selectedTeamId,
      photo: formData.logo,
    };

    if (id) {
      await setDoc(doc(db, "players", `${id}`), playerData);
    } else {
      await addDoc(collection(db, "players"), playerData);
    }
    router.back();
  };

  if (loading) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player</Text>
      <FormInput
        control={control}
        name="name"
        autoCapitalize="words"
        inputMode="text"
        placeholder="Enter name"
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={positionData}
        search
        labelField="label"
        valueField="value"
        placeholder="Select position"
        searchPlaceholder="Search..."
        value={selectedPosition}
        onChange={item => setSelectedPosition(item.value)}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={teamData}
        search
        labelField="label"
        valueField="value"
        placeholder="Select team ID"
        searchPlaceholder="Search..."
        value={selectedTeamId}
        onChange={item => setSelectedTeamId(item.value)}
      />
      <FormInput
        control={control}
        name="photo"
        autoCapitalize="none"
        inputMode="url"
        placeholder="Enter photo URL"
      />
      <View style={styles.buttonContainer}>
        <Button text="Cancel" onPress={() => router.back()} />
        <Button text="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 32,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#ccc",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 50,
  },
});

export default PlayerFormScreen;