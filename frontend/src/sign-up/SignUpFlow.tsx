import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, View } from "react-native";
import { AppConfiguration } from "../config";
import { ColorConstants } from "../constants/colors";
import { StyleConstants } from "../constants/styles";
import { CountriesDropdown } from "./CountriesDropdown";
import { CustomTextInput } from "./CustomTextInput";
import { SignUpFlowConfiguration } from "./SignUpFlowType";

const marginAboveTextInput = 10;

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

  return (
    <View>
      <CountriesDropdown countries={countries} />

      <CustomTextInput
        label="GIVEN NAMES"
        onChangeTextProp={(text) => {
          setGivenNames(text);
        }}
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
        textInputProps={{
          textContentType: "name",
          autoCapitalize: "words",
        }}
        style={{
          marginBottom: StyleConstants.MARGIN,
        }}
      />

      <View>
        <Button title="Next" onPress={onPress} />
      </View>
    </View>
  );
}

function SignUpFlowStepLoginDetails(props: { onNextPress: () => void }) {
  const onPress = useCallback(() => {
    props.onNextPress();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <CustomTextInput
        label="EMAIL"
        onChangeTextProp={(text) => {
          setEmail(text);
        }}
        textInputProps={{
          textContentType: "emailAddress",
        }}
        style={{
          marginBottom: marginAboveTextInput,
        }}
      />

      <CustomTextInput
        label="PASSWORD"
        onChangeTextProp={(text) => {
          setPassword(text);
        }}
        textInputProps={{
          textContentType: "password",
          secureTextEntry: true,
        }}
        style={{
          marginBottom: StyleConstants.MARGIN,
        }}
      />

      <Button title="Sign Up" onPress={onPress} />
    </View>
  );
}

export function SignUpFlow() {
  const [currentStep, setCurrentStep] = useState(0);

  const onNextPress = useCallback(() => {
    const newStep: number = currentStep + 1;

    if (newStep >= SignUpFlowConfiguration.maxSteps) {
      // TO DO: After Last Step
      return;
    }

    setCurrentStep(newStep);
  }, [currentStep]);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: ColorConstants.WHITE,
      width: 390,
      height: 450,
      paddingTop: 50,
      paddingBottom: 20,
      borderRadius: StyleConstants.BORDER_RADIUS,
    }),
    []
  );

  return (
    <View style={containerStyle}>
      {currentStep === 0 ? (
        <SignUpFlowStepCustomerDetails onNextPress={onNextPress} />
      ) : null}

      {currentStep === 1 ? (
        <SignUpFlowStepLoginDetails onNextPress={onNextPress} />
      ) : null}

      {currentStep > 1 ? (
        <View>
          <Text>Finish Sign Up</Text>
        </View>
      ) : null}
    </View>
  );
}
