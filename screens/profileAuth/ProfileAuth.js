import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";

const languages = ["Hindi", "English", "French", "Urdu"];
const genders = ["male", "female", "other"];
const levels = ["Beginner", "Advanced"];
const methodsOfStudy = [
  "Memoizing the Quran",
  "Memoization",
  "Free quran reading lessons",
  "Make the quran lessons interactive",
  "Establish a routine",
  "Create a suitable environment",
  "How to learn quran memorization easily",
  "Relate quranic teachings to daily life",
  "Learning tajweed rules",
];
const quranTypes = ["Harf", "Wrsh"];

const ProfileAuth = () => {
  const token = useSelector((state) => state.auth.token);
  const { userId } = useSelector((state) => state?.auth?.user || {});
  const navigation = useNavigation();

  // Dropdown states
  const [language, setLanguage] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageItems, setLanguageItems] = useState(
    languages.map((l) => ({ label: l, value: l }))
  );

  const [gender, setGender] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderItems, setGenderItems] = useState(
    genders.map((g) => ({ label: g.charAt(0).toUpperCase() + g.slice(1), value: g }))
  );

  const [level, setLevel] = useState("");
  const [levelOpen, setLevelOpen] = useState(false);
  const [levelItems, setLevelItems] = useState(levels.map((l) => ({ label: l, value: l })));

  const [methodOfStudy, setMethodOfStudy] = useState([]);

  console.log(methodOfStudy,"hello")
  const [methodOpen, setMethodOpen] = useState(false);
  const [methodItems, setMethodItems] = useState(
    methodsOfStudy.map((m) => ({ label: m, value: m }))
  );

  const [quranType, setQuranType] = useState("");
  const [quranTypeOpen, setQuranTypeOpen] = useState(false);
  const [quranTypeItems, setQuranTypeItems] = useState(
    quranTypes.map((q) => ({ label: q, value: q }))
  );

  const [dailyTime, setDailyTime] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  // Utility helpers
  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  const normalizeQuranType = (val) => {
    if (!val) return "";
    const lower = val.toLowerCase();
    if (lower === "harf") return "Harf";
    if (lower === "wrsh") return "Wrsh";
    return "";
  };

  // Close all dropdowns helper
  const closeAllDropdowns = () => {
    setLanguageOpen(false);
    setGenderOpen(false);
    setLevelOpen(false);
    setMethodOpen(false);
    setQuranTypeOpen(false);
  };

  // Sync dropdown open states, open only one at a time
  const onOpen = (setter) => {
    closeAllDropdowns();
    setter(true);
  };

  // Fetch profile and initialize fields
  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch("http://31.97.206.49:3001/api/user/get/profile", {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const json = await response.json();
          if (json.data) {
            const data = json.data;
            setLanguage(capitalizeFirstLetter(data.language) || "");
            setGender(data.gender || "");
            setLevel(capitalizeFirstLetter(data.level) || "");
            setQuranType(normalizeQuranType(data.QuranType));
            setDailyTime("");
            setAge(data.Age ? String(data.Age) : "");
            setContact(data.contact || "");
            setMethodOfStudy(
              Array.isArray(data.methodOfStudy)
                ? data.methodOfStudy
                : data.methodOfStudy
                ? [data.methodOfStudy]
                : []
            );
            setMessage("");
          } else {
            setMessage("No profile found; please create your profile.");
          }
        } else {
          setMessage("Failed to fetch profile data.");
        }
      } catch (error) {
        setMessage("Network error while fetching profile.");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Submit handler
  const handleSubmit = async () => {
    if (!language || !gender || !level || methodOfStudy.length === 0) {
      Alert.alert("Validation Error", "Please fill all required fields including Method of Study.");
      return;
    }
    const ageNum = Number(age);
    if (!ageNum || ageNum <= 0) {
      Alert.alert("Validation Error", "Please enter a valid age.");
      return;
    }

    setLoading(true);
    setMessage("");

    const form = {
      userId: userId || "",
      language,
      gender,
      level,
      QuranType: quranType,
      dailyTime,
      Age: ageNum,
      contact,
      methodOfStudy,
    };


    console.log(form,"formform")

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch("http://31.97.206.49:3001/api/user/set/user/profile", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await response.json();
        setMessage("Profile saved successfully!");
        navigation.navigate("TabNavigation");
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Failed to save profile"}`);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007700" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always"
      nestedScrollEnabled={true}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
        <Text style={{ color: "#007700", fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.bismillah}>&#65017;</Text>
      <Text style={styles.title}>Update Your Islamic Profile</Text>

      {message !== "" && (
        <View
          style={[
            styles.messageBox,
            message.startsWith("Error") ? styles.errorMessage : styles.successMessage,
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {/* Language */}
      <Text style={styles.label}>Language *</Text>
      <DropDownPicker
        open={languageOpen}
        value={language}
        items={languageItems}
        setOpen={() => onOpen(setLanguageOpen)}
        setValue={setLanguage}
        setItems={setLanguageItems}
        onClose={() => setLanguageOpen(false)}
        placeholder="Select Language"
        zIndex={5000}
        zIndexInverse={6000}
        multiple={false}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender *</Text>
      <DropDownPicker
        open={genderOpen}
        value={gender}
        items={genderItems}
        setOpen={() => onOpen(setGenderOpen)}
        setValue={setGender}
        setItems={setGenderItems}
        onClose={() => setGenderOpen(false)}
        placeholder="Select Gender"
        zIndex={4000}
        zIndexInverse={7000}
        multiple={false}
      />

      {/* Level */}
      <Text style={styles.label}>Level *</Text>
      <DropDownPicker
        open={levelOpen}
        value={level}
        items={levelItems}
        setOpen={() => onOpen(setLevelOpen)}
        setValue={setLevel}
        setItems={setLevelItems}
        onClose={() => setLevelOpen(false)}
        placeholder="Select Level"
        zIndex={3000}
        zIndexInverse={8000}
        multiple={false}
      />

      {/* Method of Study */}
      <Text style={styles.label}>Method of Study *</Text>
      <DropDownPicker
        open={methodOpen}
        value={methodOfStudy}
        items={methodItems}
        setOpen={() => onOpen(setMethodOpen)}
        setValue={setMethodOfStudy}
        setItems={setMethodItems}
        onClose={() => setMethodOpen(false)}
        placeholder="Select Method(s) of Study"
        multiple={true}
        min={0}
        mode="BADGE"
        zIndex={2000}
        zIndexInverse={9000}
      />

      {/* Quran Type */}
      <Text style={styles.label}>Quran Type</Text>
      <DropDownPicker
        open={quranTypeOpen}
        value={quranType}
        items={quranTypeItems}
        setOpen={() => onOpen(setQuranTypeOpen)}
        setValue={setQuranType}
        setItems={setQuranTypeItems}
        onClose={() => setQuranTypeOpen(false)}
        placeholder="Select Quran Type"
        zIndex={1000}
        zIndexInverse={10000}
        multiple={false}
      />

      {/* Daily Alarm */}
      <Text style={styles.label}>Daily Alarm</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:mm"
        value={dailyTime}
        onChangeText={setDailyTime}
        keyboardType="numeric"
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          setAge(numericText);
        }}
        keyboardType="number-pad"
        maxLength={3}
      />

      {/* Contact number */}
      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your contact number"
        value={contact}
        onChangeText={(text) => setContact(text)}
        keyboardType="number-pad"
        maxLength={15}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        onPress={handleSubmit}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Profile</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fbf9",
    padding: 20,
    paddingBottom: 40,
  },
  bismillah: {
    fontSize: 48,
    color: "#007700",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: Platform.OS === "ios" ? "Times New Roman" : undefined,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
    color: "#555",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    height: 44,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 24,
  },
  buttonDisabled: {
    backgroundColor: "#94d3a2",
  },
  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 18,
  },
  messageBox: {
    padding: 10,
    borderRadius: 24,
    marginBottom: 15,
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
  },
  successMessage: {
    backgroundColor: "#d4edda",
  },
  messageText: {
    color: "#333",
    fontSize: 16,
  },
});

export default ProfileAuth;
