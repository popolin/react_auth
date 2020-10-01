import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../config/colors.json'

export default function AlertView(props) {

  const styleText = props.error ? 
    {...{fontWeight: 'bold'}, ...styles.messageError} : 
    {...{fontWeight: 'bold'}, ...styles.messageInfo };
  return(
    (props.message != null && props.message.trim().length > 0) &&
    <View style={props.error ? styles.alertError : styles.alertInfo}>
      <Text style={props.error ? styles.messageError : styles.messageInfo}>{props.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertError: {
    backgroundColor: Colors.BACKGROUND_ERROR,
    width: '100%',
    borderRadius: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    paddingStart: 10,
    paddingEnd: 10,
  },
  alertInfo: {
    backgroundColor: Colors.BACKGROUND_INFO,
    width: '100%',
    borderRadius: 5,
    marginTop: 15,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    paddingStart: 10,
    paddingEnd: 10,
  },
  messageError: {
    fontSize: 14,
    color: Colors.TEXT_ERROR,
  },
  messageInfo: {
    fontSize: 14,
    color: Colors.TEXT_INFO
  }

});


