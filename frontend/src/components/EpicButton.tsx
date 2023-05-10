import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

export function EpicButton(props: {
  onPress: () => void;
  labelText: string;
  labelStyle: StyleProp<TextStyle>;
  containerStyle: StyleProp<ViewStyle>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonBeingPressed, setIsBeingPressed] = useState(false);

  const onPress = useCallback(() => {
    props.onPress();
  }, [props.onPress]);

  const onHoverIn = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onHoverOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onPressIn = useCallback(() => {
    setIsBeingPressed(true);
  }, []);

  const onPressOut = useCallback(() => {
    setIsBeingPressed(false);
  }, []);

  const labelStyle = useMemo(
    (): StyleProp<TextStyle> => props.labelStyle,
    [props.labelStyle]
  );

  const containerStyle = useMemo(
    (): StyleProp<ViewStyle> => [
      {
        alignItems: "center",
        justifyContent: "center",
        opacity: isButtonBeingPressed ? 0.8 : isHovered ? 0.5 : 1,
      },
      props.containerStyle,
    ],
    [isHovered, isButtonBeingPressed, props.containerStyle]
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={containerStyle}
    >
      <Text style={labelStyle}>{props.labelText}</Text>
    </Pressable>
  );
}
