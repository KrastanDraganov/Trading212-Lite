import { ValidationT } from "customer-commons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ColorConstants } from "../constants/colors";
import { ErrorTypeToMessages } from "../constants/messages";
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

const passwordPromptFontSize = 15;

const passwordRequirementFontSize = 15;
const passwordRequirementMarginTop = 10;

export function CustomTextInput(props: {
  label: string;
  style?: StyleProp<ViewStyle>;
  textInputProps?: Omit<React.ComponentProps<typeof TextInput>, "onChangeText">;
  onChangeTextProp: (text: string) => void;
  inputValidator: (text: string) => ValidationT;
}) {
  const labelAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelLabelAnimation = useRef<(() => void) | undefined>(undefined);

  const errorContainerAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorContainerAnimation = useRef<(() => void) | undefined>(
    undefined
  );

  const errorCharactersAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorCharactersAnimationValue = useRef<(() => void) | undefined>(
    undefined
  );

  const errorDigitAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorDigitAnimationValue = useRef<(() => void) | undefined>(
    undefined
  );

  const errorUppercaseAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorUppercaseAnimationValue = useRef<(() => void) | undefined>(
    undefined
  );

  const errorLowercaseAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorLowercaseAnimationValue = useRef<(() => void) | undefined>(
    undefined
  );

  const [isError, setIsError] = useState(false);
  const [errorTypes, setErrorTypes] = useState<string[]>([]);

  const [isBlurPerformed, setIsBlurPerformed] = useState(false);

  useEffect(() => {
    setErrorTypes(props.inputValidator(text).errorType!);

    return () => {
      cancelLabelAnimation.current?.();
      cancelErrorContainerAnimation.current?.();
      cancelErrorCharactersAnimationValue.current?.();
      cancelErrorDigitAnimationValue.current?.();
      cancelErrorUppercaseAnimationValue.current?.();
      cancelErrorLowercaseAnimationValue.current?.();
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

  const performErrorAnimation = useCallback(
    (
      errorAnimationValue: Animated.Value,
      cancelErrorAnimation: React.MutableRefObject<(() => void) | undefined>
    ) => {
      const animation = Animated.sequence([
        Animated.timing(errorAnimationValue, {
          toValue: 10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimationValue, {
          toValue: -10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimationValue, {
          toValue: 10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimationValue, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);

      cancelErrorAnimation.current = animation.stop;

      animation.start();
    },
    []
  );

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
    setIsBlurPerformed(true);

    setIsFocused(false);

    if (text.length === 0) {
      performLabelAnimation(labelAnimationTopToBottom);
    }

    const validation = props.inputValidator(text);

    if (validation.passed) {
      return;
    }

    setIsError(true);

    performErrorAnimation(
      errorContainerAnimationValue,
      cancelErrorContainerAnimation
    );

    if (errorTypes.includes("not-enough-characters")) {
      performErrorAnimation(
        errorCharactersAnimationValue,
        cancelErrorCharactersAnimationValue
      );
    }

    if (errorTypes.includes("missing-digit")) {
      performErrorAnimation(
        errorDigitAnimationValue,
        cancelErrorDigitAnimationValue
      );
    }

    if (errorTypes.includes("missing-uppercase-letter")) {
      performErrorAnimation(
        errorUppercaseAnimationValue,
        cancelErrorUppercaseAnimationValue
      );
    }

    if (errorTypes.includes("missing-lowercase-letter")) {
      performErrorAnimation(
        errorLowercaseAnimationValue,
        cancelErrorLowercaseAnimationValue
      );
    }
  }, [text, props.inputValidator, isError, errorTypes]);

  const onButtonPressIn = useCallback(() => {
    setIsButtonBeingPressed(true);
  }, []);

  const onButtonPressOut = useCallback(() => {
    setIsButtonBeingPressed(false);
  }, []);

  const onChangeText = useCallback(
    (newText: string) => {
      props.onChangeTextProp(newText);
      setText(newText);

      setIsError(false);

      const validation = props.inputValidator(newText);

      if (!validation.passed) {
        setErrorTypes(validation.errorType!);
      } else {
        setErrorTypes([]);
      }
    },
    [props.onChangeTextProp, props.inputValidator, isError, errorTypes]
  );

  const clearInputText = useCallback(() => {
    props.onChangeTextProp("");
    setText("");

    setIsFocused(false);
    performLabelAnimation(labelAnimationTopToBottom);

    setIsError(false);
  }, [props.onChangeTextProp]);

  const changePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const wholeContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => [
      {
        marginLeft: StyleConstants.MARGIN,
        marginRight: StyleConstants.MARGIN,
      },
      props.style,
    ],
    []
  );

  const animatedContainerStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      transform: [{ translateX: errorContainerAnimationValue }],
    }),
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
      color: isError ? ColorConstants.RED : ColorConstants.GRAY,
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
    }),
    [isError]
  );

  const clearInputButtonImageStyle = useMemo(
    () => ({
      height: clearInputButtonImageSize,
      width: clearInputButtonImageSize,
      tintColor: ColorConstants.ICON,
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

  const indicatorLineStyle = useMemo(
    () => ({
      backgroundColor: isFocused
        ? ColorConstants.BLUE
        : isError
        ? ColorConstants.RED
        : ColorConstants.GRAY,
      height: StyleSheet.hairlineWidth,
    }),
    [isFocused, isError]
  );

  const passwordPromptTextStyle = useMemo(
    (): StyleProp<TextStyle> | Animated.Animated => ({
      fontSize: passwordPromptFontSize,
      color: ColorConstants.BLACK,
      marginTop: StyleConstants.MARGIN,
    }),
    []
  );

  const passwordRequirementTextStyle = useCallback(
    (
      color: string,
      errorAnimationValue: Animated.Value
    ): StyleProp<TextStyle> | Animated.Animated => ({
      fontSize: passwordRequirementFontSize,
      color: color,
      marginTop: passwordRequirementMarginTop,
      transform: [{ translateX: errorAnimationValue }],
    }),
    []
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

  const passwordPrompt = useCallback(() => {
    const colorCharacters = !errorTypes.includes("not-enough-characters")
      ? ColorConstants.GREEN
      : isBlurPerformed
      ? ColorConstants.RED
      : ColorConstants.GRAY;

    const colorDigit = !errorTypes.includes("missing-digit")
      ? ColorConstants.GREEN
      : isBlurPerformed
      ? ColorConstants.RED
      : ColorConstants.GRAY;

    const colorUppercase = !errorTypes.includes("missing-uppercase-letter")
      ? ColorConstants.GREEN
      : isBlurPerformed
      ? ColorConstants.RED
      : ColorConstants.GRAY;

    const colorLowercase = !errorTypes.includes("missing-lowercase-letter")
      ? ColorConstants.GREEN
      : isBlurPerformed
      ? ColorConstants.RED
      : ColorConstants.GRAY;

    return (
      <View>
        <Text style={passwordPromptTextStyle}>
          Your password must contain at least:
        </Text>
        <Animated.Text
          style={passwordRequirementTextStyle(
            colorCharacters,
            errorCharactersAnimationValue
          )}
        >
          {"  "}○ 8 characters
        </Animated.Text>
        <Animated.Text
          style={passwordRequirementTextStyle(
            colorDigit,
            errorDigitAnimationValue
          )}
        >
          {"  "}○ 1 number
        </Animated.Text>
        <Animated.Text
          style={passwordRequirementTextStyle(
            colorUppercase,
            errorUppercaseAnimationValue
          )}
        >
          {"  "}○ 1 uppercase letter
        </Animated.Text>
        <Animated.Text
          style={passwordRequirementTextStyle(
            colorLowercase,
            errorLowercaseAnimationValue
          )}
        >
          {"  "}○ 1 lowercase letter
        </Animated.Text>
      </View>
    );
  }, [errorTypes, isBlurPerformed]);

  return (
    <View style={wholeContainerStyle}>
      <Animated.View style={animatedContainerStyle}>
        <View style={textInputAndButtonContainerStyle}>
          <View style={textInputAndLabelContainerStyle}>
            <Animated.Text style={labelStyle}>
              {isError ? ErrorTypeToMessages.get(errorTypes[0]) : props.label}
            </Animated.Text>

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

        <View style={indicatorLineStyle} />
      </Animated.View>

      {isPassword.current ? passwordPrompt() : null}
    </View>
  );
}
