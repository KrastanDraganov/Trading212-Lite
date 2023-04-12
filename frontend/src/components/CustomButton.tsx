import { useCallback, useMemo } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

export function CustomButton(props: {
  onPress: () => void;
  labelText: string;
  labelStyle: StyleProp<TextStyle>;
  containerStyle: StyleProp<ViewStyle>;
}) {
  const onPress = useCallback(() => {
    props.onPress();
  }, []);

  const labelStyle = useMemo((): StyleProp<TextStyle> => props.labelStyle, []);

  const containerStyle = useMemo(
    (): StyleProp<ViewStyle> => [
      { alignItems: "center", justifyContent: "center" },
      props.containerStyle,
    ],
    []
  );

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Text style={labelStyle}>{props.labelText}</Text>
    </Pressable>
  );
}
