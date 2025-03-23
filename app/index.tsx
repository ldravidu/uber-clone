import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

const Home = () => {
  const { isSignedIn, isLoaded } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10,
    },
  });

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
