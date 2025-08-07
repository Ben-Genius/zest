import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import strings from "@/src/constant/strings";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxBackground from "@/src/components/login/ParallaxBackground";
import { IMAGES } from "@/assets";
import { globalStyles } from "@/src/theme/globalStyles";
import { StatusBar } from "expo-status-bar";
import { baseColors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import { spacing } from "@/src/theme/spacing";
import { AuthContext } from "@/src/navigators";

export default function SignIn() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      login(); // sets isLoggedIn = true
    } else {
      Alert.alert("Error", "Please enter both email and password");
    }
  };
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <ParallaxBackground />
      <StatusBar style="auto" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header Section with Glass Effect */}
            <View style={styles.header}>
              <View style={styles.logoGlass}>
                <Image
                  source={IMAGES.logoNoBg}
                  style={globalStyles.smallImage}
                />
              </View>
            </View>

            {/* Input Section with Glass Effect */}
            <View style={styles.form}>
              <View style={styles.glassCard}>
                <Text
                  style={[
                    typography.body,
                    { color: baseColors.white, marginVertical: spacing.sm },
                  ]}
                >
                  {strings.auth.signInTitle}
                </Text>
                <TextInput
                  placeholder={strings.auth.emailPlaceholder}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder={strings.auth.passwordPlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.showButton}
                  >
                    <Text style={styles.showButtonText}>
                      {passwordVisible ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <LinearGradient
                    colors={["#d4af37", "#f4d03f", "#d4af37"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {strings.auth.signInButton}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkContainer}>
                  <Text style={styles.link}>Forgot Password</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerGlass}>
                <Text style={styles.footerText}>{strings.auth.noAccount}</Text>
                <TouchableOpacity>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseColors.primary,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },

  // UI styles
  header: {
    marginBottom: 30,
  },
  logoGlass: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  },
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#d4af37",
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  showButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  showButtonText: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    marginTop: 8,
 
  },
  buttonGradient: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3c72",
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  link: {
    fontSize: 14,
    color: "#d4af37",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
  footerGlass: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginRight: 8,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d4af37",
  },
});
