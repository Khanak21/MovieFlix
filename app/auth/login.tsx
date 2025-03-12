import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { login } from "../../services/appwrite";
import { router } from "expo-router";
import {useAuth} from "../AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");

  const {isLogged,setIsLogged} = useAuth()
  console.log(isLogged)
  const handleLogin = async () => {
    setError('')

    const session = await login({ email, password });
    if(session.error){
        setError(session.error)
    }else{
        setIsLogged(true);
        router.replace("/(tabs)");
    }
  };

  return (
    <View className="bg-primary" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text className="text-white text-2xl">Login</Text>
      <TextInput className="bg-slate-200 m-4 w-52 rounded-md p-2" placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput className="bg-slate-200 m-4 w-52 rounded-md p-2" placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity className="bg-accent" onPress={handleLogin}>
        <Text className="text-white px-4 py-2 rounded-lg">Login</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
}
