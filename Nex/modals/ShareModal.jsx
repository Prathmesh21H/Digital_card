import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ShareModal = ({
  visible,
  onClose,
  shareUrl,
  userName,
  onNativeShare,
  onWhatsAppShare,
  onEmailShare,
  styles,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.shareModalContent}>
          {/* Header */}
          <View style={styles.shareHeader}>
            <Text style={styles.shareTitle}>Share Card</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.shareBody}>
            {/* QR */}
            <View style={styles.shareQRContainer}>
              <Image
                source={{
                  uri:
                    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                    encodeURIComponent(shareUrl),
                }}
                style={styles.shareQRImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.shareName}>{userName}</Text>
            <Text style={styles.shareSubtitle}>
              Scan or share link to view card
            </Text>

            {/* Link */}
            <View style={styles.linkBox}>
              <Text numberOfLines={1} style={styles.linkText}>
                {shareUrl}
              </Text>
              <TouchableOpacity onPress={onNativeShare}>
                <Text style={styles.copyText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.iconGrid}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onWhatsAppShare}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}
                >
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={24}
                    color="#2E7D32"
                  />
                </View>
                <Text style={styles.iconLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={onEmailShare}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={24}
                    color="#1565C0"
                  />
                </View>
                <Text style={styles.iconLabel}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNativeShare}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: "#F3F4F6" }]}
                >
                  <Ionicons name="share-social" size={24} color="#374151" />
                </View>
                <Text style={styles.iconLabel}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShareModal;
