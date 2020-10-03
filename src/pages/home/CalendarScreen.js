import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CalendarScreen = () => {
    return (
      <View style={styles.container}>
        <Text>CalendarScreen</Text>
        <Button
          title="Clique aqui"
          onPress={() => alert('Botão clicado!')}
        />
      </View>
    );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
