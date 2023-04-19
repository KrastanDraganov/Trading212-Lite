import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ColorConstants } from "../constants/colors";
import { StyleConstants } from "../constants/styles";

const containerHeight = 70;

const textInputHeight = 45;
const textInputFontSize = 17;
const textInputFontWeight: "300" = "300";

const labelFontSize = 12;
const labelFontWeight = "500";
const labelFocusedMargin = -5;
const labelBlurredMargin = -20;
const labelAnimationBottomToTop = 1;
const labelAnimationTopToBottom = 0;

const clearInputButtonImageSize = 33;

const viewPasswordButtonContainerSize = 33;
const viewPasswordButtonImageSize = 24;

export function CustomTextInput(props: {
  label: string;
  style?: StyleProp<ViewStyle>;
  textInputProps?: Omit<React.ComponentProps<typeof TextInput>, "onChangeText">;
  onChangeTextProp: (text: string) => void;
}) {
  const labelAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelLabelAnimation = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    return () => {
      cancelLabelAnimation.current?.();
    };
  }, []);

  const performLabelAnimation = useCallback((endValue: 0 | 1) => {
    const animation = Animated.timing(labelAnimationValue, {
      toValue: endValue,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    cancelLabelAnimation.current = animation.stop;

    animation.start();
  }, []);

  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");

  const isPassword = useRef<boolean>(
    props.textInputProps?.textContentType === "password"
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isButtonBeingPressed, setIsButtonBeingPressed] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocused(true);
    performLabelAnimation(labelAnimationBottomToTop);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocused(false);

    if (text.length === 0) {
      performLabelAnimation(labelAnimationTopToBottom);
    }
  }, [text]);

  const onButtonPressIn = useCallback(() => {
    setIsButtonBeingPressed(true);
  }, []);

  const onButtonPressOut = useCallback(() => {
    setIsButtonBeingPressed(false);
  }, []);

  const onChangeText = useCallback((newText: string) => {
    props.onChangeTextProp(newText);
    setText(newText);
  }, []);

  const clearInputText = useCallback(() => {
    props.onChangeTextProp("");
    setText("");

    setIsFocused(false);
    performLabelAnimation(labelAnimationTopToBottom);
  }, []);

  const changePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const wholeContainerStyle = useMemo(
    () => [
      {
        marginLeft: StyleConstants.MARGIN,
        marginRight: StyleConstants.MARGIN,
      },
      props.style,
    ],
    []
  );

  const textInputAndButtonContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }),
    []
  );

  const textInputAndLabelContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      height: containerHeight,
      justifyContent: "flex-end",
    }),
    []
  );

  const textInputStyle = useMemo(
    () => ({
      height: textInputHeight,
      outlineStyle: "none",
      fontSize: textInputFontSize,
      fontWeight: textInputFontWeight,
      color: ColorConstants.BLACK,
    }),
    []
  );

  const isTextInputVisible = useMemo(
    () => isPassword.current && !isPasswordVisible,
    [isPassword, isPasswordVisible]
  );

  const labelStyle = useMemo(
    (): StyleProp<TextStyle> | Animated.Animated => ({
      marginBottom: labelAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [labelBlurredMargin, labelFocusedMargin],
      }),
      color: ColorConstants.GRAY,
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
    }),
    []
  );

  const clearInputButtonImageStyle = useMemo(
    () => ({
      height: clearInputButtonImageSize,
      width: clearInputButtonImageSize,
      opacity: isButtonBeingPressed ? 0.5 : 1,
    }),
    [isButtonBeingPressed]
  );

  const viewPasswordButtonContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      height: viewPasswordButtonContainerSize,
      width: viewPasswordButtonContainerSize,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const viewPasswordButtonImageStyle = useMemo(
    () => ({
      height: viewPasswordButtonImageSize,
      width: viewPasswordButtonImageSize,
      tintColor: isPasswordVisible ? ColorConstants.BLUE : ColorConstants.ICON,
      opacity: isButtonBeingPressed ? 0.5 : 1,
    }),
    [isPasswordVisible, isButtonBeingPressed]
  );

  const blackLineStyle = useMemo(
    () => ({
      backgroundColor: isFocused ? ColorConstants.BLUE : ColorConstants.GRAY,
      height: StyleSheet.hairlineWidth,
    }),
    [isFocused]
  );

  const clearInputButton = useCallback(() => {
    return (
      <View>
        {text.length > 0 ? (
          <Pressable
            onPress={clearInputText}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
          >
            <Image
              style={clearInputButtonImageStyle}
              source={require("../../assets/images/clear_input_logo.png")}
            />
          </Pressable>
        ) : null}
      </View>
    );
  }, [text, isButtonBeingPressed]);

  const viewPasswordButton = useCallback(() => {
    return (
      <View>
        {text.length > 0 ? (
          <Pressable
            style={viewPasswordButtonContainerStyle}
            onPress={changePasswordVisibility}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
          >
            <Image
              style={viewPasswordButtonImageStyle}
              source={require("../../assets/images/eye_icon.png")}
            />
          </Pressable>
        ) : null}
      </View>
    );
  }, [text, isPasswordVisible, isButtonBeingPressed]);

  return (
    <View style={wholeContainerStyle}>
      <View style={textInputAndButtonContainerStyle}>
        <View style={textInputAndLabelContainerStyle}>
          <Animated.Text style={labelStyle}>{props.label}</Animated.Text>

          <TextInput
            {...props.textInputProps}
            style={textInputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChangeText}
            value={text}
            secureTextEntry={isTextInputVisible}
          />
        </View>

        {isPassword.current ? viewPasswordButton() : clearInputButton()}
      </View>

      <View style={blackLineStyle} />
    </View>
  );
}
