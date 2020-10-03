import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DetailsScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Details Screen</Text>
        <Button
            title="Vá para detalhes novamente"
            onPress={() => navigation.push("Details")}
        />
        <Button
            title="Vá para Home"
            onPress={() => navigation.navigate("Home")}
        />
        <Button
            title="Voltar"
            onPress={() => navigation.goBack()}
        />
      </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
