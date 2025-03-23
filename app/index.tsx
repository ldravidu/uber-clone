import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text } from "react-native";

const Home = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    console.log("Signed In!");
    return <Redirect href="/(root)/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
