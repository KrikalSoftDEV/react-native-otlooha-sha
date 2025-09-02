import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { SubText } from '../../components/UI/CustomText';
import Colors from '../../constants/Colors';
import { VALIDATION } from '../../constants/Strings';
import { scale, verticalScale } from 'react-native-size-matters';
import emailinputUser from '../../assets/images/Vector/email_input_User.png';
import CountryPicker from 'react-native-country-picker-modal';
import ArrowDown from '../../assets/images/Common/arrow_down1.svg';
const Emailinput = props => {

  const onTextChangeHandler = text => {
    props.setEnteredText(text);
  };
  const [cca2, setCca2] = useState('MY');
  const [country, setCountry] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const onSelect = selected => {
    setCca2(selected?.cca2);
    props?.setCountryCode(selected?.callingCode[0]);
    setCountry(selected);
    setShowPicker(false);

  };

  const CountryCodePicker = () => {
    return (
     <View style={styles.pickerWrapper}>
        <CountryPicker
          countryCode={cca2}
          withFilter
          withCallingCode
          withFlag
          withCountryNameButton={false}
          withAlphaFilter={false}
          onSelect={onSelect}
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          flatListProps={{
    initialNumToRender: 20,
    maxToRenderPerBatch: 30,
    windowSize: 10,
  }}
        // countryCodes={['IN', 'SG', 'MY']}
        />

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => setShowPicker(true)}
          disabled={props.editable === false}>
          <ArrowDown />
          <Text style={styles.codeText}>
            +{props?.countryCode }
          </Text>
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <View style={[styles.inputView, props.containerStyle]}>
      {props.isShowImage && (
        <Image
          source={emailinputUser}
          style={{
            height: 24,
            width: 24,
            alignSelf: 'center',
            marginRight: 20,
          }}
        />
      )}
      <View>
        <SubText
          style={{
            ...styles.title,
          }}>
          {props.title}
        </SubText>
        <View
          style={{
            ...styles.inputTextView,
            backgroundColor:
              props.editable || props.editable == undefined
                ? 'white'
                : "#DDE2EB",
          }}>
          {(props.login && props.isPhone) && CountryCodePicker()}
          <TextInput
        // autoCapitalize={props.allCaps ? 'characters' : 'none'}
          autoCorrect={false}
          spellCheck={false}
            style={{
              ...styles.input,
              ...props.style,
              width: props.password ? "85%" : props.login&&props.isPhone?"65%":"100%",
              padding: 0,
            }}
            {...props}
            
            selectionColor={Colors.PrimaryBlue}
            value={props.enteredText}
            onChangeText={onTextChangeHandler}
            maxFontSizeMultiplier={1}
            placeholderTextColor={"#C3CAD6"}
            editable={props.editable}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            placeholder={props.placeholder}
            {...(props.maxLength ? { maxLength: props.maxLength } : {})}
             autoCapitalize="words"
          />
        </View>
        {!props.login && props.password && (
          <SubText
            style={{
              ...styles.passwordMsg,
              color:
                isTextValid || !isTouched ? Colors.LightGray : Colors.errorTxt,
            }}>
            {VALIDATION.password}
          </SubText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    marginVertical: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems:"center"
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#686E7A',
  },
  inputTextView: {
    borderColor: Colors.LightGray,
    marginTop:10,
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    fontSize: 17,
    fontWeight: '500',
    color: '#181B1F',
  },
  error: {
    marginTop: 4,
  },
  password: {
    marginRight: 10,
  },
  passwordImg: {
    height: 25,
    width: 25,
  },
  passwordMsg: {
    fontSize: 14,
    marginTop: 4,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop:20,
  },
  codeText: {
    marginHorizontal: 5,
    fontSize: 17,
    fontWeight: '400',
    color: '#181B1F',
    paddingRight: 5,

  },
});

export default Emailinput;
