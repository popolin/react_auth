import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import {LOADING} from '../../src/config/colors.json'


const Loading = ({navigation}) => {
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator
        color={LOADING}
        size='large'
      />
    </View>
  )
};

export default Loading;


const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    top: height/2,
    left: width/2
  },
});
