import { Platform } from "react-native";

export const USER_DATA = {
  id: 3,
  name: "Taksh ",
  designation: "Software Developer",
  company_name: "Bharat Valley",
  profile_image:
    "https://ui-avatars.com/api/?name=Taksh&background=D4AF37&color=000",
  details: {
    phone: "+919999999999",
    email: "john@work.com",
    website: "www.nexcard.com",
  },
};

export const SHARE_URL = "https://nexcard.com/p/taksh";

export const THEME = {
  colors: {
    primary: "#D4AF37", // Gold
    secondary: "#1A1A1A",
    text_primary: "#FFFFFF",
    text_secondary: "#D4AF37",
    card_background: "#000000",
    accent: "#F7E7CE",
  },
  border: {
    color: "#D4AF37",
    width: 2,
    radius: 16,
  },
  typography: {
    font_family: Platform.OS === "ios" ? "Times New Roman" : "serif",
  },
};
