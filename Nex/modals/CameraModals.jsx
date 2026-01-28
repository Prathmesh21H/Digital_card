import React, { useRef, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

const CameraModal = ({ visible, onClose, onScanned }) => {
  const scannedRef = useRef(false);

  // Reset scan lock when modal opens
  useEffect(() => {
    if (visible) {
      scannedRef.current = false;
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }) => {
    if (scannedRef.current) return;

    scannedRef.current = true;
    onScanned?.(data);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Camera */}
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR code within frame</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CameraModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },

  scanFrame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
  },

  scanText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
