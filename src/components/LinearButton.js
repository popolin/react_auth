import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../config/colors.json'

import FontAwesomeSpin from './FontAwesomeSpin'

export default function LinearButton(props) {

  const {onPress} = props;
  const estilos = {...props.styles, ...styles.linearButtonTouch};
  const handlePress = params => {
    props.onPress(params);
  };
  return(
    <TouchableOpacity
        disabled={props.on}
        style={props.on ? {...estilos, ...styles.linearButtonTouchDisabled} : estilos}
        onPress={(param) => handlePress(param)}>
    <LinearGradient
        style={props.on ? {...estilos, ...styles.linearButtonTouchDisabled} : estilos}
        colors={Colors.BTN_MAIN_LINEAR} >

        {props.on && (
            <View style={{marginRight: 10}} >
              <FontAwesomeSpin style={{fontSize: 32}}>
              <FontAwesome 
                  name="refresh"
                  color={Colors.ICON_GREEN}
                  size={20}
              />
            </FontAwesomeSpin>
          </View>
        )}
        
        <Text style={props.on ? styles.linearButtonTextDisabled : styles.linearButtonText }>
          {props.on && (props.textLoading || props.text)}
          {!props.on && props.text}
        </Text>
    </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linearButtonTouch: {
    width: '100%',
    height: 50,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  linearButtonTouchDisabled: {
    opacity: 0.5
  },
  linearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BTN_MAIN_TEXT
  },
  linearButtonTextDisabled: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.ICON_GREEN
  },
});
