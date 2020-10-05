import Colors from '../../config/colors.json'

export default {

  container: {
    flex: 1, 
    backgroundColor: Colors.BACKGROUND_SEC
  },
  header: {
      flex: 2,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: Colors.BACKGROUND_FOOTER,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BTN_BORDER_ACTION,
    paddingBottom: 5
  },
  // logo: {
  //     width: height_logo,
  //     height: height_logo
  // },
  // prontow: {
  //   marginTop: 10,
  //   height: height_prontow,
  //   width: width_prontow
  // },
  title: {
      color: Colors.TITLE_MAIN,
      fontFamily: 'Roboto,sans-serif',
      fontSize: 26,
      letterSpacing: 3,
      textTransform: 'uppercase',
      fontWeight: '700'
  },
  text_header: {
      color: Colors.HEADER_TEXT,
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: Colors.FOOTER_TEXT,
      fontSize: 18,
      marginTop: 0
  },
  text: {
      color: Colors.TEXT,
      marginTop:5
  },
  description: {
    fontSize:16,
    color: 'grey',
    marginTop: 5,
    fontStyle: 'italic',
    position: 'relative',
    textAlign: 'left',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: Colors.INPUT_FORM,
  },
  selectUF: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: Colors.INPUT_FORM,
    maxWidth: 100,
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 20
  },
  // signIn: {
  //     width: 180,
  //     height: 40,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     borderRadius: 50,
  //     flexDirection: 'row'
  // },
  textSign: {
      color: Colors.BTN_MAIN_TEXT,
      fontWeight: 'bold'
  },
  linearBlueButton: {
    width: '100%',
    height: 50,
    paddingStart: 10,
    paddingEnd: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BTN_BLUE,
    flexDirection: 'row',
    justifyContent : 'space-between',
    marginTop: 15
  },
  linearBlueButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  linearBlueButtonDetail: {
    fontSize: 14,
    alignContent: 'flex-end',
    right: 0,
    color: Colors.TEXT,
    fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  color_textPrivate: {
      color: Colors.TEXT
  }
  
}
