import { useMemo } from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";
import { ColorConstants } from "./constants/colors";
import { SignUpFlow } from "./sign-up/SignUpFlow";

const logoWidth = 167;
const logoHeight = 50;
const logoMarginBottom = 40;

export default function App() {
  const containerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: ColorConstants.PAGE_BACKGROUND,
    }),
    []
  );

  const logoStyle = useMemo(
    () => ({
      width: logoWidth,
      height: logoHeight,
      marginBottom: logoMarginBottom,
    }),
    []
  );

  return (
    <View style={containerStyle}>
      <Image
        style={logoStyle}
        source={require("../assets/images/trading212_logo.png")}
      />
      <SignUpFlow />
    </View>
  );
}
