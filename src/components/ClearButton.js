import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../config/colors.json'

export default function LinearButton(props) {

  const {onPress} = props;

  return(
    <TouchableOpacity
        onPress={(param) => onPress(param)}
        style={[styles.linearButtonTouch, {
            borderColor: Colors.BTN_CLEAR,
            borderWidth: 1,
            marginTop: 15
        }]} >
        <Text style={[styles.linearButtonText, {
            color: Colors.BTN_CLEAR
        }]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linearButtonTouch: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  linearButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
});


