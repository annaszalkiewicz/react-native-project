import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  StyleSheet
} from "react-native";

const PrimaryButton = props => {
  const content = (
    <View style={[styles.button, props.style, props.disabled ? styles.disabled : null, ]}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </View>
  );
  if (props.disabled) {
    return content;
  }
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: "#142711",
    borderRadius: 5
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  disabled: {
    backgroundColor: '#7e887c',
    borderWidth: 3,
    borderColor: '#142711'
  }
});

export default PrimaryButton;
