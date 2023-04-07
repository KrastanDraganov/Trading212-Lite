import { useCallback, useMemo, useState } from "react";
import {StyleProp, View, ViewStyle, TextInput, Text, StyleSheet, TextStyle} from "react-native";

const containerHeight = 70;
const textInputHeight = 35;
const labelFontSize = 12;
const labelFocusedMargin = -5;
const labelBlurredMargin = -20;
const accentColor = "#747980";

export function CustomTextInput(props: 
    {
      label: string,
      style?: StyleProp<ViewStyle>,
      textInputProps?: Omit<React.ComponentProps<typeof TextInput>, "onChangeText">,
      onChangeTextProp: (text: string) => void,
    })
{
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState("");
    
    const onFocus = useCallback(() =>
        {
            setIsFocused(true);
        },
        []
    );

    const onBlur = useCallback(() =>
        {
            setIsFocused(false);
        },
        []
    );

    const onChangeText = useCallback((text: string) =>
        {
            props.onChangeTextProp(text);
            setText(text);
        },
        []
    );

    const containerStyle = useMemo((): StyleProp<ViewStyle> => 
        [
            {
                height: containerHeight,
                justifyContent: "flex-end",
            },
            props.style,
        ],
        []
    );

    const textInputStyle = useMemo(() => 
        ({
            height: textInputHeight,
            outlineStyle: "none",
        }),
        []
    );

    const labelStyle = useMemo((): StyleProp<TextStyle> =>
        ({
            marginBottom: (isFocused || text.length > 0) ? labelFocusedMargin : labelBlurredMargin,
            color: accentColor,
            fontSize: labelFontSize,
        }),
        [isFocused, text]
    );

    const blackLineStyle = useMemo(() =>
        ({
            backgroundColor: accentColor,
            height: StyleSheet.hairlineWidth,
        }),
        []
    );

    return (
        <View style={containerStyle}>
            <Text style={labelStyle}>{props.label}</Text>

            <TextInput
                {...props.textInputProps}
                style={textInputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
            />

            <View style={blackLineStyle} />
        </View>
    );
}