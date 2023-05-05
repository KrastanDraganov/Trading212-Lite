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

const countryChoserContainerMarginBottom = 10;

const labelFontSize = 12;
const labelFontWeight: "500" = "500";
const labelMarginBottom = 3;

const countriesListMaxHeight = 248;
const countriesListLeftPosition = -20;
const countriesListRightPosition = -20;
const countriesListTopPosition = 53;

const countryItemHeight = 40;
const pressableCountryItemOpacity = 1;
const notPressableCountryItemOpacity = 0.4;

const countryNameFontSize = 15;
const countryNameFontWeight: "500" = "500";
const highlightedCountryNameLeftMargin = 15;
const countrySupportNoMargin = 0;

const highlightedCountryItemPosition = 5;

const textInputHeight = 25;
const textInputFontSize = 17;
const textInputFontWeight: "300" = "300";

const arrowIconHeight = 7;
const arrowIconWidth = 14;
const arrowIconButtonOffset = 20;

export function CountriesDropdown(props: {
  countries: CountryT[];
  onCountryPress: (text: string) => void;
}) {
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

  const wholeContainerStyle = useMemo(
    () => ({
      zIndex: isCountriesListVisible ? 1 : 0,
      marginLeft: StyleConstants.MARGIN,
      marginRight: StyleConstants.MARGIN,
      marginTop: StyleConstants.MARGIN,
    }),
    [isCountriesListVisible]
  );

  const countryChoserContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: countryChoserContainerMarginBottom,
    }),
    []
  );

  const labelAndTextInputContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    }),
    []
  );

  const labelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
      color: ColorConstants.GRAY,
      marginBottom: labelMarginBottom,
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

  const arrowIconButtonStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      height: arrowIconHeight + arrowIconButtonOffset,
      width: arrowIconWidth + arrowIconButtonOffset,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    }),
    []
  );

  const arrowIconImageStyle = useMemo(
    () => ({
      height: arrowIconHeight,
      width: arrowIconWidth,
    }),
    []
  );

  const blackLineStyle = useMemo(
    () => ({
      backgroundColor: isCountriesListVisible
        ? ColorConstants.BLUE
        : ColorConstants.GRAY,
      height: StyleSheet.hairlineWidth,
    }),
    [isCountriesListVisible]
  );

  const countryItemStyle = useCallback(
    (opacity: number): StyleProp<ViewStyle> => ({
      height: countryItemHeight,
      justifyContent: "center",
      opacity: opacity,
    }),
    []
  );

  const countryNameStyle = useCallback(
    (colorText: string, marginLeft: number): StyleProp<TextStyle> => ({
      fontSize: countryNameFontSize,
      fontWeight: countryNameFontWeight,
      color: colorText,
      marginLeft: marginLeft,
    }),
    []
  );

  const highlightedCountryItemStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      position: "absolute",
      left: highlightedCountryItemPosition,
      right: highlightedCountryItemPosition,
      top: highlightedCountryItemPosition,
      bottom: highlightedCountryItemPosition,
      backgroundColor: ColorConstants.HIGHLIGHTED_ITEM,
      borderRadius: StyleConstants.BORDER_RADIUS,
      justifyContent: "center",
    }),
    []
  );

  const countriesContainerStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      position: "absolute",
      maxHeight: countriesListMaxHeight,
      left: countriesListLeftPosition,
      right: countriesListRightPosition,
      top: countriesListTopPosition,
      opacity: dropDownFadeAnimation,
      borderRadius: StyleConstants.BORDER_RADIUS,
      backgroundColor: "white",
    }),
    []
  );

  const changeCountriesListVisibility = useCallback((isVisible: boolean) => {
    if (!isVisible) {
      setQueryText("");
    }

    setIsCountriesListVisisble(isVisible);

    const animation = Animated.timing(dropDownFadeAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });

    cancelDropDownFadeAnimation.current = animation.stop;

    animation.start();
  }, []);

  const onChangeText = useCallback((text: string) => {
    setQueryText(text);
  }, []);

  const onDropdownPress = useCallback(() => {
    changeCountriesListVisibility(!isCountriesListVisible);
  }, [isCountriesListVisible]);

  const onTextInputFocus = useCallback(() => {
    if (!isCountriesListVisible) {
      changeCountriesListVisibility(true);
    }
  }, [isCountriesListVisible]);

  const onCountryPress = useCallback(
    (countryName: string) => {
      setSelectedCountry(countryName);
      props.onCountryPress(countryName);

      changeCountriesListVisibility(false);
    },
    [props.onCountryPress]
  );

  const onCountryHover = useCallback((countryName: string) => {
    setHoveredCountry(countryName);
  }, []);

  const renderNotPressableCountryItem = useCallback(
    (countryName: string, countrySupport: string) => {
      const userMessageSupport =
        countrySupport === "coming-soon" ? (
          <Text
            style={countryNameStyle(
              ColorConstants.GREEN,
              countrySupportNoMargin
            )}
          >
            (Coming Soon)
          </Text>
        ) : (
          <Text
            style={countryNameStyle(ColorConstants.RED, countrySupportNoMargin)}
          >
            (Not Supported)
          </Text>
        );

      return (
        <View style={countryItemStyle(notPressableCountryItemOpacity)}>
          <Text
            style={countryNameStyle(ColorConstants.GRAY, StyleConstants.MARGIN)}
          >
            {countryName} {userMessageSupport}
          </Text>
        </View>
      );
    },
    []
  );

  const renderPressableCountryItem = useCallback(
    (countryName: string) => (
      <Pressable
        onPress={() => onCountryPress(countryName)}
        onHoverIn={() => onCountryHover(countryName)}
        onHoverOut={() => onCountryHover("")}
        style={countryItemStyle(pressableCountryItemOpacity)}
      >
        {countryName === selectedCountry ? (
          <View style={highlightedCountryItemStyle}>
            <Text
              style={countryNameStyle(
                ColorConstants.BLUE,
                highlightedCountryNameLeftMargin
              )}
            >
              {countryName}
            </Text>
          </View>
        ) : countryName === hoveredCountry ? (
          <View style={highlightedCountryItemStyle}>
            <Text
              style={countryNameStyle(
                ColorConstants.BLACK,
                highlightedCountryNameLeftMargin
              )}
            >
              {countryName}
            </Text>
          </View>
        ) : (
          <Text
            style={countryNameStyle(ColorConstants.GRAY, StyleConstants.MARGIN)}
          >
            {countryName}
          </Text>
        )}
      </Pressable>
    ),
    [selectedCountry, hoveredCountry]
  );

  const renderCountryItem = useCallback(
    (countryRow: ListRenderItemInfo<CountryT>) => (
      <View>
        {countryRow.item.support === "full"
          ? renderPressableCountryItem(countryRow.item.name)
          : renderNotPressableCountryItem(
              countryRow.item.name,
              countryRow.item.support
            )}
      </View>
    ),
    [selectedCountry, hoveredCountry]
  );

  const selectedCountryView = useCallback(
    () => (
      <TextInput
        onFocus={onTextInputFocus}
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
      <Animated.View style={countriesContainerStyle}>
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
    <View style={wholeContainerStyle}>
      <View style={countryChoserContainerStyle}>
        <View style={labelAndTextInputContainerStyle}>
          <Text style={labelStyle}>COUNTRY OF RESIDENCE</Text>

          {selectedCountryView()}
        </View>

        <Pressable onPress={onDropdownPress} style={arrowIconButtonStyle}>
          <Image
            source={require("../../assets/images/arrow_down.png")}
            style={arrowIconImageStyle}
          />
        </Pressable>
      </View>

      <View style={blackLineStyle} />

      {maybeRenderList()}
    </View>
  );
}
