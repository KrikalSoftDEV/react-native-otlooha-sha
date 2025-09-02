import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";



const HelpAndSupport = () => {
  const navigation = useNavigation();

  // Get token from Redux store
  const data = useSelector((state) => state.auth);
  const { token } = data || {};

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(null); // "success" or "error"

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Saudi Arabia mobile number validation: 10 digits starting with '05'
  const validateSaudiMobile = (mobile) => /^05[0-9]{8}$/.test(mobile);

  const handleSubmit = async () => {
    const { name, subject, email, mobile, message } = formData;

    if (!name || !subject || !email || !mobile || !message) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email");
      return;
    }
    if (!validateSaudiMobile(mobile)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid Saudi mobile number starting with 05 and 10 digits long"
      );
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setStatusType(null);

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(
        "http://31.97.206.49:3001/api/student/help/support",
        {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log(response,"res")
        setStatusMessage("Request submitted successfully!");
        setStatusType("success");
        setFormData({ name: "", subject: "", email: "", mobile: "", message: "" });
      } else {
        setStatusMessage("Failed to submit request. Please try again later.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage("Network error. Please try again later.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Help & Support</Text>

      {statusMessage !== "" && (
        <View
          style={[
            styles.messageBox,
            statusType === "error" ? styles.errorMessage : styles.successMessage,
          ]}
        >
          <Text style={styles.messageText}>{statusMessage}</Text>
        </View>
      )}

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Issue subject"
        value={formData.subject}
        onChangeText={(text) => handleChange("subject", text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mobile (Saudi Arabia)</Text>
      <TextInput
        style={styles.input}
        placeholder="05XXXXXXXX"
        value={formData.mobile}
        onChangeText={(text) => handleChange("mobile", text)}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your issue"
        value={formData.message}
        onChangeText={(text) => handleChange("message", text)}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fbf9",
    padding: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: "#007700",
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
    color: "#007700",
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
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
    marginBottom: 18,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94d3a2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  messageBox: {
    padding: 12,
    borderRadius: 24,
    marginBottom: 18,
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
  },
  successMessage: {
    backgroundColor: "#d4edda",
  },
  messageText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HelpAndSupport;
