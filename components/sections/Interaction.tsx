import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  get_greetings,
  get_place_advice,
  get_place_types,
  get_places,
  make_checklist,
  get_reject_place_response,
  get_things_to_do,
  place_types_from_activity,
  rephrase_found_best_place,
  get_possible_actions_from_place,
  answer_qn_from_place,
  get_currency_multiplier,
  get_coords_data,
  convert_currency,
  create_calendar_event,
  get_route,
  get_action,
} from "@/lib/server/server";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import {
  addCheckList,
  addTravelPlan,
  getTravelPlan,
  setFocusOnMap,
} from "@/lib/store/features/interactionSlice";
import {
  getFocusedRegion,
  getLocation,
} from "@/lib/store/features/locationSlice";
import {
  addPickedPlace,
  addPlace,
  getActivePlace,
  setActivePlace,
  setDirections,
} from "@/lib/store/features/placeSlice";
import {
  coordsDataTypes,
  CURRENCY_CONVERSION_PROPS,
  NAVIGATION_PROPS,
  PlaceData,
  TRAVEL_PLANNING_PROPS,
} from "@/types";
import Animated, { SharedValue } from "react-native-reanimated";
import TextBox from "./components/TextBox";
import { Dimensions, KeyboardTypeOptions } from "react-native";
import {
  addTrip,
  getCurrency,
  getWeather,
} from "@/lib/store/features/userSlice";
import { currencies } from "@/constants/constants";
import Checklist from "./components/Checklist";
import DatePicker from "./components/DatePicker";
import IdleChoices from "./components/IdleChoices";
import ChoicesList, { ChoicesListLong } from "./components/ChoicesList";
import Loader from "./components/Loader";
import Writer from "./components/Writer";
import Photos from "./components/Photos";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { handleAddEvent } from "@/lib/server/calendar";
import {
  generateChecklist,
  openGoogleMapsWithCustomDirections,
  openGoogleMapsWithDirections,
} from "@/constants/helpers";
import { ThemedText } from "../ThemedText";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import TravelPlan from "./components/TravelPlan";
import { trip_2 } from "@/constants/variables";

const { height } = Dimensions.get("screen");

interface Props {
  interactionHeight: SharedValue<number>;
  setBottomHeight: React.Dispatch<React.SetStateAction<number>>;
}

const Interaction = ({ interactionHeight, setBottomHeight }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activePlace = useAppSelector(getActivePlace);
  const savedTravelPlan = useAppSelector(getTravelPlan);
  const weather = useAppSelector(getWeather);
  const my_location = useAppSelector(getLocation);
  const focusedRegion = useAppSelector(getFocusedRegion);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const userCurrency = useAppSelector(getCurrency);
  const [typedText, setTypedText] = useState("");
  const [isQuiet, setIsQuiet] = useState(true);

  const [foundPlaces, setFoundPlaces] = useState(0);
  const [pickedPlace, setPickedPlace] = useState<{
    description: string;
    picked_place: PlaceData;
  }>();

  const [round, setRound] = useState(1);
  const [step, setStep] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [retryStep, setRetryStep] = useState<number>(0);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [activity, setActivity] = useState("");
  const [endTypeFunction, setEndTypeFunction] = useState<(s?: any) => void>();
  const [isBusy, setIsBusy] = useState(false);

  const [travelPlan, setTravelPlan] = useState<TRAVEL_PLANNING_PROPS["data"]>();

  // date
  const [pickedDate, setPickedDate] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [toPickDate, setToPickDate] = useState(false);

  // text input
  const [typedSubmit, setEndTypedSubmit] = useState<(s?: any) => void>();
  const [canType, setCanType] = useState(false);
  const [textInputType, setTextInputType] =
    useState<KeyboardTypeOptions>("default");
  const [placeHolder, setPlaceHolder] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [showPhotos, setShowPhotos] = useState(false);

  const [choices, setChoices] = useState<string[]>([]);
  const [recPlaceTypes, setRecPlaceTypes] = useState<string[]>([]);
  const [choiceListener, setChoiceListener] =
    useState<(s: string, c?: any, d?: any) => void>();

  const [typingHistory, setTypingHistory] = useState<string[]>([]);
  const [typedAction, setTypedAction] = useState("");

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (savedTravelPlan && !firstLoad) setTravelPlan(savedTravelPlan);
    setFirstLoad(false);
  }, [savedTravelPlan, travelPlan]);

  //
  useEffect(() => {
    dispatch(addPickedPlace(pickedPlace));
  }, [pickedPlace]);

  const endType = useCallback(() => {
    let t: string | number | NodeJS.Timeout | undefined = undefined;
    const text_and_round = typedText + "-" + String(round);
    if (
      typedText &&
      typedText.length !== 0 &&
      !typingHistory.includes(text_and_round)
    ) {
      setTypingHistory((p) => [...p, text_and_round]);
      t = setTimeout(() => {
        if (endTypeFunction) {
          endTypeFunction();
          setEndTypeFunction(undefined);
        }
        setIsQuiet(true);
        if (t) clearTimeout(t);
      }, 1000);
    }
  }, [endTypeFunction, typedText, typingHistory]);

  useEffect(() => {
    if (isQuiet && !isBusy) {
      (async () => {
        // retry state = -1
        if (step === -1) retry_process();
        // idle state = 0
        if (step === 0) idle_state();
        // greetings
        if (step === 1) handleGreetings();
        // get activities
        if (step === 3) handleGetActivities();
        // place
        if (step === 4) handle_get_places();
        if (step === 5) handlePickPlace();
        if (step === 6) handleHighlightPlace();
        // go to place
        if (step === 7) ask_to_go();
        if (step === 8) handle_make_checklist();
        // step 9: show photos
        if (step === 9) handle_show_photos();
        // get things to do
        if (step === 10) handle_get_things_to_do();
        // step 11: clicked a place
        if (step === 11) handle_clicked_place_marker();
        if (step === 12) handle_ask_what_to_do_with_clicked_marker();
        // step 13: fail safe not picked place
        if (step === 13) ask_user_to_pick_place();
        // step 14: currency converter
        if (step === 14) handle_convert_currency();
        if (step === 15) start_currency_conversion();
        // setp 16: schedule in calendar
        if (step === 16) add_to_calendar();
        // step 17: save trip -> google maps
        if (step === 17) finalize_trip();
      })();
    }
  }, [step, isQuiet, isBusy]);

  // marker clicked listener
  useEffect(() => {
    if (activePlace && (step === 0 || step === 13)) {
      setStep(11);
    }
  }, [activePlace]);

  // timeout keeper
  useEffect(() => {
    if (isBusy && choices.length === 0 && checkList.length === 0) {
      const t = setTimeout(() => {
        startTyping(
          "That took too long! And we don't like waiting. Let's try something else."
        );
        const t = () => setStep(0);
        setIsBusy(false);
        setEndTypeFunction(() => t);
        setCanType(false);
      }, 240000);

      return () => clearTimeout(t);
    }
  }, [isBusy, choices, checkList]);

  /**
   * ! Step -1
   * Retry a failed process
   */
  const retry_process = () => {
    setIsBusy(true);
    console.log({
      "Errror in step: ": retryStep,
      "Retry count: ": retryCount,
    });

    if (retryCount === 0) {
      startTyping("I encountered an error while processing your request.");
      setStep(retryStep);
      setRound((p) => p + 1);
      setRetryCount((p) => p + 1);
    } else if (retryCount === 1) {
      startTyping("I encountered an error!");
      setRetryCount((p) => p + 1);
      setStep(retryStep);
      setRound((p) => p + 1);
    } else if (retryCount === 2) {
      startTyping("I've failed to complete your request.");
      setRetryCount((p) => p + 1);
      setStep(retryStep);
      setRound((p) => p + 1);
    } else if (retryCount === 3) {
      const t = () => {
        setRetryCount(0);
        setRound((p) => p + 1);
        setStep(0);
      };
      setEndTypeFunction(() => t);
      startTyping(
        "I'm sorry I couldn't complete your request. Let's try something else."
      );
    }
    setIsBusy(false);
  };

  /**
   * ! Step 0
   * Idle state
   */
  const idle_state = () => {
    reset_data();
    setRound((p) => p + 1);
    startTyping("What would you like me to do for you?");
    setCanType(true);
    setEndTypedSubmit(() => setTypedAction);
    setTextInputType("default");
    setPlaceHolder("Ask me anything...");
    setInputValue("");
    setStep(-2);
  };

  const reset_data = () => {
    dispatch(setDirections(null));
    dispatch(addTravelPlan(null));
    dispatch(setActivePlace(null));
    dispatch(setFocusOnMap(null));
    setCheckList([]);
    setRecPlaceTypes([]);
  };

  useEffect(() => {
    if (typedAction.length > 0) {
      (async () => {
        setInputValue("");
        reset_data();
        setIsBusy(true);

        const res = await get_action(
          typedAction,
          {
            lat: focusedRegion?.latitude ?? 0,
            lng: focusedRegion?.longitude ?? 0,
          },
          {
            lat: my_location?.coords.latitude ?? 0,
            lng: my_location?.coords.longitude ?? 0,
          },
          weather
        );
        console.log("getting action");

        if ("error" in res || !res.data) {
          setRetryStep(step);
          setStep(-1);
        } else {
          if (res.category === "FIND_NEARBY_PLACES") {
            dispatch(addPlace(res.data.places));
            setFoundPlaces(res.data.places.length);
            setPickedPlace(res.data.picked);
            setStep(5);
          } else if (
            res.category === "LOCAL_INFORMATION" ||
            res.category === "OTHER" ||
            res.category === "GENERAL" ||
            res.category === "SAFETY"
          ) {
            startTyping(res.data);
          } else if (res.category === "CURRENCY_CONVERSION") {
            action_convert_currency(res.data);
          } else if (res.category === "TRAVEL_PLANNING") {
            setTravelPlan(res.data);
          } else if (res.category === "NAVIGATION") {
            if (res.data && res.data.route.routes) action_navigation(res.data);
          }
        }
        setIsBusy(false);
      })();
    }
  }, [typedAction]);

  const action_navigation = (data: NAVIGATION_PROPS["data"]) => {
    dispatch(setDirections(data.route));
    startTyping("I'll redirect you to google maps for your trip.");
    setChoices(["Let's go", "Not now"]);
    setChoiceListener(() => (s: string) => {
      setChoices([]);
      if (s === "Let's go") {
        const t = () => {
          openGoogleMapsWithCustomDirections(
            data.origin.data,
            data.destination.data,
            data.waypoints.map((p) => p.data),
            data.travelmode,
            data.avoid
          );
        };
        setEndTypeFunction(() => t);
        startTyping("Enjoy your trip.");
      } else {
        startTyping("Ok then.");
      }
      setIsBusy(false);
    });
  };

  const action_convert_currency = async (
    data: CURRENCY_CONVERSION_PROPS["data"]
  ) => {
    let user_curr = userCurrency ?? "usd";
    let region: coordsDataTypes | { error: string } | {} = {};
    let fromCurrency = data.initialCurrency;

    if (data.initialCurrency.toLowerCase() === user_curr.toLowerCase()) {
      region = await get_coords_data(
        focusedRegion?.latitude ?? 0,
        focusedRegion?.longitude ?? 0
      );
      fromCurrency =
        "long_name" in region
          ? // @ts-ignore
            currencies.find((p) => p.country === region.long_name)
              ?.currency_code || "USD"
          : "USD";
    }

    const multiplier = await get_currency_multiplier(user_curr, fromCurrency);

    if (typeof multiplier !== "object") {
      const response = await convert_currency(
        fromCurrency,
        user_curr,
        parseFloat(multiplier.toFixed(2)),
        data.amount
      );

      if (typeof response !== "object") {
        startTyping(response);
      }
    }
  };

  /**
   * ! Step 1
   * Greet user : Hello good afternon */
  const handleGreetings = async () => {
    setIsBusy(true);
    const _greeting = await get_greetings();
    if (typeof _greeting === "string") {
      const t = () => setStep(0);
      setEndTypeFunction(() => t);
      startTyping(_greeting);
    } else {
      setRetryStep(1);
      setStep(-1);
    }
    setIsBusy(false);
  };

  /**
   * ! Step 3
   * Fetch possible activities and says why they are picked:
   * ..i picked these activities because...
   */
  const handleGetActivities = async () => {
    setIsBusy(true);
    const _place_type = await get_place_types(weather);
    if ("error" in _place_type) {
      setRetryStep(step);
      setStep(-1);
    } else {
      setRecPlaceTypes(_place_type.place_types);
      startTyping(_place_type.description);
      setStep(4);
    }
    setIsBusy(false);
  };

  /**
   * ! Step 4
   * Asks user if it should get the places
   */
  const handle_get_places = async () => {
    setIsBusy(true);
    startTyping("Let me get the best places for you.");
    const places = await get_places(
      {
        lat: focusedRegion?.latitude ?? 0,
        lng: focusedRegion?.longitude ?? 0,
      },
      recPlaceTypes,
      activity,
      weather
    );
    if ("error" in places) {
      setRetryStep(step);
      setStep(-1);
      setIsBusy(false);
    } else {
      if (places.places.length > 0) {
        setRound((p) => p + 1);
        setRecPlaceTypes([]);
        dispatch(addPlace(places.places));
        setPickedPlace(places.picked);
        setFoundPlaces(places.places.length);
        setStep(5);
        setIsBusy(false);
      } else {
        setRecPlaceTypes([]);
        startTyping(
          "I did not find any place for the activity, let's pick something else."
        );
        setStep(10);
        const t = () => {
          setIsBusy(false);
        };
        setEndTypeFunction(() => t);
      }
    }
    setActivity("");
  };

  /**
   * ! Step 5
   * Handle pick a place from the fetched list
   */
  const handlePickPlace = async () => {
    setIsBusy(true);
    if (pickedPlace?.description && pickedPlace.picked_place) {
      const res = await rephrase_found_best_place(foundPlaces);
      if (typeof res === "object") {
        setRetryStep(step);
        setStep(-1);
      } else {
        startTyping(res.replaceAll('"', ""));
        setStep(6);
      }
    } else setStep(13);
    setIsBusy(false);
  };

  /**
   * ! Step 6
   * Focus on the place picked on the map
   */
  const handleHighlightPlace = () => {
    setIsBusy(true);
    if (pickedPlace) {
      get_directions();
      startTyping(pickedPlace.description);
      dispatch(
        setFocusOnMap({
          coords: pickedPlace.picked_place.location,
          id: pickedPlace.picked_place.id,
        })
      );
    }
    setIsBusy(false);
    setStep(7);
  };

  const get_directions = async (place?: {
    description: string;
    picked_place: PlaceData;
  }) => {
    const p = place ? place : pickedPlace;
    if (p) {
      const res = await get_route(p.picked_place, {
        latitude: my_location?.coords.latitude ?? 0,
        longitude: my_location?.coords.longitude ?? 0,
      });
      if ("error" in res) {
      } else if (res?.routes && res?.routes.length > 0)
        dispatch(setDirections(res));
    }
  };

  /**
   * ! Step 7
   * Asks user if they want to go to the picked place
   */
  const ask_to_go = () => {
    setIsBusy(true);
    const t = () => setChoices(["Yes", "No", "Later"]);
    setEndTypeFunction(() => t);
    setChoiceListener(() => ask_to_go_listener);
    startTyping("Would you like to go here?");
  };

  const ask_to_go_listener = (s: string) => {
    (async () => {
      setChoices([]);
      if (s === "Yes") {
        if (pickedPlace) setStep(9);
      } else if (s === "No") {
        if (pickedPlace) {
          const response = await get_reject_place_response(
            pickedPlace?.picked_place
          );
          if (typeof response === "object") {
            setRetryStep(step);
            setStep(-1);
          } else {
            startTyping(response);
            const t = () => setStep(0);
            setEndTypeFunction(() => t);
          }
        }
      } else if (s === "Later") {
        if (pickedPlace) {
          startTyping("Let me save it to your calendar.");
          const t = () => setStep(16);
          setEndTypeFunction(() => t);
        }
      }
      setIsBusy(false);
    })();
  };

  /**
   * ! Step 8
   * Handle make a checklist to the picked place
   */
  const handle_make_checklist = async () => {
    if (pickedPlace) {
      setIsBusy(true);
      const checklist = await make_checklist(pickedPlace.picked_place, weather);
      if (!Array.isArray(checklist)) {
        setRetryStep(step);
        setStep(-1);
        setIsBusy(false);
      } else {
        const t = () => setChoices(["Ok", "No"]);
        setCheckList(checklist ?? []);
        setEndTypeFunction(() => t);
        setChoiceListener(() => save_checklist);
        startTyping(
          "I've prepared things for you to consider. Should i save them?"
        );
      }
    }
  };

  const save_checklist = (s: string, c?: any) => {
    setChoices([]);
    if (s === "Ok") {
      if (pickedPlace) {
        dispatch(addCheckList(generateChecklist(c, pickedPlace.picked_place)));
        startTyping("Ok it's saved.");
      }
    } else if (s === "No") {
      startTyping("Ok i've not saved it.");
      setCheckList([]);
    }
    const t = () => setStep(17);
    setEndTypeFunction(() => t);
    setIsBusy(false);
  };

  /**
   * ! Step 9
   * Show place photos
   */
  const handle_show_photos = () => {
    setIsBusy(true);
    if (pickedPlace?.picked_place.photos) {
      startTyping("Here are some photos of this place.");
      setShowPhotos(true);
    } else {
      startTyping("I don't have photos of this place!");
    }
    setChoices(["View full details", "Next"]);
    setChoiceListener(() => handle_done_viewing_photos);
  };

  const handle_done_viewing_photos = (s: string) => {
    if (s === "Next") {
      setChoices([]);
      setShowPhotos(false);
      setStep(8);
      setIsBusy(false);
    } else {
      router.navigate("/shared/place");
    }
  };

  /**
   * ! Step 10
   * Handle get random things to do based on current situation
   */
  const handle_get_things_to_do = async () => {
    setIsBusy(true);
    const res = await get_things_to_do(weather);
    if ("error" in res) {
      setRetryStep(step);
      setStep(-1);
      setIsBusy(false);
    } else {
      setChoices(res.activities);
      setChoiceListener(() => pick_what_to_do_listener);
      setEndTypedSubmit(() => pick_what_to_do_listener);
      setCanType(true);
      setTextInputType("default");
      setPlaceHolder("Or write what you want to do...");
      setInputValue("");
      startTyping(res.description);
    }
  };
  const pick_what_to_do_listener = (s: string) => {
    (async () => {
      setChoices([]);
      setCanType(false);
      setActivity(s);
      const res = await place_types_from_activity(s);
      if ("error" in res) {
        setRetryStep(step);
        setStep(-1);
      } else {
        startTyping(res.description);
        setRecPlaceTypes(res.place_types);
        setStep(4);
      }
      setIsBusy(false);
    })();
  };

  /**
   * ! Step 11
   * Runs when user clicks on a marker place on the map and gives information about the place
   */
  const handle_clicked_place_marker = async () => {
    setIsBusy(true);
    if (activePlace) {
      const advice = await get_place_advice(activePlace, activity, weather);
      if (typeof advice === "object") {
        setRetryStep(step);
        setStep(-1);
      } else {
        startTyping(advice);
        setStep(12);
      }
    } else setStep(0);
    setIsBusy(false);
  };

  /**
   * ! Step 12
   * Runs to ask user what they would want to dp with the clicked place on the marker
   */
  const handle_ask_what_to_do_with_clicked_marker = async () => {
    if (activePlace) {
      setIsBusy(true);
      const actions = await get_possible_actions_from_place(activePlace);
      if (!Array.isArray(actions)) {
        setRetryStep(step);
        setStep(-1);
        setIsBusy(false);
      } else {
        setChoiceListener(() => listener_clicked_marker);
        setChoices(["Take me there", "Let's do something else", ...actions]);
        startTyping(
          "What would you like to do with " + activePlace.displayName.text + "?"
        );
      }
    } else {
      setIsBusy(false);
      setStep(0);
    }
  };
  const listener_clicked_marker = async (s: string) => {
    setChoices([]);
    setIsBusy(true);
    if (activePlace) {
      if (s === "Take me there") {
        setPickedPlace({
          description: "",
          picked_place: activePlace,
        });
        get_directions({
          description: "",
          picked_place: activePlace,
        });
        setStep(9);
        setIsBusy(false);
      } else if (s === "Let's do something else") {
        setStep(0);
        setIsBusy(false);
      } else {
        const answer = await answer_qn_from_place(activePlace, s);
        if (typeof answer === "object") {
          setRetryStep(step);
          setStep(-1);
          setIsBusy(false);
        } else {
          const t = () => setChoices(["Take me", "Find something else"]);
          setChoiceListener(() => listener_answered_qn);
          setEndTypeFunction(() => t);
          startTyping(answer);
        }
      }
      dispatch(setActivePlace(null));
    } else setStep(0);
  };

  const listener_answered_qn = (s: string) => {
    setChoices([]);
    setIsBusy(true);
    if (activePlace) {
      if (s === "Take me") {
        setPickedPlace({
          description: "",
          picked_place: activePlace,
        });
        get_directions({
          description: "",
          picked_place: activePlace,
        });
        setStep(9);
      } else setStep(0);
    }
    dispatch(setActivePlace(undefined));
    setIsBusy(false);
  };

  /**
   * ! Step 13
   * Fail safe when fails to pick one place
   */
  const ask_user_to_pick_place = () => {
    setIsBusy(true);
    if (foundPlaces === 0)
      startTyping(`I've found ${foundPlaces} places can you be more specific.`);
    else
      startTyping(
        `I've found ${foundPlaces} places, click on the one that interests you the most.`
      );
    setIsBusy(false);
  };

  /**
   * ! Step 14
   * Start handling currency conversion
   */
  const handle_convert_currency = () => {
    setIsBusy(true);
    const t = () => {
      setCanType(true);
      setTextInputType("number-pad");
      setPlaceHolder("Amount to convert");
      setInputValue("100");
      setChoices(["Start conversion", "Change my currency"]);
    };
    const r = () => {
      setChoices([]);
      setStep(15);
      setIsBusy(false);
    };
    setEndTypedSubmit(() => r);
    setChoiceListener(() => currency_converter_listener);
    setEndTypeFunction(() => t);
    startTyping(
      `I'll convert the country's currency you're viewing above to your local currency, ${userCurrency}.`
    );
  };

  const currency_converter_listener = (s: string) => {
    if (s === "Start conversion") {
      setChoices([]);
      setStep(15);
      setIsBusy(false);
    } else {
      router.navigate("/profile/currency");
    }
  };

  /**
   * ! Step 15
   * Handle the conversion computation
   */

  const start_currency_conversion = async () => {
    setIsBusy(true);
    const region = await get_coords_data(
      focusedRegion?.latitude ?? 0,
      focusedRegion?.longitude ?? 0
    );
    if ("error" in region) {
      setRetryStep(step);
      setStep(-1);
    } else if (userCurrency) {
      const to_convert = inputValue.length > 0 ? Number(inputValue) : 1;

      const multiplier = await get_currency_multiplier(
        userCurrency,
        region.long_name
      );
      if (typeof multiplier === "object") {
        setRetryStep(step);
        setStep(-1);
      } else {
        const fromCurrency =
          currencies.find((p) => p.country === region.long_name)
            ?.currency_code || "USD";

        const response = await convert_currency(
          fromCurrency,
          userCurrency,
          parseFloat(multiplier.toFixed(2)),
          to_convert
        );

        if (typeof response === "object") {
          setRetryStep(step);
          setStep(-1);
        } else {
          startTyping(response);
          const t = () => setChoices(["Convert here", "Done"]);
          setEndTypeFunction(() => t);
          setEndTypedSubmit(() => finished_conversion_listener);
          setChoiceListener(() => finished_conversion_listener);
        }
      }
    }
  };

  const finished_conversion_listener = (s: string) => {
    setChoices([]);
    setIsBusy(true);
    if (s === "Convert here") {
      setRound((p) => p + 1);
      setStep(15);
    } else {
      setStep(0);
      setCanType(false);
    }
    setIsBusy(false);
  };

  const picked_choice = (choice: string) => {
    if (choiceListener) {
      if (checkList.length > 0) choiceListener(choice, checkList, pickedDate);
      else choiceListener(choice, undefined, pickedDate);
    }
  };

  /**
   * ! Step 16
   * Save to calendar
   */
  const add_to_calendar = () => {
    setIsBusy(true);
    setToPickDate(true);
    setChoices(["Done"]);
    setPickedDate(new Date(new Date().getTime() + 60 * 60 * 1000));
    setChoiceListener(() => finish_add_calendar);
  };

  const finish_add_calendar = async (_: string, __: any, date: Date) => {
    setChoices([]);
    setToPickDate(false);
    if (pickedPlace) {
      const event = await create_calendar_event(
        pickedPlace.picked_place,
        activity,
        weather
      );
      if ("error" in event) {
        setRetryStep(step);
        setStep(-1);
        setIsBusy(false);
      } else {
        const res = await handleAddEvent(
          event.title,
          event.notes,
          pickedPlace.picked_place.formattedAddress,
          date
        );
        if (res === "failed") {
          setRetryStep(step);
          setStep(-1);
          setIsBusy(false);
        } else {
          dispatch(
            addTrip({
              date: new Date().toString(),
              place: pickedPlace?.picked_place,
              checklist: checkList,
              calendarEvent: { calendarId: "", eventId: res },
              dontAsk: false,
              completed: false,
              activity: activity,
            })
          );
          startTyping("I've added it to your calendar.");
          setStep(0);
          setIsBusy(false);
        }
      }
    } else {
      setStep(0);
      setIsBusy(false);
    }
  };

  /**
   * ! Step 17
   * Open google maps and save trip
   */
  const finalize_trip = () => {
    setIsBusy(true);
    startTyping("I'll redirect you to google maps for your trip.");
    setChoices(["Let's go", "Not now"]);
    setChoiceListener(() => finalize_trip_listener);
  };

  const finalize_trip_listener = (s: string) => {
    setChoices([]);
    dispatch(
      addTrip({
        date: new Date().toString(),
        place: pickedPlace?.picked_place,
        checklist: checkList,
        dontAsk: false,
        completed: false,
        activity: activity,
      })
    );
    if (pickedPlace) {
      if (s === "Let's go") {
        const t = () => {
          setStep(0);
          openGoogleMapsWithDirections(
            {
              latitude: my_location?.coords.latitude ?? 0,
              longitude: my_location?.coords.longitude ?? 0,
            },
            pickedPlace.picked_place.location
          );
        };

        setEndTypeFunction(() => t);
        startTyping("Enjoy your trip.");
      } else {
        setStep(0);
        startTyping(
          "Ok then i've saved the trip you can continue it at any time in your trips."
        );
      }
    } else setStep(0);
    setIsBusy(false);
  };

  const showMode = (currentMode: "date" | "time") => {
    DateTimePickerAndroid.open({
      value: pickedDate,
      onChange: (_, date) => {
        if (date) setPickedDate(date);
      },
      mode: currentMode,
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const startTyping = (s: string) => {
    if (s !== typedText && typeof s === "string") {
      setIsQuiet(false);
      setTypedText(s);
    }
  };

  const [boxHeight, setBoxHeight] = useState(0);

  const onTextBoxLayout = (event: {
    nativeEvent: { layout: { height: any } };
  }) => {
    setBoxHeight(event.nativeEvent.layout.height);
  };

  return (
    <>
      {/* travel plan */}
      {travelPlan ? (
        <TravelPlan setPlan={setTravelPlan} plan={travelPlan} />
      ) : (
        <>
          <Animated.View
            style={{ bottom: 85 }}
            className="absolute flex items-center justify-center w-full p-2"
          >
            <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
              <ThemedView className="bg-black flex items-center justify-center rounded-full w-[44] h-[44]">
                <MaterialCommunityIcons
                  size={21}
                  color="white"
                  name="arrow-expand-up"
                />
              </ThemedView>
            </TouchableOpacity>
          </Animated.View>
          <BottomSheet
            animatedPosition={interactionHeight}
            enablePanDownToClose
            onClose={() => {
              setBottomHeight(-35);
            }}
            ref={bottomSheetRef}
            enableDynamicSizing
            enableOverDrag={false}
            containerStyle={{
              marginBottom: (canType ? boxHeight : 0) + 10,
              marginHorizontal: 10,
              borderRadius: 12,
            }}
            maxDynamicContentSize={height * 0.6}
          >
            <BottomSheetScrollView>
              <ThemedView
                onLayout={(e) => {
                  const t =
                    e.nativeEvent.layout.height + (canType ? boxHeight : 0);
                  setBottomHeight(t);
                }}
                className="bg-white rounded-xl"
              >
                {/* AI text writer */}
                {typedText.length > 0 &&
                  !(isBusy && choices.length === 0 && isQuiet) &&
                  !travelPlan && (
                    <Writer
                      endType={endType}
                      recPlaceTypes={recPlaceTypes}
                      typedText={typedText}
                    />
                  )}
                {/* is busy loader */}
                {isBusy && choices.length === 0 && isQuiet && <Loader />}

                {toPickDate && (
                  <DatePicker showMode={showMode} date={pickedDate} />
                )}

                {/* Photos */}
                {pickedPlace &&
                  showPhotos &&
                  pickedPlace.picked_place.photos && (
                    <Photos images={pickedPlace.picked_place.photos} />
                  )}
                {/* checklist */}
                {checkList.length > 0 && step === 8 && (
                  <Checklist
                    checkList={checkList}
                    setChecklist={setCheckList}
                  />
                )}

                {/* choices */}
                {choices.length > 0 &&
                  (choices.length <= 3 ? (
                    <ChoicesList
                      choices={choices}
                      picked_choice={picked_choice}
                    />
                  ) : (
                    <ChoicesListLong
                      choices={choices}
                      picked_choice={picked_choice}
                    />
                  ))}
                {/* idle state requests */}
                {(step === 0 || step === -2) &&
                  !isBusy &&
                  isQuiet &&
                  !travelPlan &&
                  choices.length === 0 && <IdleChoices setStep={setStep} />}
              </ThemedView>

              {isQuiet &&
                step !== 0 &&
                !(isBusy && choices.length === 0 && isQuiet) && (
                  <ThemedView className="items-center pb-3 justify-center">
                    <TouchableOpacity
                      onPress={() => {
                        setStep(0);
                        setShowPhotos(false);
                        setCanType(false);
                        setIsBusy(false);
                        setChoices([]);
                        setTravelPlan(undefined);
                      }}
                    >
                      <ThemedText className="text-sm underline">
                        Do something else
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}
            </BottomSheetScrollView>
          </BottomSheet>

          {canType && (
            <ThemedView
              onLayout={onTextBoxLayout}
              className="border-t bottom-0 bg-white z-10 items-end border-t-gray-300 px-2 w-full justify-between flex-row absolute py-3"
            >
              <TextBox
                placeHolder={placeHolder}
                setValue={setInputValue}
                value={inputValue}
                type={textInputType}
                submit={typedSubmit}
              />
            </ThemedView>
          )}
        </>
      )}
    </>
  );
};

export default Interaction;
