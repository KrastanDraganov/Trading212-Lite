import { useCallback, useMemo, useState } from "react";
import {StyleProp, View, ViewStyle, TextInput, Text, StyleSheet, TextStyle} from "react-native";

const containerHeight = 70;
const textInputHeight = 35;
const labelMargin = -20;
const accentColor = "#747980";

export function CustomTextInput(props: 
    {
      label: string,
      style?: StyleProp<ViewStyle>,
      textInputProps?: Omit<React.ComponentProps<typeof TextInput>, "onChangeText">,
      onChangeText: (text: string) => void,
    })
{
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
            marginBottom: labelMargin,
            color: accentColor,
            fontSize: 12,
        }),
        []
    );

    const blackLineStyle = useMemo(() =>
        ({
            backgroundColor: accentColor,
            height: StyleSheet.hairlineWidth,
        }),
        []
    );
    
    const [isFocused, setIsFocused] = useState(false);
    
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

    return (
        <View style={containerStyle}>
            {isFocused ? null : (
                <Text style={labelStyle}>{props.label}</Text>
            )}

            <TextInput
                {...props.textInputProps}
                style={textInputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={props.onChangeText}
            />

            <View style={blackLineStyle} />
        </View>
    );
}