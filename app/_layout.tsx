import { Stack } from "expo-router";
import { useState } from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "./AuthProvider";

export default function RootLayout() {

  return (
  <>
  {/* To hide the time and battery bar */}
  <AuthProvider>
    <StatusBar hidden = {true}/>
    <Stack>
    
     <Stack.Screen
      name="(tabs)"
      options={{headerShown:false}}
    />
     <Stack.Screen
      name="movie/[id]"
      options={{headerShown:false}}
    />
    <Stack.Screen
      name="auth/signup"
      options={{headerShown:false}}
    />
    <Stack.Screen
      name="auth/login"
      options={{headerShown:false}}
    />

    </Stack>
    </AuthProvider>
  </>
  )
}
