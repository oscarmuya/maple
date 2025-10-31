import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-root-toast";

const validEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState<boolean>();
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    if (!email.match(validEmail)) {
      setEmailValid(false);
      return;
    }
    setEmailValid(true);

    setDisabled(true);
    setSubmitting(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // navigate to feed
      })
      .catch((error) => {
        setSubmitting(false);
        setDisabled(false);
        const err = error.code.replace("auth/", "").replace(/-/g, " ");
        Toast.show(err, {
          duration: Toast.durations.LONG,
          containerStyle: { backgroundColor: "gray" },
          textStyle: { fontSize: 13 },
        });
      });
  };
  useEffect(() => {
    if (password.length > 1 && email.length > 1) setDisabled(false);
  }, [email, password]);

  return (
    <SafeAreaView>
      <ThemedView className="h-full flex items-center justify-center">
        <ThemedView className="mb-6">
          <ThemedText className="text-2xl font-bold">Register</ThemedText>
        </ThemedView>

        <ThemedView className="my-2 w-[85%]">
          <ThemedText className="font-bold text-base">Email</ThemedText>
          <TextInput
            textContentType="emailAddress"
            autoCorrect={false}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={setEmail}
            style={[styles.formInput]}
            // @ts-ignore
            className={`rounded mt-3 pl-3 ${
              emailValid !== undefined
                ? !emailValid
                  ? "bg-red-300"
                  : "bg-green-300"
                : ""
            }`}
          />
        </ThemedView>

        <ThemedView className="my-2 w-[85%] relative">
          <ThemedText className="font-bold text-base">Password</ThemedText>
          <TextInput
            autoCapitalize="none"
            onSubmitEditing={handleSubmit}
            secureTextEntry={passwordHidden}
            autoCorrect={false}
            textContentType="password"
            placeholder="Password"
            onChangeText={setPassword}
            // @ts-ignore
            className="rounded mt-3 pl-3"
            style={[styles.formInput]}
          />

          <ThemedView
            className="bg-transparent"
            style={styles.hidePasswordContainer}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setPasswordHidden((current) => !current)}
            >
              {!passwordHidden ? (
                <Icon className=" text-primary" size={23} name="eye" />
              ) : (
                <Icon className="text-black" size={23} name="eye-with-line" />
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView className="w-[85%]">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled}
            // @ts-ignore
            className="mt-8 items-center justify-center bg-primary rounded"
            style={{ opacity: !disabled ? 0.8 : 1, height: 50 }}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator size={30} color="white" />
            ) : (
              <ThemedText className="font-bold text-lg text-white justify-center items-center">
                Register
              </ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

        <ThemedView className="py-5 w-[85%]">
          <TouchableOpacity onPress={() => router.navigate("login")}>
            <ThemedText className="text-white text-center underline text-base">
              Or Login
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  formInput: {
    height: 55,
    backgroundColor: "white",
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  hidePasswordContainer: {
    position: "absolute",
    right: 0,
    paddingRight: 10,
    top: "55%",
    height: 60,
    color: "black",
    zIndex: 1,
  },
});
