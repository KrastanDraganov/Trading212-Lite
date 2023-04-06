import React, { useCallback, useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SignUpFlowConfiguration } from "./SignUpFlowType";
import { CustomTextInput } from "./CustomTextInput";

function SignUpFlowStepCustomerDetails(props: { onNextPress: () => void })
{
    const onPress = useCallback(() =>
        {
            props.onNextPress();
        },
        []
    );

    const [givenNames, setGivenNames] = useState("");
    const [lastName, setLastName] = useState("");

    return (
        <View>
            <CustomTextInput
                label="GIVEN NAMES"
                onChangeText={(text) =>
                {
                    setGivenNames(text);
                }}
                textInputProps=
                {{
                    textContentType: "name",
                    autoCapitalize: "words",
                }}
                style=
                {{
                    marginBottom: 10,
                }}
            />

            <CustomTextInput 
                label="LAST NAME"
                onChangeText={(text) =>
                {
                    setLastName(text);
                }}
                textInputProps=
                {{
                    textContentType: "name",
                    autoCapitalize: "words",
                }}
                style=
                {{
                    marginBottom: 30,
                }}
            />

            <Button title="Next" onPress={onPress} />
        </View>
    );
}

function SignUpFlowStepLoginDetails(props: { onNextPress: () => void })
{
    const onPress = useCallback(() =>
        {
            props.onNextPress();
        },
        []
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
            <CustomTextInput
                label="EMAIL"
                onChangeText={(text) =>
                {
                    setEmail(text);
                }}
                textInputProps=
                {{
                    textContentType: "emailAddress",
                }}
                style=
                {{
                    marginBottom: 10,
                }}
            />
            
            <CustomTextInput
                label="PASSWORD"
                onChangeText={(text) =>
                {
                    setPassword(text);
                }}
                textInputProps=
                {{
                    textContentType: "password",
                    secureTextEntry: true,
                }}
                style=
                {{
                    marginBottom: 30,
                }}
            />

            <Button title="Sign Up" onPress={onPress} />
        </View>
    );
}

export function SignUpFlow()
{
    const [currentStep, setCurrentStep] = useState(0);

    const onNextPress = useCallback(() =>
        {
            const newStep: number = currentStep + 1;

            if (newStep >= SignUpFlowConfiguration.maxSteps)
            {
                // TO DO: After Last Step
                return;
            }

            setCurrentStep(newStep);
        }, 
        [currentStep]
    );

    return (
        <View> 
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