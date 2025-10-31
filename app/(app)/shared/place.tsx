import {
  Dimensions,
  PixelRatio,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getPickedPlace } from "@/lib/store/features/placeSlice";
import { useAppSelector } from "@/lib/store/storeHooks";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { get_place_details, url } from "@/lib/server/server";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import StarRating from "@/components/StarRating";
import { camelCaseToTitleCase, transformDate } from "@/constants/helpers";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import Loader from "@/components/sections/components/Loader";

const { width } = Dimensions.get("window");

const place = () => {
  const pickedPlace = useAppSelector(getPickedPlace);
  const pixelRatio = PixelRatio.get();
  const actualWidth = width * pixelRatio;
  const [picked_place, setpickedPlace] = useState(pickedPlace?.picked_place);

  if (!picked_place) return null;

  useEffect(() => {
    (async () => {
      if (pickedPlace && !pickedPlace?.picked_place.rating) {
        const t = await get_place_details(pickedPlace.picked_place.id);
        setpickedPlace("error" in t ? pickedPlace?.picked_place : t);
      }
    })();
  }, [pickedPlace]);

  return (
    <ParallaxScrollView
      headerImage={
        picked_place.photos ? (
          <ThemedView className="">
            <Carousel
              windowSize={3}
              width={width}
              height={width * 0.7}
              data={picked_place.photos}
              scrollAnimationDuration={200}
              renderItem={({ index, item }) => (
                <ThemedView className="bg-gray-200">
                  <Image
                    className="w-full bg-gray-200 h-full"
                    source={`${url}/photo?width=${actualWidth}&photo_reference=${item.name}`}
                  />
                </ThemedView>
              )}
            />
          </ThemedView>
        ) : (
          <ThemedView />
        )
      }
    >
      {/* overview */}
      <ThemedView className="gap-2 ">
        <ThemedText className="text-3xl" type="title">
          {picked_place.displayName.text}
        </ThemedText>
        {picked_place.userRatingCount && (
          <ThemedText className="text-base" type="defaultSemiBold">
            Rated {picked_place.rating}/5 by{" "}
            {picked_place.userRatingCount.toLocaleString()} people
          </ThemedText>
        )}

        <ThemedText className="text-base" type="defaultSemiBold">
          {picked_place.formattedAddress}
        </ThemedText>
      </ThemedView>

      {/* contacts */}
      <ThemedView className="border-t border-t-gray-100 py-4">
        <TouchableOpacity
          className="w-full"
          onPress={async () => {
            if (Platform.OS !== "web") {
              await openBrowserAsync(picked_place.websiteUri);
            }
          }}
        >
          {picked_place.websiteUri && (
            <ThemedView className="flex justify-between  w-full flex-row items-center">
              <MaterialCommunityIcons size={20} name="web" />
              <ThemedView className="ml-3 flex-1">
                <ThemedText type="defaultSemiBold" className="text-sm">
                  Visit website
                </ThemedText>
                <ThemedText className="text-sm">
                  {picked_place.websiteUri
                    .split("?")[0]
                    .split("//")[1]
                    .replace("/", "")}
                </ThemedText>
              </ThemedView>
              <Entypo name="chevron-right" size={20} />
            </ThemedView>
          )}
        </TouchableOpacity>
      </ThemedView>

      {/* details class 1 */}
      {picked_place.editorialSummary && (
        <ThemedView className="border-t border-t-gray-100 py-4">
          <ThemedText className="mb-2" type="subtitle">
            Description
          </ThemedText>
          <ThemedText className="text-base text-black" type="defaultSemiBold">
            {picked_place.editorialSummary.text}
          </ThemedText>
        </ThemedView>
      )}

      {/* details class 2 */}
      {picked_place.regularOpeningHours && (
        <ThemedView className="border-t border-t-gray-100 py-4">
          <ThemedText
            className={
              picked_place.regularOpeningHours.openNow
                ? "text-green-500"
                : "text-red-500"
            }
            type="defaultSemiBold"
          >
            {picked_place.regularOpeningHours.openNow
              ? "Open Now"
              : "Closed Now"}
          </ThemedText>

          <ThemedView className="mt-3">
            <ThemedText className="underline" type="defaultSemiBold">
              Schedule
            </ThemedText>
            {picked_place.regularOpeningHours.weekdayDescriptions &&
              picked_place.regularOpeningHours.weekdayDescriptions.map(
                (item) => (
                  <ThemedText className="text-sm" key={item}>
                    {item}
                  </ThemedText>
                )
              )}
          </ThemedView>
        </ThemedView>
      )}

      {/* amenities */}

      {Object.entries(picked_place).length > 0 && (
        <>
          <ThemedText className="mb-2" type="subtitle">
            Amenities
          </ThemedText>
          <ThemedView className="flex border-b border-b-gray-200 pb-5 gap-2 flex-row flex-wrap">
            {Object.entries(picked_place).map(([key, value]) => {
              if (typeof value === "boolean")
                return (
                  <ThemedView
                    key={key}
                    className="border flex-row items-center rounded-full border-gray-300 p-1 pl-2"
                  >
                    <ThemedText className="mr-2 text-sm">
                      {camelCaseToTitleCase(key)}
                    </ThemedText>
                    <ThemedView className="bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">
                      {value ? (
                        <MaterialCommunityIcons color="green" name="check" />
                      ) : (
                        <Entypo color="red" name="cross" />
                      )}
                    </ThemedView>
                  </ThemedView>
                );
              else return null;
            })}
          </ThemedView>
        </>
      )}

      {/* payment options */}
      {picked_place.paymentOptions && (
        <>
          <ThemedText className="mb-2" type="subtitle">
            Payment Options
          </ThemedText>
          <ThemedView className="flex border-b border-b-gray-200 pb-5 gap-2 flex-row flex-wrap">
            {Object.entries(picked_place.paymentOptions).map(([key, value]) => {
              if (typeof value === "boolean")
                return (
                  <ThemedView
                    key={key}
                    className="border flex-row items-center rounded-full border-gray-300 p-1 pl-2"
                  >
                    <ThemedText className="mr-2 text-sm">
                      {camelCaseToTitleCase(key)}
                    </ThemedText>
                    <ThemedView className="bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">
                      {value ? (
                        <MaterialCommunityIcons color="green" name="check" />
                      ) : (
                        <Entypo color="red" name="cross" />
                      )}
                    </ThemedView>
                  </ThemedView>
                );
              else return null;
            })}
          </ThemedView>
        </>
      )}

      {/* parking options */}
      {picked_place.parkingOptions && (
        <>
          <ThemedText className="mb-2" type="subtitle">
            Parking Options
          </ThemedText>
          <ThemedView className="flex border-b border-b-gray-200 pb-5 gap-2 flex-row flex-wrap">
            {Object.entries(picked_place.parkingOptions).map(([key, value]) => {
              if (typeof value === "boolean")
                return (
                  <ThemedView
                    key={key}
                    className="border flex-row items-center rounded-full border-gray-300 p-1 pl-2"
                  >
                    <ThemedText className="mr-2 text-sm">
                      {camelCaseToTitleCase(key)}
                    </ThemedText>
                    <ThemedView className="bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">
                      {value ? (
                        <MaterialCommunityIcons color="green" name="check" />
                      ) : (
                        <Entypo color="red" name="cross" />
                      )}
                    </ThemedView>
                  </ThemedView>
                );
              else return null;
            })}
          </ThemedView>
        </>
      )}

      {/* accessibility options */}
      {picked_place.accessibilityOptions && (
        <>
          <ThemedText className="mb-2" type="subtitle">
            Accessibility Options
          </ThemedText>
          <ThemedView className="flex border-b border-b-gray-200 pb-5 gap-2 flex-row flex-wrap">
            {Object.entries(picked_place.accessibilityOptions).map(
              ([key, value]) => {
                if (typeof value === "boolean")
                  return (
                    <ThemedView
                      key={key}
                      className="border flex-row items-center rounded-full border-gray-300 p-1 pl-2"
                    >
                      <ThemedText className="mr-2 text-sm">
                        {camelCaseToTitleCase(key)}
                      </ThemedText>
                      <ThemedView className="bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">
                        {value ? (
                          <MaterialCommunityIcons color="green" name="check" />
                        ) : (
                          <Entypo color="red" name="cross" />
                        )}
                      </ThemedView>
                    </ThemedView>
                  );
                else return null;
              }
            )}
          </ThemedView>
        </>
      )}
      {/* reviews */}
      {picked_place.reviews && (
        <ThemedView>
          <ThemedText type="subtitle" className="mb-4">
            Reviews
          </ThemedText>
          {picked_place.reviews.map((item, index) => (
            <ThemedView className="mb-6" key={index}>
              {/* about author */}
              <ThemedView className="flex flex-row items-center">
                <Image
                  source={item.authorAttribution.photoUri}
                  className="w-10 bg-gray-100 h-10 rounded-full"
                  contentFit="cover"
                />
                <ThemedView className="ml-3">
                  <ThemedText type="subtitle" className="text-sm">
                    {item.authorAttribution.displayName}
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" className="text-sm">
                    {item.relativePublishTimeDescription}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* about review */}
              <ThemedView className="my-3 flex-row items-center">
                <StarRating starSize={13} rating={item.rating} />
                <ThemedText className="ml-2">•</ThemedText>
                <ThemedText type="defaultSemiBold" className="text-sm ml-2">
                  {transformDate(item.publishTime)}
                </ThemedText>
              </ThemedView>

              {/* review */}
              {item.text?.text && (
                <ThemedText className="text-base">{item.text.text}</ThemedText>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {!picked_place.rating && (
        <ThemedView className="h-[200] items-center justify-center">
          <Loader />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
};

export default place;
