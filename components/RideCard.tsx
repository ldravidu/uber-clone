import { Ride } from "@/types/type";
import { View, Text } from "react-native";

const RideCard = ({
  ride: {
    destination_longitude,
    destination_latitude,
    destination_address,
    origin_address,
    origin_longitude,
    origin_latitude,
    created_at,
    ride_time,
    driver,
    driver_id,
    payment_status,
  },
}: {
  ride: Ride;
}) => (
  <View>
    <Text className="text-3xl">{driver.first_name}</Text>
  </View>
);

export default RideCard;
