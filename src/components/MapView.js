import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import MapView, { Circle } from "react-native-maps";

const InteractiveMapView = ({ region }) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const handleDoubleTap = () => {
    setScrollEnabled(!scrollEnabled);
  };

  return (
    <View>
      {!scrollEnabled && (
        <TouchableOpacity
          style={styles.mapOverlay}
          onPress={handleDoubleTap}
          activeOpacity={1}
        >
          <Text style={styles.mapOverlayText}>
            Double-tap to interact with the map
          </Text>
        </TouchableOpacity>
      )}
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        scrollEnabled={scrollEnabled}
      >
        <Circle
          center={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          radius={700}
          fillColor="rgba(255, 0, 0, 0.5)"
          strokeColor="transparent"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 300,
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  mapOverlayText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InteractiveMapView;

