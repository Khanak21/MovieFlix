import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthProvider";
import { getCurrentUser, logout } from "@/services/appwrite";
import { useEffect, useState } from "react";

const Profile = () => {
    const router = useRouter();
    const {isLogged,setIsLogged} = useAuth()
    const [user, setUser] = useState<any>(null);
    
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData.user);
        console.log(userData.user)
      }
    };
    fetchUser();
  }, []);

      const handleLogout = async () => {
        await logout();
        setIsLogged(false)
        router.replace("/(tabs)"); // Navigate to home after logout
      };
  
  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        { user ? (
        <>
        <Image source={icons.person} className="size-10" tintColor="#fff" />
        <Text className="text-gray-500 text-base">Profile</Text>
        <Text className="text-gray-500 text-base">{user.name}</Text>
        <Text className="text-gray-500 text-base">{user.email}</Text>
        
        <TouchableOpacity
        className=" mx-5 bg-accent rounded-lg p-3.5 flex flex-row items-center justify-center z-50"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
        </> ) : (
        <>
        <TouchableOpacity
        className=" mx-5 bg-accent rounded-lg p-3.5 flex flex-row items-center justify-center z-50"
        onPress={()=>router.replace("/auth/signup")}
      >
        <Text className="text-white font-semibold text-base">Sign up</Text>
      </TouchableOpacity>
      <Text className="text-light-300">OR</Text>
      <TouchableOpacity
        className=" mx-5 bg-accent rounded-lg p-3.5 flex flex-row items-center justify-center z-50"
        onPress={()=>router.replace("../auth/login")}
      >
        <Text className="text-white font-semibold text-base">Login</Text>
      </TouchableOpacity>
      </>
      )
      }
      </View>
    </SafeAreaView>
  );
};

export default Profile;