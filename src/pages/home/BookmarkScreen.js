import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const BookmarkScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Tela Vazia</Text>
        <Button
          title="Clique aqui"
          onPress={() => alert('Clicou!')}
        />
      </View>
    );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
