import { CountryT } from "customer-commons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
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
import { StyleConstants } from "../constants/styles";

const textInputHeight = 25;
const textInputFontSize = 17;

// this is hack to bypass type errors
const textInputFontWeight: "300" = "300";

export function CountriesDropdown(props: { countries: CountryT[] }) {
  const dropDownFadeAnimation = useRef(new Animated.Value(0)).current;

  const cancelDropDownFadeAnimation = useRef<(() => void) | undefined>(
    undefined
  );

  const [isCountriesListVisible, setIsCountriesListVisisble] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Select country");
  const [hoveredCountry, setHoveredCountry] = useState("");

  useEffect(() => {
    return () => {
      cancelDropDownFadeAnimation.current?.();
    };
  }, []);

  const onChangeText = useCallback((text: string) => {
    setQueryText(text);
  }, []);

  const onBlur = useCallback(() => {
    setIsCountriesListVisisble(false);
    setQueryText("");

    const animation = Animated.timing(dropDownFadeAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });

    cancelDropDownFadeAnimation.current = animation.stop;

    animation.start();
  }, []);

  const containerStyle = useMemo(
    () => ({
      zIndex: isCountriesListVisible ? 1 : 0,
      marginLeft: StyleConstants.MARGIN,
      marginRight: StyleConstants.MARGIN,
      marginTop: StyleConstants.MARGIN,
    }),
    [isCountriesListVisible]
  );

  const onPress = useCallback(() => {
    if (isCountriesListVisible) {
      setQueryText("");
    }

    setIsCountriesListVisisble(!isCountriesListVisible);

    const animation = Animated.timing(dropDownFadeAnimation, {
      toValue: isCountriesListVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    });

    cancelDropDownFadeAnimation.current = animation.stop;

    animation.start();
  }, [isCountriesListVisible]);

  const onCountryPress = useCallback((countryName: string) => {
    setSelectedCountry(countryName);
  }, []);

  const onCountryHover = useCallback((countryName: string) => {
    setHoveredCountry(countryName);
  }, []);

  const countryItemStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      borderWidth: 0,
      height: 40,
      justifyContent: "center",
    }),
    []
  );

  const countryNameStyle = useCallback(
    (colorText: string): StyleProp<TextStyle> => ({
      fontSize: 15,
      fontWeight: "500",
      color: colorText,
    }),
    []
  );

  const renderCountryItem = useCallback(
    (countryRow: ListRenderItemInfo<CountryT>) => (
      <Pressable
        onPress={() => onCountryPress(countryRow.item.name)}
        onHoverIn={() => onCountryHover(countryRow.item.name)}
        onHoverOut={() => onCountryHover("")}
        style={countryItemStyle}
      >
        {countryRow.item.name === selectedCountry ? (
          <Text style={countryNameStyle(ColorConstants.BLUE)}>
            {countryRow.item.name} - {countryRow.item.support}
          </Text>
        ) : countryRow.item.name === hoveredCountry ? (
          <Text style={countryNameStyle(ColorConstants.BLACK)}>
            {countryRow.item.name} - {countryRow.item.support}
          </Text>
        ) : (
          <Text style={countryNameStyle(ColorConstants.GRAY)}>
            {countryRow.item.name} - {countryRow.item.support}
          </Text>
        )}
      </Pressable>
    ),
    [selectedCountry, hoveredCountry]
  );

  const countriesContairStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      position: "absolute",
      maxHeight: 228,
      left: 0,
      right: 0,
      top: 60,
      opacity: dropDownFadeAnimation,
      backgroundColor: "white",
    }),
    []
  );

  const blackLineStyle = useMemo(
    () => ({
      backgroundColor: ColorConstants.GRAY,
      height: StyleSheet.hairlineWidth,
    }),
    []
  );

  const textInputStyle = useMemo(
    () => ({
      height: textInputHeight,
      fontSize: textInputFontSize,
      fontWeight: textInputFontWeight,
      outlineStyle: "none",
      color: ColorConstants.BLACK,
    }),
    []
  );

  const selectedCountryView = useCallback(
    () => (
      <TextInput
        onChangeText={onChangeText}
        style={textInputStyle}
        editable={isCountriesListVisible}
        value={isCountriesListVisible ? queryText : selectedCountry}
      />
    ),
    [isCountriesListVisible, queryText]
  );

  const maybeRenderList = useCallback(
    () => (
      <Animated.View style={countriesContairStyle}>
        <FlatList
          data={props.countries.filter((country) =>
            country.name.toLowerCase().includes(queryText.toLocaleLowerCase())
          )}
          renderItem={renderCountryItem}
          keyExtractor={(country) => country.code}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    ),
    [props.countries, queryText, hoveredCountry, selectedCountry]
  );

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: ColorConstants.GRAY,
              marginBottom: 3,
            }}
          >
            COUNTRY OF RESIDENCE
          </Text>

          {selectedCountryView()}
        </View>

        <Image
          source={require("../../assets/images/arrow_down.png")}
          style={{
            height: 7,
            width: 14,
          }}
        />
      </Pressable>

      <View style={blackLineStyle} />

      {maybeRenderList()}
    </View>
  );
}
