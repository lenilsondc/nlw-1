import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  state: string;
  city: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  useEffect(() => {
    api.get<Item[]>("items").then((res) => {
      setItems(res.data);
    });
  }, []);

  useEffect(() => {
    async function loadDefaultPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Ops!", "We need permition to get your location.");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadDefaultPosition();
  }, []);

  useEffect(() => {
    api
      .get<Point[]>("points", {
        params: {
          city: routeParams.city,
          state: routeParams.state,
          items: selectedItems,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPoints(res.data);
      });
  }, [selectedItems]);

  function handleNavigateToDetail(point: Point) {
    navigate("Detail", { point_id: point.id });
  }

  function handleSelectItem({ id }: Item) {
    const alreadySelected = selectedItems.some((item) => item === id);

    if (alreadySelected) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
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
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>

        <View style={styles.itemsContainer}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {},
                ]}
                activeOpacity={0.6}
                onPress={() => handleSelectItem(item)}
              >
                <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
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
