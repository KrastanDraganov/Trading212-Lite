import {
  containsOnlyLatinCharacters,
  isPasswordSecure,
  isValidEmail,
  ValidationT,
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
import { EpicButton } from "../components/EpicButton";
import { AppConfiguration } from "../config";
import { Colors } from "../constants/colors";
import { Styles } from "../constants/styles";
import { CountriesDropdown } from "./CountriesDropdown";
import { EpicTextInput } from "./EpicTextInput";
import { SignUpFlowConfiguration } from "./SignUpFlowType";

const whiteContainerWidth = 390;

const titleFontSize = 32;
const titleFontWeight = "400" as const;
const titleMarginBottom = 30;

const marginAboveTextInput = 10;

const buttonNextHeight = 60;
const buttonNextLabelFontSize = 19;
const buttonNextLabelWeight = "400" as const;

const buttonPreviousSize = 32;

const arrowIconImageHeight = 22;
const arrowIconImageWidth = 12;

function SignUpFlowStepCustomerDetails(props: { onNextPress: () => void }) {
  const [countries, setCountries] = useState([]);

  const [countryName, setCountryName] = useState("");
  const [givenNames, setGivenNames] = useState("");
  const [lastName, setLastName] = useState("");

  const [areGivenNamesValid, setAreGivenNamesValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);

  const fetchCountries = useCallback(async () => {
    const response = await fetch(
      `${AppConfiguration.customerServiceUrl}/countries`
    );

    const countries = await response.json();

    setCountries(countries);
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  const onPress = useCallback(() => {
    // console.log(areGivenNamesValid, " ", isLastNameValid);

    // if (!areGivenNamesValid || !isLastNameValid) {
    //   return;
    // }

    props.onNextPress();
  }, [areGivenNamesValid, isLastNameValid]);

  const givenNamesValidator = useCallback((text: string): ValidationT => {
    const validation = containsOnlyLatinCharacters(text);

    setAreGivenNamesValid(validation.passed);

    return validation;
  }, []);

  const lastNameValidator = useCallback(
    (text: string): ValidationT => {
      const validation = containsOnlyLatinCharacters(text);

      setIsLastNameValid(validation.passed);

      return validation;
    },
    [isLastNameValid]
  );

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
      color: Colors.black,
      marginBottom: titleMarginBottom,
    }),
    []
  );

  const buttonNextLabelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: buttonNextLabelFontSize,
      fontWeight: buttonNextLabelWeight,
      color: Colors.white,
    }),
    []
  );

  const buttonNextContainerStyle = useMemo(
    () => ({
      height: buttonNextHeight,
      borderRadius: Styles.borderRadius,
      backgroundColor: Colors.blue,
      marginLeft: Styles.margin,
      marginRight: Styles.margin,
      marginBottom: Styles.margin,
    }),
    []
  );

  return (
    <View>
      <View style={titleContainerStyle}>
        <Text style={titleTextStyle}>Sign Up</Text>
      </View>

      <CountriesDropdown
        countries={countries}
        onCountryPress={setCountryName}
      />

      <EpicTextInput
        label="GIVEN NAMES"
        onChangeTextProp={(text) => {
          setGivenNames(text);
        }}
        inputValidator={givenNamesValidator}
        textInputProps={{
          textContentType: "name",
          autoCapitalize: "words",
        }}
        style={{
          marginBottom: marginAboveTextInput,
        }}
      />

      <EpicTextInput
        label="LAST NAME"
        onChangeTextProp={(text) => {
          setLastName(text);
        }}
        inputValidator={lastNameValidator}
        textInputProps={{
          textContentType: "name",
          autoCapitalize: "words",
        }}
        style={{
          marginBottom: Styles.margin,
        }}
      />

      <EpicButton
        onPress={onPress}
        labelText="Next"
        labelStyle={buttonNextLabelStyle}
        containerStyle={buttonNextContainerStyle}
      />
    </View>
  );
}

function SignUpFlowStepLoginDetails(props: { onNextPress: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const onPress = useCallback(() => {
    // if (!isEmailValid || !isPasswordValid) {
    //   return;
    // }

    props.onNextPress();
  }, [isEmailValid, isPasswordValid]);

  const emailValidator = useCallback((text: string): ValidationT => {
    const validation = isValidEmail(text);

    setIsEmailValid(validation.passed);

    return validation;
  }, []);

  const passwordValidator = useCallback((text: string): ValidationT => {
    const validation = isPasswordSecure(text);

    setIsPasswordValid(validation.passed);

    return validation;
  }, []);

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
      color: Colors.black,
      marginBottom: Styles.margin,
    }),
    []
  );

  const buttonNextLabelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: buttonNextLabelFontSize,
      fontWeight: buttonNextLabelWeight,
      color: Colors.white,
    }),
    []
  );

  const buttonNextContainerStyle = useMemo(
    () => ({
      height: buttonNextHeight,
      borderRadius: Styles.borderRadius,
      backgroundColor: Colors.blue,
      marginLeft: Styles.margin,
      marginRight: Styles.margin,
      marginBottom: Styles.margin,
    }),
    []
  );

  return (
    <View>
      <View style={titleContainerStyle}>
        <Text style={titleTextStyle}>Login details</Text>
      </View>

      <EpicTextInput
        label="EMAIL"
        onChangeTextProp={(text) => {
          setEmail(text);
        }}
        inputValidator={emailValidator}
        textInputProps={{
          textContentType: "emailAddress",
        }}
        style={{
          marginBottom: marginAboveTextInput,
        }}
      />

      <EpicTextInput
        label="ENTER PASSWORD"
        onChangeTextProp={(text) => {
          setPassword(text);
        }}
        inputValidator={passwordValidator}
        textInputProps={{
          textContentType: "password",
        }}
        style={{
          marginBottom: Styles.margin,
        }}
      />

      <EpicButton
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
      marginTop: Styles.margin,
      marginLeft: Styles.margin,
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
      backgroundColor: Colors.white,
      width: whiteContainerWidth,
      borderRadius: Styles.borderRadius,
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
