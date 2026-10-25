
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  navy: "#1E3A8A",
  white: "#FFFFFF",
  lightBlue: "#DBEAFE",
};

export default function LoginHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.brandIcon}>
          <Ionicons
            name="flask-outline"
            size={36}
            color={COLORS.white}
          />
        </View>

        <View style={styles.brandText}>
          <Text style={styles.brandTitle}>SILAKOM</Text>

          <Text style={styles.brandSubtitle}>
            Sistem Informasi Laboratorium Komputer
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.description}>
        Kelola laboratorium dengan lebih mudah,
        {"\n"}efisien dan terorganisir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 54,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#647DB6",
    alignItems: "center",
    justifyContent: "center",
  },

  brandText: {
    flex: 1,
    marginLeft: 12,
  },

  brandTitle: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: "900",
  },

  brandSubtitle: {
    fontSize: 11,
    color: COLORS.lightBlue,
    lineHeight: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#4965A5",
    marginVertical: 20,
  },

  description: {
    fontSize: 13,
    color: COLORS.lightBlue,
    lineHeight: 21,
  },
});
