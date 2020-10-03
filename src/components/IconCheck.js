import React from 'react';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

export default function IconCheck(props) {
    const iconOk = props.iconOk || 'check-circle';
    const iconNot = props.iconNot || 'x-circle';
    const colorOk = props.iconNot || 'green';
    const colorNot = props.iconNot || '#8a0303';
    return (
      <Animatable.View
          animation="bounceIn">
          <Feather 
              name={props.on ? iconOk : iconNot}
              color={props.on ? colorOk : colorNot}
              size={20}
          />
      </Animatable.View>
    );
};
