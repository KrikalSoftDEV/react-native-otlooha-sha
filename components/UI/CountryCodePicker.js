import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import {verticalScale} from 'react-native-size-matters';
import res from '../../constants/res';
import ArrowDown from '../../assets/images/Common/arrow_down1.svg';

const CountryCodePicker = props => {
  const [countryCode, setCountryCode] = useState('MY');
  const [country, setCountry] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  console.log(props.countryCode, 'check the coutry code');
  const onSelect = country => {
    setCountryCode(country.cca2);
    setCountry(country);
    props.setCountryCode(country?.callingCode?.[0]);
    setShowPicker(false); // hide after selection
  };
  useEffect(() => {
    if (props.countryCode !== undefined) {
      const findCountryCodeFromCallingCode = async () => {
        const allCountries = await getAllCountries();
        const match = allCountries.find(
          country =>
            country.callingCode?.[0] === props.countryCode?.replace('+', ''),
        );
        if (match) {
          setCountryCode(match.cca2);
          setCountry(match);
        }
      };

      if (props.countryCode) {
        findCountryCodeFromCallingCode();
      }
    }
  }, [props.countryCode]);
  console.log(country?.callingCode, countryCode, 'check the code');
  return (
    <View
      style={[
        styles.container,
        props.error && { borderColor: 'red' },
        {
          backgroundColor: props.editable === false ? '#DDE2EB' : 'white',
        },
      ]}>
      <Text style={styles.label}>{res.strings.country_code}</Text>

      <View style={styles.pickerWrapper}>
        {/* Country Picker Modal - controlled by showPicker */}

        <CountryPicker
          countryCode={countryCode}
          withFilter
          withCallingCode
          withFlag
          withCountryNameButton={false}
          withAlphaFilter={false}
          onSelect={onSelect}
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          // withFlagButton={false}
          // disableNativeModal={true}
          // countryCodes={['IN', 'SG', 'MY']}
        />

        {/* Custom trigger for opening modal */}
        <TouchableOpacity
          style={styles.triggerButton}
          onPress={() => props.editable !== false && setShowPicker(true)}
          disabled={props.editable === false}>
          <View>
            {/* <Image
              source={{
                uri: `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`,
              }}
              style={{width: 27, height: 18, marginRight: 10}}
            /> */}
          </View>
          {props?.countryCode ? <Text style={styles.codeText}>
            {`${props?.countryCode?.includes("+")? props?.countryCode: "+"+ props?.countryCode}`}
          </Text>:<Text style={styles.codeText}>     </Text>}
          <ArrowDown />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(10),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: 'red',
    borderRadius: 12,
    padding:15
    // padding: Platform.OS === 'android' ? verticalScale(20) : verticalScale(16),
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#686E7A',
    position: 'absolute',
    paddingTop: Platform.OS == "android" ? 10 : 15,
    left: 20,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 5,
  },
  codeText: {
    marginRight: 5,
    fontSize: 17,
    fontWeight: '500',
    color: '#181B1F',
    paddingRight: 5,
  },
});

export default CountryCodePicker;
