import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginScreen = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (formData: { email: string, password: string; }) => {
    if (formData.email === "admin@liceolapaz.net") {
      await AsyncStorage.setItem("userEmail",formData.email);
      router.push("/teams");
    }
    else {
      Alert.alert("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        autoCompleteType="email"
        inputMode="email"
        placeholder="Enter your email address"
      />
      <FormInput
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your password"
        secureTextEntry
      />
       <Link href="/register" style={styles.link}>
          <Text style={styles.linkText}>
            Don´t have an Account ? Register here  
          </Text>
        </Link>
      <Button text="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap:20,
  },
  link: {
    marginTop:10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  
  linkText: {
    color:"blue",

  },
});

export default LoginScreen;