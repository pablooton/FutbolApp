import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  stadiumName: z.string().min(1),
  capacity: z.string()
    .transform(value => (value === "" ? "" : Number(value)))
    .refine(value => !isNaN(Number(value)), {
      message: "Expected number, received string",
    })
    .refine(value => Number(value) > 0, {
      message: "Expected positive number"
    })
    .refine(value => Number.isInteger(value), {
      message: "Expected integer number"
    }),
  logo: z.string().url().or(z.literal("")),
});

const TeamFormScreen = () => {
  const { id } = useLocalSearchParams();
  const db = getFirestore();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      city: "",
      country: "",
      stadiumName: "",
      capacity: "",
      logo: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    getDoc(doc(db, "teams", `${id}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          const snapshotData = { ...snapshot.data() } as TeamSnapshotData;
          setValue("name", snapshotData.name);
          setValue("city", snapshotData.location.city);
          setValue("country", snapshotData.location.country);
          setValue("stadiumName", snapshotData.stadium.name);
          setValue("capacity", "" + snapshotData.stadium.capacity);
          setValue("logo", snapshotData.logo ? snapshotData.logo : "");
        }
      });
  }, [id]);


  const onSubmit = async (formData: { name: string, city: string; country: string; stadiumName: string; capacity: number | "", logo: string; }) => {
    const teamData = {
      name: formData.name,
      location: {
        city: formData.city,
        country: formData.country,
      },
      stadium: {
        name: formData.stadiumName,
        capacity: +formData.capacity,
      },
      logo: formData.logo,
    };

    if (id) {
      await setDoc(doc(db, "teams", `${id}`), teamData);
    } else {
      await addDoc(collection(db, "teams"), teamData);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team</Text>
      <FormInput
        control={control}
        name="name"
        autoCapitalize="words"
        inputMode="text"
        placeholder="Enter team's name"
      />
      <FormInput
        control={control}
        name="city"
        autoCapitalize="words"
        inputMode="text"
        placeholder="Enter city"
      />
      <FormInput
        control={control}
        name="country"
        autoCapitalize="words"
        inputMode="text"
        placeholder="Enter country"
      />
      <FormInput
        control={control}
        name="stadiumName"
        autoCapitalize="words"
        inputMode="text"
        placeholder="Enter stadium's name"
      />
      <FormInput
        control={control}
        name="capacity"
        inputMode="numeric"
        placeholder="Enter stadium's capacity"
      />
      <FormInput
        control={control}
        name="logo"
        autoCapitalize="none"
        inputMode="url"
        placeholder="Enter logo URL"
      />
      <View style={styles.buttonContainer}>
        <Button text="Cancel" onPress={() => router.back()} />
        <Button text="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonContainer: {
    flexDirection: "row",
    gap: 50,
  },
});