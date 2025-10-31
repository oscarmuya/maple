import { formatDate } from "@/constants/helpers";
import {
  ACTION_PROPS,
  PlaceData,
  RoutesResponse,
  WeatherData,
  coordsDataTypes,
} from "@/types";
import axios from "axios";
import { currencies } from "@/constants/constants";
import { LatLng } from "react-native-maps";

export const url = process.env.SERVER_URL || "http://192.168.0.108:5000";

const localTime = new Date();
const timeString = formatDate();
const timeZoneOffset = localTime.getTimezoneOffset();
const date = { timeString, timeZoneOffset };

export const get_greetings = () => {
  return new Promise<string | { error: string }>((resolve) => {
    axios
      .post(url + "/greetings", { date })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_place_types = (weather?: WeatherData) => {
  return new Promise<
    { place_types: []; description: string } | { error: string }
  >((resolve) => {
    axios
      .post(url + "/get_activities_recommendations", {
        date,
        weather,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else
          resolve({
            place_types: res.data.place_types,
            description: res.data.description,
          });
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const pick_places_qn = () => {
  return new Promise<{ pick_places_qn: string } | { error: string }>(
    (resolve, reject) => {
      axios
        .get(url + "/suggestion_qn")
        .then((res) => {
          if (res.data.error) resolve({ error: res.data.error });
          else resolve({ pick_places_qn: res.data.pick_places_qn });
        })
        .catch((err) => {
          console.log(err.message);
          resolve({ error: "client failed" });
        });
    },
  );
};

export const get_places = (
  coords: { lat: number; lng: number },
  place_types: string[],
  activity: string,
  weather?: WeatherData,
) => {
  return new Promise<
    | {
        places: [];
        picked: { description: string; picked_place: PlaceData };
      }
    | { error: string }
  >((resolve) => {
    axios
      .post(url + "/get_places_from_types", {
        coords,
        place_types,
        date,
        weather,
        activity,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const make_checklist = (
  picked_place: PlaceData,
  weather?: WeatherData,
) => {
  return new Promise<string[] | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/make_checklist", {
        picked_place,
        weather,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.checklist);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_place_advice = (
  picked_place: PlaceData,
  activity: string,
  weather?: WeatherData,
) => {
  return new Promise<string | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/get_place_advice", {
        picked_place,
        weather,
        activity,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_things_to_do = (weather?: WeatherData) => {
  return new Promise<
    { activities: string[]; description: string } | { error: string }
  >((resolve, reject) => {
    axios
      .post(url + "/get_things_to_do", { date, weather })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const place_types_from_activity = (activity: string) => {
  return new Promise<
    { place_types: string[]; description: string } | { error: string }
  >((resolve, reject) => {
    axios
      .post(url + "/place_types_from_activity", { activity })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_reject_place_response = (picked_place: PlaceData) => {
  return new Promise<string | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/get_reject_place_response", { picked_place })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const rephrase_found_best_place = (count: number) => {
  return new Promise<string | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/rephrase_found_best_place", { count })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_possible_actions_from_place = (place: PlaceData) => {
  return new Promise<string[] | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/get_possible_actions_from_place", { place })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const answer_qn_from_place = (place: PlaceData, question: string) => {
  return new Promise<string | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/answer_qn_from_place", { place, question, date })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_weather = (lat: number, lng: number) => {
  return new Promise<WeatherData | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/weather", { coords: { lat, lng } })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_coords_data = (lat: number, lng: number) => {
  return new Promise<coordsDataTypes | { error: string }>((resolve, reject) => {
    axios
      .get(url + `/coords_data?lat=${lat}&lng=${lng}`)
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_currency_multiplier = (
  toCurrency: string,
  fromCountry: string,
  action?: boolean,
) => {
  const fromCurrency = action
    ? fromCountry.toLowerCase()
    : (
        currencies.find((p) => p.country === fromCountry)?.currency_code ||
        "usd"
      ).toLowerCase();
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;
  const url_2 = `https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency}.json`;

  return new Promise<number | { error: string }>((resolve) => {
    const finish = (res: any) => {
      const rate = res.data[fromCurrency][toCurrency.toLowerCase()];
      resolve(rate);
    };
    axios
      .get(url)
      .then((res) => finish(res))
      .catch(() =>
        axios
          .get(url_2)
          .then((res) => finish(res))
          .catch((err) => {
            console.log(err.message);
            resolve({ error: "client failed" });
          }),
      );
  });
};

export const convert_currency = (
  fromCurrency: string,
  toCurrency: string,
  multiplier: number,
  to_convert: number,
) => {
  return new Promise<string | { error: string }>((resolve, reject) => {
    axios
      .post(url + "/convert_currency", {
        fromCurrency,
        toCurrency,
        multiplier,
        to_convert,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.text);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const create_calendar_event = (
  place: PlaceData,
  activity: string,
  weather?: WeatherData,
) => {
  return new Promise<{ title: string; notes: string } | { error: string }>(
    (resolve) => {
      axios
        .post(url + "/create_calendar_event", {
          place,
          weather,
          activity,
        })
        .then((res) => {
          if (res.data.error) resolve({ error: res.data.error });
          else resolve(res.data.event);
        })
        .catch((err) => {
          console.log(err.message);
          resolve({ error: "client failed" });
        });
    },
  );
};

export const get_route = (place: PlaceData, location: LatLng) => {
  return new Promise<RoutesResponse | { error: string }>((resolve) => {
    axios
      .post(url + "/get_route", {
        place,
        location,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_action = (
  prompt: string,
  coords: { lat: number; lng: number },
  location: { lat: number; lng: number },
  weather?: WeatherData,
) => {
  return new Promise<ACTION_PROPS | { error: string }>((resolve) => {
    axios
      .post(url + "/get_action", {
        prompt,
        coords,
        location,
        date,
        weather,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_travel_plan_place = (
  place: string,
  lat: number,
  lng: number,
) => {
  return new Promise<PlaceData[] | { error: string }>((resolve) => {
    axios
      .post(url + "/get_travel_plan_place", {
        place,
        lat,
        lng,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.places);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};

export const get_place_details = (id: string) => {
  return new Promise<PlaceData | { error: string }>((resolve) => {
    axios
      .post(url + "/get_place_details", {
        id,
      })
      .then((res) => {
        if (res.data.error) resolve({ error: res.data.error });
        else resolve(res.data.place);
      })
      .catch((err) => {
        console.log(err.message);
        resolve({ error: "client failed" });
      });
  });
};
