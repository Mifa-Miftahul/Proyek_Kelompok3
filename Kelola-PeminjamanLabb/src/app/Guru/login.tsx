
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import LoginHeader from "@/components/Molecules/LoginHeader";
import LoginForm from "@/components/Organisms/LoginForm";

const COLORS = {
  navy: "#1E3A8A",
  background: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
};

export default function LoginGuru() {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LoginHeader />

        <View style={styles.card}>
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginTop: -20,
    borderRadius: 25,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
});
