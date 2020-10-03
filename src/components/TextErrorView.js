import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../config/colors.json'

export default function TextErrorView(props) {

  const {message} = props;
  
  return(
    message && 
    <Animatable.View animation="fadeInLeft" duration={500}>
        <Text style={styles.errorMsg}>{message}</Text>
      </Animatable.View>
  )
}

const styles = StyleSheet.create({
  errorMsg: {
    color: Colors.BTN_ERROR,
    fontSize: 14,
  }

});