import React, { useState, useRef, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShareModal from "../../modals/ShareModal";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Linking,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { USER_DATA, THEME, SHARE_URL } from "../../api/api";
import { useCameraPermissions } from "expo-camera";
import CameraModal from "../../modals/CameraModals";

export default function App() {
  // --- STATE ---
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // --- ANIMATION ---
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  // --- HANDLERS ---
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setIsScanning(true);
  };

  const handleBarCodeScanned = (data) => {
    setIsScanning(false);
    alert(`Scanned data: ${data}`);
  };

  // --- SHARE HANDLERS ---
  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `Check out my digital card: ${SHARE_URL}`,
        url: SHARE_URL,
        title: "Digital Card",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out my digital card: ${SHARE_URL}`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  const handleEmailShare = () => {
    const subject = "My Digital Card";
    const body = `Here is my digital business card: ${SHARE_URL}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Card Container */}
        <View style={styles.cardWrapper}>
          {/* FRONT CARD (QR Side) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFace,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
                zIndex: isFlipped ? 0 : 1,
              },
            ]}
          >
            {/* User Info */}
            <View style={styles.headerInfo}>
              <Text style={styles.nameText}>{USER_DATA.name}</Text>
              <Text style={styles.jobText}>{USER_DATA.designation}</Text>
              <Text style={styles.locationText}>{USER_DATA.company_name}</Text>
            </View>

            {/* QR Code Section */}
            <TouchableOpacity
              style={styles.qrContainer}
              onPress={handleScan}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AlexRivera_Profile",
                }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={styles.tapToScanText}>Tap QR to Scan</Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {/* SHARE Button (Replaced Scan) */}
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => setIsSharing(true)}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color="#000"
                  style={styles.iconSpacing}
                />
                <Text style={styles.buttonText}>SHARE </Text>
              </TouchableOpacity>

              {/* Separator Gap */}
              <View style={{ width: 10 }} />

              {/* Flip Button */}
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleFlip}
              >
                <Text style={styles.buttonText}>FLIP </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* BACK CARD (Digital Profile Side - Gold Luxury) */}

          <Animated.View
            style={[
              styles.cardBack,
              styles.cardFace,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
                zIndex: isFlipped ? 1 : 0,
              },
            ]}
          >
            <View style={styles.goldBorderOverlay} />
            <View style={styles.cardBackContent}>
              <Pressable onPress={handleFlip}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                  <Image
                    source={{ uri: USER_DATA.profile_image }}
                    style={styles.profileImage}
                  />
                  <View>
                    <Text style={styles.goldName}>{USER_DATA.name}</Text>
                    <Text style={styles.goldRole}>{USER_DATA.designation}</Text>
                    <Text style={styles.goldCompany}>
                      {USER_DATA.company_name}
                    </Text>
                  </View>
                </View>

                <View style={styles.separator} />

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="call"
                      size={18}
                      color={THEME.colors.primary}
                    />
                    <Text style={styles.detailText}>
                      {USER_DATA.details.phone}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="mail"
                      size={18}
                      color={THEME.colors.primary}
                    />
                    <Text style={styles.detailText}>
                      {USER_DATA.details.email}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="globe-outline"
                      size={18}
                      color={THEME.colors.primary}
                    />
                    <Text style={styles.detailText}>
                      {USER_DATA.details.website}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <View style={{ flex: 1 }} />
              <Pressable style={styles.centerHelper} onPress={handleFlip}>
                <Text style={styles.helperText}>Tap for QR</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        {/* Helper Text */}
        <Text style={styles.helperText}>
          {isFlipped ? "Showing Digital Card" : "Flip to see the card"}
        </Text>
      </View>

      <ShareModal
        visible={isSharing}
        onClose={() => setIsSharing(false)}
        shareUrl={SHARE_URL}
        userName={USER_DATA.name}
        onNativeShare={handleNativeShare}
        onWhatsAppShare={handleWhatsAppShare}
        onEmailShare={handleEmailShare}
        styles={styles}
      />

      <CameraModal
        visible={isScanning}
        onClose={() => setIsScanning(false)}
        onScanned={handleBarCodeScanned}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
    width: "100%",
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 400,
    height: 580,
  },
  // --- Animation Styles ---
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backfaceVisibility: "hidden",
  },
  // --- Card Styles (Front) ---
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between", // Ensures content is distributed nicely
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  headerInfo: {
    marginBottom: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily:
      Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-condensed",
  },
  jobText: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "400",
  },

  // --- QR Section ---
  qrContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  qrImage: {
    width: "80%",
    height: "80%",
    opacity: 0.9,
  },
  tapToScanText: {
    position: "absolute",
    bottom: 10,
    fontSize: 10,
    color: "#999",
  },

  // --- Buttons ---
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.5,
  },
  iconSpacing: {
    marginRight: 8,
  },

  // --- Helper Text ---
  helperText: {
    marginTop: 15,
    color: "#999",
    fontSize: 14,
    fontWeight: "400",
  },

  // --- NEW STYLES (BACK CARD) ---
  cardBack: {
    width: "100%",
    backgroundColor: THEME.colors.card_background,
    borderRadius: 20,
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  goldBorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    borderRadius: 18,
    margin: 4,
    opacity: 0.3,
  },
  cardBackContent: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginRight: 15,
  },
  goldName: {
    color: THEME.colors.text_primary,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: THEME.typography.font_family,
    marginBottom: 2,
  },
  goldRole: {
    color: THEME.colors.text_secondary,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  goldCompany: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.colors.primary,
    opacity: 0.3,
    marginBottom: 20,
  },
  detailsContainer: {
    gap: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    color: "#fff",
    fontSize: 14,
  },
  encryptedLabel: {
    color: THEME.colors.primary,
    fontSize: 10,
    opacity: 0.7,
    marginTop: 20,
    marginBottom: 4,
  },
  encryptedText: {
    color: "#444",
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginBottom: 20,
  },
  goldButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  goldButtonText: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // --- SHARE MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  shareModalContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
  },
  shareHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  shareBody: {
    padding: 24,
    alignItems: "center",
  },
  shareQRContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  shareQRImage: {
    width: 180,
    height: 180,
  },
  shareName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  shareSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    width: "100%",
    marginBottom: 24,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    marginRight: 10,
  },
  copyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  iconGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
  },
  iconButton: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  centerHelper: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
});
