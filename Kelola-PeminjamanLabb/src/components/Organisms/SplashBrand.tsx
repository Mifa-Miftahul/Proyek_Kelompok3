import { View, StyleSheet } from "react-native";

import LogoSILAKOM from "../Molecules/LogoSILAKOM";
import AppTitle from "../Molecules/AppTitle";
import Tagline from "../Molecules/Tagline";

export default function SplashBrand() {
  return (
    <View style={styles.logoContainer}>
      <LogoSILAKOM />
      <AppTitle />
      <Tagline />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});