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

import DropDownPicker from "react-native-dropdown-picker";
import RNPickerSelect from "react-native-picker-select";
import { useSelector } from "react-redux";

const languages = ["Arabic", "English", "Urdu"];
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

const ProfileAuthTeacher = () => {
    const token = useSelector((state) => state.auth.token);
    const { userId } = useSelector((state) => state?.auth?.user || {});
    const { teacherId } = useSelector((state) => state?.auth?.user || {});

    const navigation = useNavigation();

    const [form, setForm] = useState({
        userId: userId || "",
        language: "",
        gender: "",
        level: [],
        QuranType: [],
        dailyTime: "",
        Age: 0,
        contact: "", // renamed from ContactNumber
        methodOfStudy: [],
        teacherId: teacherId
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [fetching, setFetching] = useState(false);
    const [languagesPicker, setLanguagesPicker] = useState(false)
    const [genderPicker, setGenderPicker] = useState(false)
    const [levelPicker, setLevelPicker] = useState(false)
    const [mehodPicker, setMethodPicker] = useState(false)
    const [typePicker, setTypePicker] = useState(false)
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

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         setFetching(true);
    //         try {
    //             const headers = { "Content-Type": "application/json" };
    //             if (token) headers.Authorization = `Bearer ${token}`;

    //             const response = await fetch(
    //                 "http://31.97.206.49:3001/api/user/get/profile",
    //                 {
    //                     method: "GET",
    //                     headers,
    //                 }
    //             );

    //             if (response.ok) {
    //                 const json = await response.json();
    //                 if (json.data) {
    //                     const data = json.data;
    //                     console.log("Fetched profile data:", data);

    //                     setForm((prev) => ({
    //                         ...prev,
    //                         userId: userId || prev.userId,
    //                         language: capitalizeFirstLetter(data.language) || "",
    //                         gender: data.gender || "",
    //                         level: capitalizeFirstLetter(data.level) || "",
    //                         QuranType: normalizeQuranType(data.QuranType),
    //                         dailyTime: "",
    //                         Age: Number(data?.Age) || 0,
    //                         contact: data.contact || "", // renamed here
    //                         methodOfStudy: data.methodOfStudy || "",
    //                     }));
    //                     setMessage("");
    //                 } else {
    //                     setMessage("No profile found; please create your profile.");
    //                 }
    //             } else {
    //                 setMessage("Failed to fetch profile data.");
    //             }
    //         } catch (error) {
    //             setMessage("Network error while fetching profile.");
    //         } finally {
    //             setFetching(false);
    //         }
    //     };
    //     fetchProfile();
    // }, [token, userId]);

    const handleChange = (field, updaterOrValue, multiple = false) => {
        setForm((prev) => {
            let current = prev[field];

            // Multiple select → always array
            if (multiple) {
                const base = Array.isArray(current) ? current : [];
                const newValue =
                    typeof updaterOrValue === "function"
                        ? updaterOrValue(base)
                        : updaterOrValue;

                return { ...prev, [field]: newValue };
            }

            // Single select → resolve updater function OR direct value
            const resolvedValue =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(current ?? null)
                    : updaterOrValue;

            if (field === "Age") {
                const numericValue = (resolvedValue || "")
                    .toString()
                    .replace(/[^0-9]/g, "");
                return {
                    ...prev,
                    Age: numericValue ? Number(numericValue) : 0,
                };
            }

            return { ...prev, [field]: resolvedValue };
        });
    };

    const handleSubmit = async () => {
        navigation.navigate("TeacherTabNavigator")
        return
        if (!form.language || !form.gender || !form.level || !form.methodOfStudy) {
            Alert.alert("Validation Error", "Please fill all required fields.");
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
                "http://31.97.206.49:3001/api/user/set/teacher/profile",
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(form),
                }
            );

            if (response.ok) {
                await response.json();
                setMessage("Profile saved successfully!");
                // navigation.navigate('TabNavigation');
                navigation.navigate("TeacherTabNavigator")

            } else {
                navigation.navigate("TeacherTabNavigator")
                alert('Failed to save profile')
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
            nestedScrollEnabled={true}
        >
            {/* Back Button */}
            {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
                <Text style={{ color: '#007700', fontSize: 16 }}><Text>Back</Text> </Text>
            </TouchableOpacity> */}

            {/* <Text style={styles.bismillah}>&#65017;</Text> */}
            <Text style={styles.title}>Profile Setup</Text>

            {/* {message !== "" && (
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
            )} */}




            {/* Language */}
            <Text style={styles.label}>Languages</Text>
            <PickerSelect
                value={form.language}
                onValueChange={(value) => handleChange("language", value, false)}
                placeholder={"Select Language"}
                items={languages.map((l) => ({ label: l, value: l }))}
                open={languagesPicker}
                setOpen={setLanguagesPicker}
                multiple={false}
            />

            {/* Gender */}
            <Text style={[styles.label, { marginTop: languagesPicker ? 190 : 30 }]}>Gender *</Text>
            <PickerSelect
                value={form.gender}
                onValueChange={(value) => handleChange("gender", value)}
                placeholder={"Select Gender"}
                items={genders.map((g) => ({
                    label: g.charAt(0).toUpperCase() + g.slice(1),
                    value: g,
                }))}
                open={genderPicker}
                setOpen={setGenderPicker}
            />

            {/* Level */}
            <Text style={[styles.label, { marginTop: genderPicker ? 155 : 30 }]}>Level *</Text>
            <PickerSelect
                value={form.level}
                onValueChange={(value) => handleChange("level", value, true)}
                placeholder={"Select Level"}
                items={levels.map((l) => ({ label: l, value: l }))}
                open={levelPicker}
                setOpen={setLevelPicker}
                multiple={true}
            />

            {/* Method of Study */}
            <Text style={[styles.label, { marginTop: levelPicker ? 112 : 30 }]}>Method of Study *</Text>
            <PickerSelect

                value={form.methodOfStudy}
                onValueChange={(value) => handleChange("methodOfStudy", value, true)}
                placeholder={"Select Method"}
                items={methodsOfStudy.map((m) => ({ label: m, value: m }))}
                open={mehodPicker}
                setOpen={setMethodPicker}
                multiple={true}
            />

            {/* Quran Type */}
            <Text style={[styles.label, { marginTop: mehodPicker ? 230 : 30 }]}>Quran Type</Text>
            <PickerSelect
                value={form.QuranType}
                onValueChange={(value) => handleChange("QuranType", value, true)}
                placeholder={"Select Quran Type"}
                items={quranTypes.map((q) => ({ label: q, value: q }))}
                open={typePicker}
                setOpen={setTypePicker}
                multiple={true}
            />


            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, { marginTop: typePicker ? 130 : 50 }, loading && styles.buttonDisabled]}
                disabled={loading}
                onPress={handleSubmit}

            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const PickerSelect = ({ value, onValueChange, placeholder, items, open, setOpen, multiple = false, }) => {
    return (
        <>
            <DropDownPicker
                multiple={multiple}
                open={open}
                value={multiple ? (Array.isArray(value) ? value : []) : value}
                items={items}
                setOpen={setOpen}
                min={0}
                max={5}
                listMode="SCROLLVIEW"
                setValue={onValueChange}
                dropDownDirection='BOTTOM'
                placeholder={placeholder}
                placeholderStyle={{ color: '#C3CAD6', fontSize: 15 }}
                textStyle={{ color: 'black', fontSize: 15 }}
                style={{
                    borderRadius: 8,
                    paddingLeft: 15,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 30,
                    borderColor: '#DDE2EB',
                }}
                listItemLabelStyle={{ color: '#686E7A', fontSize: 15 }}
                selectedItemLabelStyle={{ color: 'black', fontSize: 15 }}
                dropDownContainerStyle={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#DDE2EB',
                    backgroundColor: 'white',

                }}
                zIndex={5000}
                zIndexInverse={1000}
            />

            {/* <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        placeholder={placeholder}
        value={value}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
    /> */}
        </>
    )
};

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
        marginTop: 25,
        marginBottom: 5,
        fontSize: 16,
        color: '#686E7A'
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
        backgroundColor: "#1C4532",
        paddingVertical: 14,
        alignItems: "center",
        borderRadius: 8,
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

export default ProfileAuthTeacher;
