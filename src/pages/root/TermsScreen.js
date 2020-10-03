import React from 'react';
import {WebView} from 'react-native-webview';

import Loading from '../../components/Loading'


const TermsScreen = ({navigation}) => {
  
  return (
    <WebView 
        startInLoadingState={true}
        renderLoading={() => <Loading />}
        source={{uri: 'http://prontow.com.br/termos'}} />
  )

};

export default TermsScreen;
