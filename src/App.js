import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import {AuthProvider} from './context/auth';

const App = () => {

  return (
    <PaperProvider>
      <AuthProvider />
    </PaperProvider>
  );
}

export default App;
