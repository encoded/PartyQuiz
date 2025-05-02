import 'dotenv/config';

export default {
  expo: {
    name: "PartyQuiz",
    slug: "PartyQuiz",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      ["expo-camera"]
    ],
    experiments: {
      baseUrl: "/PartyQuiz"
    },
    extra: {
      USE_LOCAL_SERVER: process.env.USE_LOCAL_SERVER || 'false'
    }
  }
};
