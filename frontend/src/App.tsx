import { StyleSheet, View } from "react-native"
import { SignUpFlow } from "./sign-up/SignUpFlow"

export default function App() {
  return (
    <View style={styles.container}>
      <SignUpFlow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
