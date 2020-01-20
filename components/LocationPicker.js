import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Colors from "../constants/Colors";

const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const mapPickedLocation = props.navigation.getParam("pickedLocation");
  const { onLocationPicked } = props;
  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);

    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient Permissions",
        "You need to grant location permission to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 50000
      });

      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (err) {
      Alert.alert(
        "Could not fetch location",
        "Please try again later or pick a location on map",
        [{ text: "Okay" }]
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <View style={styles.locationPicker}>
      <TouchableOpacity onPress={pickOnMapHandler}>
        <View style={styles.mapPreview}>
          {pickedLocation ? (
            <View>
              <Text>{pickedLocation.lat}</Text>
              <Text>{pickedLocation.lng}</Text>
            </View>
          ) : isFetching ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text>No location chosen yet!</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <Button
          title="Get User Location"
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Pick On Map"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  }
});

export default LocationPicker;
