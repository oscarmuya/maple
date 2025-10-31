import {
  ClickEvent,
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { ThemedView } from "../ThemedView";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import {
  getLocation,
  setClickedLocation,
  setFocusedRegion,
} from "@/lib/store/features/locationSlice";
import { useEffect, useRef, useState } from "react";
import MyLocation from "./components/MyLocation";
import PlacePin from "./components/PlacePin";
import {
  getActivePlace,
  getDirections,
  getPlaces,
  setActivePlace,
} from "@/lib/store/features/placeSlice";
import {
  getFocusOnMap,
  getTravelPlan,
} from "@/lib/store/features/interactionSlice";
import { SharedValue } from "react-native-reanimated";
import {
  decodePolyline,
  extractActivitiesPoints,
  mergePointsArrayElements,
} from "@/constants/helpers";
import { primaryColor } from "@/constants/variables";
import MapView from "react-native-map-clustering";
import LocationPin from "./components/LocationPin";

interface Props {
  interactionHeight: SharedValue<number>;
  bottomHeight: number;
}

export default function Map({ interactionHeight, bottomHeight }: Props) {
  const dispatch = useAppDispatch();
  const activePlace = useAppSelector(getActivePlace);
  const travelPlan = useAppSelector(getTravelPlan);
  const places = useAppSelector(getPlaces);
  const focusOnMap = useAppSelector(getFocusOnMap);
  const [focusedPlace, setFocusedPlace] = useState<string>();
  const myLocation = useAppSelector(getLocation);
  const mapRef = useRef<MapView>(null);
  const encodedPolyLine = useAppSelector(getDirections);
  const [decodedPolyline, setDecodedPolyline] = useState<LatLng[]>([]);

  useEffect(() => {
    if (encodedPolyLine) {
      const t = decodePolyline(
        encodedPolyLine.routes[0].polyline.encodedPolyline
      );
      if (encodedPolyLine.routes[0].distanceMeters < 1000000)
        setDecodedPolyline(t);
    } else setDecodedPolyline([]);
  }, [encodedPolyLine]);

  useEffect(() => {
    if (focusOnMap) {
      setFocusedPlace(focusOnMap.id);
      const newRegion = {
        latitude: focusOnMap.coords.latitude,
        longitude: focusOnMap.coords.longitude,
        latitudeDelta: focusOnMap.latitudeDelta ?? 0.001,
        longitudeDelta: focusOnMap.longitudeDelta ?? 0.001,
      };
      // @ts-ignore
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      setFocusedPlace(undefined);
    }
  }, [focusOnMap]);

  const centerOnUserLocation = async () => {
    const newRegion = {
      latitude: myLocation?.coords.latitude ?? 0,
      longitude: myLocation?.coords.longitude ?? 0,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    // @ts-ignore
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleMapPress = (event: ClickEvent) => {
    const { coordinate } = event.nativeEvent;
    dispatch(setClickedLocation(coordinate));
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onRegionChangeComplete = (region: Region) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce with requestAnimationFrame
    debounceTimeout.current = setTimeout(() => {
      requestAnimationFrame(() => {
        dispatch(setFocusedRegion(region));
      });
    }, 2000);
  };

  return (
    <ThemedView className="relative h-[100%]">
      {myLocation && (
        <MapView
          clusterColor={primaryColor}
          clusterFontFamily="Jost_400Regular"
          provider={PROVIDER_GOOGLE}
          mapPadding={{
            bottom: travelPlan ? 315 : bottomHeight + 55,
            top: 0,
            right: 0,
            left: 5,
          }}
          onRegionChangeComplete={onRegionChangeComplete}
          onMapLoaded={() =>
            dispatch(
              setFocusedRegion({
                latitude: myLocation.coords.latitude ?? 0,
                longitude: myLocation.coords.longitude ?? 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              })
            )
          }
          ref={mapRef}
          showsIndoors={true}
          showsBuildings={true}
          showsMyLocationButton={false}
          showsUserLocation={true}
          mapType="standard"
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: myLocation.coords.latitude ?? 0,
            longitude: myLocation.coords.longitude ?? 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {travelPlan?.trip &&
            mergePointsArrayElements(
              extractActivitiesPoints(travelPlan.trip)
            ).map((item, index) => (
              <LocationPin
                key={index}
                coords={item.coords}
                text={item?.id + " | " + item.name}
              />
            ))}
          {decodedPolyline.length > 0 && (
            <>
              <LocationPin coords={decodedPolyline[0]} text="You" />
              <LocationPin
                coords={decodedPolyline.at(-1) as LatLng}
                text="Destination"
              />

              <Polyline
                coordinates={decodedPolyline}
                strokeWidth={8}
                strokeColor="rgba(0, 0, 0, 1)"
              />
              <Polyline
                coordinates={decodedPolyline}
                strokeWidth={6}
                strokeColor={primaryColor}
              />
            </>
          )}

          {places.map((item, index) => (
            <Marker
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              onPress={() => dispatch(setActivePlace(item))}
              tracksViewChanges={false}
              key={index}
            >
              <PlacePin
                focused={
                  focusedPlace === item.id || activePlace?.id === item.id
                }
                details={item}
              />
            </Marker>
          ))}
        </MapView>
      )}
      {!travelPlan && (
        <MyLocation bottom={interactionHeight} onPress={centerOnUserLocation} />
      )}
    </ThemedView>
  );
}
