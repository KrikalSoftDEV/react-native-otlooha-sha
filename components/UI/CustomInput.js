import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {SubText, ErrorText} from '../../components/UI/CustomText';
import Colors from '../../constants/Colors';
import {VALIDATION} from '../../constants/Strings';

const CustomInput = props => {
  const [isTextValid, setIsTextValid] = useState(
    props.initValue ? true : false,
  );
  const [enteredText, setEnteredText] = useState(props.initValue);
  const [isTouched, setIsTouched] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(props.password);
  const [clearText, setClearText] = useState(false);
  const [isActive, setIsActive] = useState();
  let inputRef = null;

  const onTextChangeHandler = text => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }

    if (
      !props.login &&
      props.password &&
      !passwordRegex.test(text.toLowerCase())
    ) {
      isValid = false;
    }

    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.maxLength != null && text.length > props.maxLength) {
      isValid = false;
    }
    if (
      (props.id === 'mobileNo' && text.replace(/0/g, '').length === 0) ||
      (props.id === 'mobileNo' && text.charAt(0) === '0')
    ) {
      isValid = false;
    }

    if (props.onlyCharacters) {
      text = text.replace(/[^A-Za-z]/gi, '');
    }

    setIsTextValid(isValid);
    setEnteredText(text);
  };

  const lostFocus = () => {
    setIsTouched(true);
    setIsActive(false);
  };

  //Clear the login page
  useEffect(() => {
    if (props.refresh != undefined) {
      setEnteredText('');
      if (enteredText && enteredText.length !== 0) {
        setClearText(!clearText);
      }
      inputRef.blur();
      setIsTextValid(false);
      setIsTouched(false);
    }
  }, [props.refresh, clearText]);

  useEffect(() => {
    if (props.showError) {
      setIsTouched(true);
    }
  }, [props.showError]);

  const {textInputChangeHandler, id} = props;
  useEffect(() => {
    textInputChangeHandler(id, enteredText, isTextValid);
  }, [textInputChangeHandler, id, enteredText, isTextValid]);

  return (
    <View style={styles.inputView}>
      <SubText
        style={{
          ...styles.title,
          color:
            isActive && props.editable == undefined
              ? Colors.PrimaryBlue
              : Colors.LightGray,
        }}>
        {props.title}
      </SubText>
      <View
        style={{
          ...styles.inputTextView,
          borderColor:
            isActive && props.editable == undefined
              ? Colors.PrimaryBlue
              : Colors.LightGray,
          backgroundColor:
            props.editable || props.editable == undefined
              ? 'white'
              : Colors.LightGray,
        }}>
        <TextInput
          style={{
            ...styles.input,
            ...props.style,
            width: props.password ? '85%' : '100%',
          }}
          {...props}
          selectionColor={Colors.PrimaryBlue}
          value={enteredText}
          onChangeText={onTextChangeHandler}
          onEndEditing={lostFocus}
          ref={input => {
            inputRef = input;
          }}
          autoCorrect={false}
     
          spellCheck={false}
          secureTextEntry={passwordVisibility}
          maxFontSizeMultiplier={1}
          onTouchStart={() => {
            setIsActive(true);
          }}
          editable={props.editable}
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
      {(!props.password || props.login) && isTouched && !isTextValid && (
        <ErrorText style={styles.error}>
          {enteredText &&
          enteredText.length != 0 &&
          enteredText.length < 6 &&
          props.errorMsg2
            ? props.errorMsg2
            : props.errorMsg}
        </ErrorText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    marginVertical: 12,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 15,
  },
  inputTextView: {
    borderColor: Colors.LightGray,
    borderWidth: 1,
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
  },

  input: {
    padding: 10,
    height: 50,
    fontSize: 18,
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

export default CustomInput;
