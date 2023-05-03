import {
  containsOnlyLatinCharacters,
  isPasswordSecure,
  isValidEmail,
} from "customer-commons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { AppConfiguration } from "../config";
import { ColorConstants } from "../constants/colors";
import { StyleConstants } from "../constants/styles";
import { CountriesDropdown } from "./CountriesDropdown";
import { CustomTextInput } from "./CustomTextInput";
import { SignUpFlowConfiguration } from "./SignUpFlowType";

const whiteContainerWidth = 390;

const titleFontSize = 32;
const titleFontWeight: "400" = "400";
const titleMarginBottom = 30;

const marginAboveTextInput = 10;

const buttonNextHeight = 60;
const buttonNextLabelFontSize = 19;
const buttonNextLabelWeight: "400" = "400";

const buttonPreviousSize = 32;

const arrowIconImageHeight = 22;
const arrowIconImageWidth = 12;

function SignUpFlowStepCustomerDetails(props: { onNextPress: () => void }) {
  const [countries, setCountries] = useState([]);

  const fetchCountries = useCallback(async () => {
    const response = await fetch(
      `${AppConfiguration.CUSTOMER_SERVICE_URL}/countries`
    );

    const countries = await response.json();

    setCountries(countries);
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  const onPress = useCallback(() => {
    props.onNextPress();
  }, []);

  const [givenNames, setGivenNames] = useState("");
  const [lastName, setLastName] = useState("");

  const titleContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const titleTextStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: titleFontSize,
      fontWeight: titleFontWeight,
      color: ColorConstants.BLACK,
      marginBottom: titleMarginBottom,
    }),
    []
  );

  const buttonNextLabelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: buttonNextLabelFontSize,
      fontWeight: buttonNextLabelWeight,
      color: ColorConstants.WHITE,
    }),
    []
  );

  const buttonNextContainerStyle = useMemo(
    () => ({
      height: buttonNextHeight,
      borderRadius: StyleConstants.BORDER_RADIUS,
      backgroundColor: ColorConstants.BLUE,
      marginLeft: StyleConstants.MARGIN,
      marginRight: StyleConstants.MARGIN,
      marginBottom: StyleConstants.MARGIN,
    }),
    []
  );

  return (
    <View>
      <View style={titleContainerStyle}>
        <Text style={titleTextStyle}>Sign Up</Text>
      </View>

      <CountriesDropdown countries={countries} />

      <CustomTextInput
        label="GIVEN NAMES"
        onChangeTextProp={(text) => {
          setGivenNames(text);
        }}
        inputValidator={containsOnlyLatinCharacters}
        textInputProps={{
          textContentType: "name",
          autoCapitalize: "words",
        }}
        style={{
          marginBottom: marginAboveTextInput,
        }}
      />

      <CustomTextInput
        label="LAST NAME"
        onChangeTextProp={(text) => {
          setLastName(text);
        }}
        inputValidator={containsOnlyLatinCharacters}
        textInputProps={{
          textContentType: "name",
          autoCapitalize: "words",
        }}
        style={{
          marginBottom: StyleConstants.MARGIN,
        }}
      />

      <CustomButton
        onPress={onPress}
        labelText="Next"
        labelStyle={buttonNextLabelStyle}
        containerStyle={buttonNextContainerStyle}
      />
    </View>
  );
}

function SignUpFlowStepLoginDetails(props: { onNextPress: () => void }) {
  const onPress = useCallback(() => {
    props.onNextPress();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const titleContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const titleTextStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: titleFontSize,
      fontWeight: titleFontWeight,
      color: ColorConstants.BLACK,
      marginBottom: StyleConstants.MARGIN,
    }),
    []
  );

  const buttonNextLabelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: buttonNextLabelFontSize,
      fontWeight: buttonNextLabelWeight,
      color: ColorConstants.WHITE,
    }),
    []
  );

  const buttonNextContainerStyle = useMemo(
    () => ({
      height: buttonNextHeight,
      borderRadius: StyleConstants.BORDER_RADIUS,
      backgroundColor: ColorConstants.BLUE,
      marginLeft: StyleConstants.MARGIN,
      marginRight: StyleConstants.MARGIN,
      marginBottom: StyleConstants.MARGIN,
    }),
    []
  );

  return (
    <View>
      <View style={titleContainerStyle}>
        <Text style={titleTextStyle}>Login details</Text>
      </View>

      <CustomTextInput
        label="EMAIL"
        onChangeTextProp={(text) => {
          setEmail(text);
        }}
        inputValidator={isValidEmail}
        textInputProps={{
          textContentType: "emailAddress",
        }}
        style={{
          marginBottom: marginAboveTextInput,
        }}
      />

      <CustomTextInput
        label="ENTER PASSWORD"
        onChangeTextProp={(text) => {
          setPassword(text);
        }}
        inputValidator={isPasswordSecure}
        textInputProps={{
          textContentType: "password",
        }}
        style={{
          marginBottom: StyleConstants.MARGIN,
        }}
      />

      <CustomButton
        onPress={onPress}
        labelText="Sign up"
        labelStyle={buttonNextLabelStyle}
        containerStyle={buttonNextContainerStyle}
      />
    </View>
  );
}

export function SignUpFlow() {
  const [currentStep, setCurrentStep] = useState(0);

  const buttonPreviousContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      height: buttonPreviousSize,
      width: buttonPreviousSize,
      marginTop: StyleConstants.MARGIN,
      marginLeft: StyleConstants.MARGIN,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    }),
    []
  );

  const arrowIconImageStyle = useMemo(
    () => ({ height: arrowIconImageHeight, width: arrowIconImageWidth }),
    []
  );

  const onPreviousPress = useCallback(() => {
    const nextStep: number = currentStep - 1;

    if (nextStep < SignUpFlowConfiguration.firstStep) {
      // TO DO - Link to Login Page
      return;
    }

    setCurrentStep(nextStep);
  }, [currentStep]);

  const onNextPress = useCallback(() => {
    const nextStep: number = currentStep + 1;

    if (nextStep >= SignUpFlowConfiguration.maxSteps) {
      // TO DO - After Last Step
      return;
    }

    setCurrentStep(nextStep);
  }, [currentStep]);

  const whiteContainerStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      backgroundColor: ColorConstants.WHITE,
      width: whiteContainerWidth,
      borderRadius: StyleConstants.BORDER_RADIUS,
      justifyContent: "center",
    }),
    []
  );

  return (
    <View style={whiteContainerStyle}>
      <Pressable onPress={onPreviousPress} style={buttonPreviousContainerStyle}>
        <Image
          style={arrowIconImageStyle}
          source={require("../../assets/images/arrow_left.png")}
        />
      </Pressable>

      {currentStep === SignUpFlowConfiguration.customerDetailsStep ? (
        <SignUpFlowStepCustomerDetails onNextPress={onNextPress} />
      ) : null}

      {currentStep === SignUpFlowConfiguration.loginDetailsStep ? (
        <SignUpFlowStepLoginDetails onNextPress={onNextPress} />
      ) : null}

      {currentStep >= SignUpFlowConfiguration.maxSteps ? (
        <View>
          <Text>Finish Sign Up</Text>
        </View>
      ) : null}
    </View>
  );
}
