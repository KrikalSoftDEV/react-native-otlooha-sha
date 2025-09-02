import React, {useState, useEffect, version} from 'react';
import {View, TextInput, StyleSheet, Image, Dimensions} from 'react-native';
import {SubText, ErrorText} from '../../components/UI/CustomText';
import Colors from '../../constants/Colors';
import {VALIDATION} from '../../constants/Strings';
import {scale, verticalScale} from 'react-native-size-matters';
import emailinputUser from '../../assets/images/Vector/email_input_User.png';
const {width,height}=Dimensions.get('window')
const CommonTextInput = props => {
  // const [isTextValid, setIsTextValid] = useState(
  //   props.initValue ? true : false,
  // );
  // const [enteredText, setEnteredText] = useState('johnsmith@waqaf.com');
  // const [isTouched, setIsTouched] = useState(false);
  // const [passwordVisibility, setPasswordVisibility] = useState(props.password);
  // const [clearText, setClearText] = useState(false);
  // const [isActive, setIsActive] = useState();
  // let inputRef = null;

  const onTextChangeHandler = text => {
    // const emailRegex =
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // let isValid = true;
    // if (props.required && text.trim().length === 0) {
    //   isValid = false;
    // }
    // if (props.email && !emailRegex.test(text.toLowerCase())) {
    //   isValid = false;
    // }

    // if (
    //   !props.login &&
    //   props.password &&
    //   !passwordRegex.test(text.toLowerCase())
    // ) {
    //   isValid = false;
    // }

    // if (props.min != null && +text < props.min) {
    //   isValid = false;
    // }
    // if (props.max != null && +text > props.max) {
    //   isValid = false;
    // }
    // if (props.minLength != null && text.length < props.minLength) {
    //   isValid = false;
    // }
    // if (props.maxLength != null && text.length > props.maxLength) {
    //   isValid = false;
    // }
    // if (
    //   (props.id === 'mobileNo' && text.replace(/0/g, '').length === 0) ||
    //   (props.id === 'mobileNo' && text.charAt(0) === '0')
    // ) {
    //   isValid = false;
    // }

    // if (props.onlyCharacters) {
    //   text = text.replace(/[^A-Za-z]/gi, '');
    // }

    // setIsTextValid(isValid);
    props.setEnteredText(text);
  };

  // const lostFocus = () => {
  //   setIsTouched(true);
  //   setIsActive(false);
  // };

  // //Clear the login page
  // useEffect(() => {
  //   if (props.refresh != undefined) {
  //     setEnteredText('');
  //     if (enteredText && enteredText.length !== 0) {
  //       setClearText(!clearText);
  //     }
  //     inputRef.blur();
  //     setIsTextValid(false);
  //     setIsTouched(false);
  //   }
  // }, [props.refresh, clearText]);

  // useEffect(() => {
  //   if (props.showError) {
  //     setIsTouched(true);
  //   }
  // }, [props.showError]);

  // const {textInputChangeHandler, id} = props;
  // useEffect(() => {
  //   textInputChangeHandler(id, enteredText, isTextValid);
  // }, [textInputChangeHandler, id, enteredText, isTextValid]);

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
            // color:
            //   isActive && props.editable == undefined
            //     ? Colors.PrimaryBlue
            //     : Colors.LightGray,
          }}>
          {props.title}
        </SubText>
        <View
          style={{
    
            ...styles.inputTextView,
            // borderColor:
            //   isActive && props.editable == undefined
            //     ? Colors.PrimaryBlue
            //     : Colors.LightGray,
            backgroundColor:
              props.editable || props.editable == undefined
                ? 'white'
                : "#DDE2EB",
          }}>
          <TextInput
            style={{
              ...styles.input,
              ...props.style,
              width: props.password ? "85%": "100%",
              padding: 0,
            }}
            {...props}
            selectionColor={Colors.PrimaryBlue}
            value={props.enteredText}
            onChangeText={onTextChangeHandler}
            // onEndEditing={lostFocus}
            // ref={input => {
            //   inputRef = input;
            // }}
            // secureTextEntry={passwordVisibility}
            maxFontSizeMultiplier={1}
            onTouchStart={() => {
              // setIsActive(true);
            }}
           
            placeholderTextColor={"#C3CAD6"}
            editable={props.editable}
            placeholder={props.placeholder}
             {...(props.maxLength ? { maxLength: props.maxLength } : {})}
            autoFocus={props.autoFocus}
            ref={props.inputRef}
          />
          {/* {props.password && (
          <TButton
            style={styles.password}
            image={
              passwordVisibility
                ? require('../../assets/visibilityoff.png')
                : require('../../assets/visibilityon.png')
            }
            imageStyle={styles.passwordImg}
            onButtonClick={() => {
              setPasswordVisibility(!passwordVisibility);
            }}
          />
        )} */}
        </View>
        {props.showError && props.error ? (
          <ErrorText style={styles.error}>{props.error}</ErrorText>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    marginVertical: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#686E7A',
  },
  inputTextView: {
    borderColor: Colors.LightGray,
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
  },

  input: {
    // padding: 10,
    // height: 50,
    fontSize: 17,
    fontWeight: '400',
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
});

export default CommonTextInput;
