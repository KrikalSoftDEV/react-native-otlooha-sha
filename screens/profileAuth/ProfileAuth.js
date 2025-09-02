import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


import RNPickerSelect from "react-native-picker-select";
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

  const [form, setForm] = useState({
    userId: userId || "",
    language: "",
    gender: "",
    level: "",
    QuranType: "",
    dailyTime: "",
    Age: 0,
    contact: "", // renamed from ContactNumber
    methodOfStudy: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  // Normalize QuranType
  const normalizeQuranType = (val) => {
    if (!val) return "";
    const lower = val.toLowerCase();
    if (lower === "harf") return "Harf";
    if (lower === "wrsh") return "Wrsh";
    return "";
  };

  // Capitalize helper
  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(
          "http://31.97.206.49:3001/api/user/get/profile",
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const json = await response.json();
          if (json.data) {
            const data = json.data;
            console.log("Fetched profile data:", data);

            setForm((prev) => ({
              ...prev,
              userId: userId || prev.userId,
              language: capitalizeFirstLetter(data.language) || "",
              gender: data.gender || "",
              level: capitalizeFirstLetter(data.level) || "",
              QuranType: normalizeQuranType(data.QuranType),
              dailyTime: "",
              Age: Number(data?.Age) || 0,
              contact: data.contact || "", // renamed here
              methodOfStudy: data.methodOfStudy || "",
            }));
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
  }, [token, userId]);

  const handleChange = (field, value) => {
    // Special handling for Age (convert to number or empty)
    if (field === "Age") {
      const numericValue = value.replace(/[^0-9]/g, ""); // keep only digits
      setForm((prev) => ({ ...prev, Age: numericValue ? Number(numericValue) : 0 }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.language || !form.gender || !form.level || !form.methodOfStudy) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    if (form.Age <= 0) {
      Alert.alert("Validation Error", "Please enter a valid age.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        "http://31.97.206.49:3001/api/user/set/user/profile",
        {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        await response.json();
        setMessage("Profile saved successfully!");
        navigation.navigate('TabNavigation');
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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007700" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
        <Text style={{ color: '#007700', fontSize: 16 }}><Text>Back</Text> </Text>
      </TouchableOpacity>

      <Text style={styles.bismillah}>&#65017;</Text>
      <Text style={styles.title}>Update Your Islamic Profile</Text>

      {message !== "" && (
        <View
          style={[
            styles.messageBox,
            message.startsWith("Error")
              ? styles.errorMessage
              : styles.successMessage,
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}




      {/* Language */}
      <Text style={styles.label}>Language *</Text>
      <PickerSelect
        value={form.language}
        onValueChange={(value) => handleChange("language", value)}
        placeholder={{ label: "Select Language", value: "" }}
        items={languages.map((l) => ({ label: l, value: l }))}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender *</Text>
      <PickerSelect
        value={form.gender}
        onValueChange={(value) => handleChange("gender", value)}
        placeholder={{ label: "Select Gender", value: "" }}
        items={genders.map((g) => ({
          label: g.charAt(0).toUpperCase() + g.slice(1),
          value: g,
        }))}
      />

      {/* Level */}
      <Text style={styles.label}>Level *</Text>
      <PickerSelect
        value={form.level}
        onValueChange={(value) => handleChange("level", value)}
        placeholder={{ label: "Select Level", value: "" }}
        items={levels.map((l) => ({ label: l, value: l }))}
      />

      {/* Method of Study */}
      <Text style={styles.label}>Method of Study *</Text>
      <PickerSelect
        value={form.methodOfStudy}
        onValueChange={(value) => handleChange("methodOfStudy", value)}
        placeholder={{ label: "Select Method", value: "" }}
        items={methodsOfStudy.map((m) => ({ label: m, value: m }))}
      />

      {/* Quran Type */}
      <Text style={styles.label}>Quran Type</Text>
      <PickerSelect
        value={form.QuranType}
        onValueChange={(value) => handleChange("QuranType", value)}
        placeholder={{ label: "Select Quran Type", value: "" }}
        items={quranTypes.map((q) => ({ label: q, value: q }))}
      />

      {/* Daily Time */}
      <Text style={styles.label}>Daily Alarm</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:mm"
        value={form.dailyTime}
        onChangeText={(text) => handleChange("dailyTime", text)}
        keyboardType="numeric"
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={form.Age ? String(form.Age) : ""}
        onChangeText={(text) => handleChange("Age", text)}
        keyboardType="number-pad"
        maxLength={3}
      />

      {/* Contact number */}
      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your contact number"
        value={form.contact} // renamed here
        onChangeText={(text) => handleChange("contact", text)} // renamed here
        keyboardType="number-pad"
        maxLength={15}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        onPress={handleSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const PickerSelect = ({ value, onValueChange, placeholder, items }) => (
  <RNPickerSelect
    onValueChange={onValueChange}
    items={items}
    placeholder={placeholder}
    value={value}
    style={pickerSelectStyles}
    useNativeAndroidPickerStyle={false}
  />
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fbf9",
    padding: 20,
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 24,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 24,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
  },
});

export default ProfileAuth;
