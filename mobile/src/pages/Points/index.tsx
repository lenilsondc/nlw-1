import React from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  RectButton,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";

const Points = () => {
  const { goBack, navigate } = useNavigation();

  function handleNavigateToDetail() {
    navigate("Detail");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left" color="#34cb79" size={20} />
        </TouchableOpacity>

        <Text style={styles.title}>Wellcome!</Text>
        <Text style={styles.description}>
          Find a collection point on the map.
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -22.5461407,
              longitude: -48.6357348,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              style={styles.mapMarker}
              onPress={handleNavigateToDetail}
              coordinate={{
                latitude: -22.5461407,
                longitude: -48.6357348,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      "https://images.unsplash.com/photo-1540661116512-12e516d30ce4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
                  }}
                />
                <Text style={styles.mapMarkerTitle}>Market</Text>
              </View>
            </Marker>
          </MapView>
        </View>

        <View style={styles.itemsContainer}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.item}>
              <SvgUri
                width={42}
                height={42}
                uri="http://192.168.0.111:3333/assets/lamps.svg"
              />
              <Text style={styles.itemTitle}>Lamps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <SvgUri
                width={42}
                height={42}
                uri="http://192.168.0.111:3333/assets/lamps.svg"
              />
              <Text style={styles.itemTitle}>Lamps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <SvgUri
                width={42}
                height={42}
                uri="http://192.168.0.111:3333/assets/lamps.svg"
              />
              <Text style={styles.itemTitle}>Lamps</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Points;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
