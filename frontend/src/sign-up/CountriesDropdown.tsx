import { CountryT } from "customer-commons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, ListRenderItemInfo, StyleProp, ViewStyle, Pressable, Text, View, FlatList, Modal } from "react-native";

const accentColor = "#747980";

export function CountriesDropdown(props: { countries: CountryT[] })
{
    const dropDownFadeAnimation = useRef(new Animated.Value(0)).current;
    const cancelDropDownFadeAnimation = useRef<(() => void) | undefined>(undefined);
    
    const [isCountriesListVisible, setIsCountriesListVisisble] = useState(false);

    useEffect(() => 
        {
            return () =>
            {
                cancelDropDownFadeAnimation.current?.();
            }
        },
        []
    );

    const moveViewInfrontStyle = useMemo(() =>
        ({
            zIndex: isCountriesListVisible ? 1 : 0
        })
        , 
        [isCountriesListVisible]
    );

    const onPress = useCallback(() =>
        {
            setIsCountriesListVisisble(!isCountriesListVisible);

            const animation = Animated.timing(dropDownFadeAnimation, 
                {
                    toValue: isCountriesListVisible ? 0 : 1,
                    duration: 300,
                    useNativeDriver: true,
                }
            );

            cancelDropDownFadeAnimation.current = animation.stop;

            animation.start();
        },
        [isCountriesListVisible]
    );

    const onCountryPress = useCallback(() => {}, []);

    const countryItemStyle = useMemo((): StyleProp<ViewStyle> => 
        ({
            borderWidth: 1,
            borderColor: accentColor,
        }),
        []
    );

    const renderCountryItem = useCallback((countryRow: ListRenderItemInfo<CountryT>) => 
        (
            <Pressable onPress={onCountryPress} style={countryItemStyle}>
                <Text>{countryRow.item.code}</Text>
            </Pressable>
        ),
        []
    );

    const countriesContairStyle = useMemo((): (StyleProp<ViewStyle> | Animated.Animated) =>
        ({
            position: "absolute",
            maxHeight: 250,
            left: 0,
            right: 0,
            top: 20,
            opacity: dropDownFadeAnimation,
            backgroundColor: "white",
        }),
        []
    );

    const maybeRenderList = useCallback(() =>
        (
            <Animated.View style={countriesContairStyle}>
                <FlatList
                    data={props.countries}
                    renderItem={renderCountryItem}
                    keyExtractor={(country) => country.code}
                />
            </Animated.View>
        ),
        [props.countries]
    );

    return (
        <View style={moveViewInfrontStyle}>
            <Pressable onPress={onPress}>
                <Text>Select Country</Text>
            </Pressable>

            {maybeRenderList()}
        </View>
    );
}