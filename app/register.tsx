import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword:z.string().min(6,"Password must be at least 6 characters")
});

const RegisterScreen = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword:"",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = (formData: { email: string, password: string; confirmPassword: string }) => {
    if(formData.password !== formData.confirmPassword){
        Alert.alert("Password don´t match");
        return;
    }
    if (formData.email !== "admin@liceolapaz.net") {
      router.push("/teams");
    }
    else {
      Alert.alert("Account already exists");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <FormInput
        control={control}
        name="confirmPassword"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Confirm your password"
        secureTextEntry
      />
      <Link href="/" style={styles.link}>
    <Text style={styles.linkText}>
        Already have an Account? Login here
        </Text>
    </Link>
      <Button text="Register" onPress={handleSubmit(onSubmit)} />
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

export default RegisterScreen;