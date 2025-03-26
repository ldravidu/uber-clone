import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import * as Location from "expo-location";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "@/lib/fetch";

const recentRides = [
  {
    ride_id: "1",
    origin_address: "Colombo, Sri Lanka",
    destination_address: "Kandy, Sri Lanka",
    origin_latitude: "6.927079",
    origin_longitude: "79.861244",
    destination_latitude: "7.290572",
    destination_longitude: "80.633728",
    ride_time: 120,
    fare_price: "8500.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 07:30:15.620007",
    driver: {
      driver_id: "1",
      first_name: "Nimal",
      last_name: "Perera",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 4,
      rating: "4.50",
    },
  },
  {
    ride_id: "2",
    origin_address: "Galle, Sri Lanka",
    destination_address: "Mirissa, Sri Lanka",
    origin_latitude: "6.053519",
    origin_longitude: "80.220978",
    destination_latitude: "5.949240",
    destination_longitude: "80.458244",
    ride_time: 45,
    fare_price: "3500.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "2",
    created_at: "2024-08-12 09:45:22.683046",
    driver: {
      driver_id: "2",
      first_name: "Kamal",
      last_name: "Silva",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 5,
      rating: "4.75",
    },
  },
  {
    ride_id: "3",
    origin_address: "Negombo, Sri Lanka",
    destination_address: "Sigiriya, Sri Lanka",
    origin_latitude: "7.209200",
    origin_longitude: "79.836601",
    destination_latitude: "7.957000",
    destination_longitude: "80.760000",
    ride_time: 180,
    fare_price: "12000.00",
    payment_status: "paid",
    driver_id: 3,
    user_id: "3",
    created_at: "2024-08-12 12:15:10.809053",
    driver: {
      driver_id: "3",
      first_name: "Sunil",
      last_name: "Fernando",
      profile_image_url:
        "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
      car_image_url:
        "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
      car_seats: 4,
      rating: "4.60",
    },
  },
  {
    ride_id: "4",
    origin_address: "Anuradhapura, Sri Lanka",
    destination_address: "Polonnaruwa, Sri Lanka",
    origin_latitude: "8.311352",
    origin_longitude: "80.403650",
    destination_latitude: "7.932857",
    destination_longitude: "81.008087",
    ride_time: 90,
    fare_price: "6000.00",
    payment_status: "paid",
    driver_id: 4,
    user_id: "4",
    created_at: "2024-08-12 15:20:45.297838",
    driver: {
      driver_id: "4",
      first_name: "Ruwan",
      last_name: "Bandara",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.85",
    },
  },
  {
    ride_id: "5",
    origin_address: "Nuwara Eliya, Sri Lanka",
    destination_address: "Ella, Sri Lanka",
    origin_latitude: "6.949700",
    origin_longitude: "80.789100",
    destination_latitude: "6.869900",
    destination_longitude: "81.046500",
    ride_time: 60,
    fare_price: "4500.00",
    payment_status: "paid",
    driver_id: 5,
    user_id: "5",
    created_at: "2024-08-12 17:55:30.297838",
    driver: {
      driver_id: "5",
      first_name: "Chamara",
      last_name: "Rajapaksa",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.90",
    },
  },
];

export default function HomeScreen() {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const { data: recentRides, loading } = useFetch(`/(api)/ride/${user?.id}`);

  const { hasPermissions, setHasPermissions } = useState(false);

  const handleSignOut = () => {
    // signOut();
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // latitude: 37.78825,
        // longitude: -122.4324,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };
    requestLocation();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm text-neutral-400">
                  No recent rides found
                </Text>
              </>
            ) : (
              <ActivityIndicator size="large" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaBold">
                Welcome,{" "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}
                !
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-5 h-5" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
