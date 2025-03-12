import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { createAccount } from "../../services/appwrite";
import { router } from "expo-router";
import { useAuth } from "../AuthProvider";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const {isLogged,setIsLogged} = useAuth()
  const [error,setError] = useState('')

  const handleSignup = async () => {
    const res = await createAccount({ email, password, name });
    if(res.error){
        setError(res.error)
    }else{
    setIsLogged(true)
    router.replace("/(tabs)"); // Navigate to home after signup
    }
  };

  return (
    <View className="bg-primary" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text className="text-white text-2xl">Signup</Text>
      <TextInput className="bg-slate-200 m-4 w-52 rounded-md p-2" placeholder="Name" onChangeText={setName} />
      <TextInput className="bg-slate-200 m-4 w-52 rounded-md p-2" placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput className="bg-slate-200 m-4 w-52 rounded-md p-2" placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity className="bg-accent" onPress={handleSignup}>
        <Text className="text-white px-4 py-2 rounded-lg">SIGN UP</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
}
