import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet
} from "react-native";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as placesActions from "../store/places-actions";
import ImagePicker from "../components/ImagePicker";
import LocationPicker from "../components/LocationPicker";

const NewPlaceScreen = props => {
  const [titleValue, setTitleValue] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const disptach = useDispatch();
  const titleChangeHandler = text => {
    setTitleValue(text);
  };

  const savePressHandler = () => {
    disptach(
      placesActions.addPLace(titleValue, selectedImage, selectedLocation)
    );
    props.navigation.goBack();
  };

  const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location);
  }, []);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />

        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />

        <Button
          title="Save Place"
          color={Colors.primary}
          onPress={savePressHandler}
        />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: "Add Place"
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4
  }
});

export default NewPlaceScreen;
