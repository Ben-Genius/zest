import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const ParallaxBackground = () => {
  const mountainAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;
  const lightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle floating animation for mountains
    Animated.loop(
      Animated.sequence([
        Animated.timing(mountainAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(mountainAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cloud movement
    Animated.loop(
      Animated.timing(cloudAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();

    // Light pulsing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(lightAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(lightAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [cloudAnim, lightAnim, mountainAnim]);

  const mountainTranslateY = mountainAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const cloudTranslateX = cloudAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  const lightOpacity = lightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Base gradient */}
      <LinearGradient
        colors={["#1e3c72", "#2a5298", "#4a6fa5", "#d4af37"]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Light rays effect */}
      <Animated.View style={[styles.lightRays, { opacity: lightOpacity }]}>
        <LinearGradient
          colors={["rgba(255,215,0,0.1)", "transparent"]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Back mountain layer */}
      <Animated.View
        style={[
          styles.mountainBack,
          { transform: [{ translateY: mountainTranslateY }] },
        ]}
      >
        <View style={styles.mountain1} />
        <View style={styles.mountain2} />
      </Animated.View>

      {/* Cloud layer */}
      <Animated.View
        style={[
          styles.cloudLayer,
          { transform: [{ translateX: cloudTranslateX }] },
        ]}
      >
        <View style={[styles.cloud, { left: "10%", top: "20%" }]} />
        <View
          style={[styles.cloud, { right: "15%", top: "15%", opacity: 0.6 }]}
        />
        <View
          style={[styles.cloud, { left: "60%", top: "25%", opacity: 0.4 }]}
        />
      </Animated.View>

      {/* Front mountain layer */}
      <View style={styles.mountainFront}>
        <View style={styles.mountain3} />
        <View style={styles.mountain4} />
      </View>

      {/* Atmospheric overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)"]}
        locations={[0, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Background styles
  lightRays: {
    ...StyleSheet.absoluteFillObject,
  },
  mountainBack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  mountainFront: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  mountain1: {
    position: "absolute",
    bottom: 0,
    left: -50,
    width: width * 0.6,
    height: height * 0.4,
    backgroundColor: "rgba(0,0,0,0.2)",
    transform: [{ skewX: "15deg" }],
    borderTopLeftRadius: 100,
    borderTopRightRadius: 80,
  },
  mountain2: {
    position: "absolute",
    bottom: 0,
    right: -30,
    width: width * 0.5,
    height: height * 0.5,
    backgroundColor: "rgba(0,0,0,0.15)",
    transform: [{ skewX: "-20deg" }],
    borderTopLeftRadius: 120,
    borderTopRightRadius: 60,
  },
  mountain3: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width * 0.4,
    height: height * 0.3,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderTopRightRadius: 100,
  },
  mountain4: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: width * 0.3,
    height: height * 0.25,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderTopLeftRadius: 80,
  },
  cloudLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  cloud: {
    position: "absolute",
    width: 60,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
  },

  // UI styles
  header: {
    marginBottom: 30,
  },
});

export default ParallaxBackground;
