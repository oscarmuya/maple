# Maple

A travel planning application that helps you organize your trips, discover new places, and create detailed itineraries. Maple is your personal travel assistant, designed to make your journeys seamless and memorable.

As seen on https://ai.google.dev/competition/projects/maple

## Features

-   **Trip Planning:** Create and manage your trips, including dates, destinations, and activities.
-   **Interactive Map:** Visualize your travel plans on an interactive map with custom pins for places of interest.
-   **Place Discovery:** Search for and save interesting places, such as restaurants, hotels, and attractions.
-   **Itinerary Management:** Organize your daily schedules with a detailed itinerary for each trip.
-   **Checklists:** Keep track of your travel preparations with customizable checklists.
-   **Personalization:** Customize your experience with preferences for currency, language, and more.

## Screen Recording

https://github.com/user-attachments/assets/6dacb016-5c5c-4f38-9a04-aa16fd94ec35



## Screenshots
<img width="270" height="585" alt="Screenshot_20251031_093608_Maple" src="https://github.com/user-attachments/assets/62c5a4f7-a093-47fc-a4d3-faf80c38358d" />
<img width="270" height="585" alt="Screenshot_20251031_093618_Maple" src="https://github.com/user-attachments/assets/c98cbbfb-9c9e-4e2a-b582-17a60c585473" />
<img width="270" height="585" alt="Screenshot_20251031_093632_Maple" src="https://github.com/user-attachments/assets/fe1cbc70-3c29-4407-9850-c58b737a8b0d" />
<img width="270" height="585" alt="Screenshot_20251031_093648_Maple" src="https://github.com/user-attachments/assets/69c4e053-dd76-4887-b83b-207fe46ce59d" />
<img width="270" height="585" alt="Screenshot_20251031_093701_Maple" src="https://github.com/user-attachments/assets/110947f9-66bc-4ecf-8b5d-3419a45364ec" />
<img width="270" height="585" alt="Screenshot_20251031_093829_Maple-2" src="https://github.com/user-attachments/assets/1f31aaa1-11ba-4634-95fd-596e5f7f277a" />



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js and npm
-   Expo CLI
-   An iOS or Android simulator, or a physical device

### Environment Variables

This project requires Google Maps API keys for iOS and Android. You will need to create a `.env` file in the root of the project and add the following variables:

```
GOOGLE_MAPS_IOS_KEY=your_ios_key
GOOGLE_MAPS_ANDROID_KEY=your_android_key
```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/oscarmuya/maple.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

-   To run the app on iOS:
    ```sh
    npm run ios
    ```
-   To run the app on Android:
    ```sh
    npm run android
    ```
-   To run the app on the web:
    ```sh
    npm run web
    ```

## Infrastructure

-   **Backend:** Firebase is used for backend services, including:
    -   **Authentication:** User sign-up and login.
    -   **Firestore:** A NoSQL database for storing user data, trips, and places.
    -   **Storage:** For user-uploaded content like photos.
-   **APIs:**
    -   **Google Maps Platform:** For maps, location services, and place information.

## Built With

-   [React Native](https://reactnative.dev/) - The web framework used
-   [Expo](https://expo.dev/) - The framework for making universal native apps
-   [Redux](https://redux.js.org/) - For state management
-   [React Navigation](https://reactnavigation.org/) - For routing and navigation
-   [NativeWind](https://www.nativewind.dev/) - For styling

## Permissions

The application requires the following permissions on Android:

-   `ACCESS_COARSE_LOCATION`
-   `ACCESS_FINE_LOCATION`
-   `ACCESS_BACKGROUND_LOCATION`
-   `FOREGROUND_SERVICE`
-   `FOREGROUND_SERVICE_LOCATION`
-   `READ_CALENDAR`
-   `WRITE_CALENDAR`

## Scripts



-   `start`: Starts the Expo development server.
-   `reset-project`: Resets the project.
-   `android`: Runs the app on a connected Android device or emulator.
-   `ios`: Runs the app on the iOS simulator.
-   `web`: Runs the app in a web browser.
-   `test`: Runs the test suite.
-   `lint`: Lints the code.



## Folder Structure



```

├───app/                # Main folder for the application's routes and screens.
├───assets/             # Static assets like images, fonts, and lottie files.
├───components/         # Reusable components used throughout the application.
├───constants/          # Global constants like colors, dimensions, and utility functions.
├───firebase/           # Firebase configuration and initialization.
├───hooks/              # Custom hooks for reusing logic across components.
├───lib/                # Core application logic, including server-side code and state management.
├───scripts/            # Utility scripts for project management.

```
