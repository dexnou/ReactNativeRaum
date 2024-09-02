import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
// Background styles
background: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#03175E',
    paddingBottom: '20%',
  },
  topShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#03175E',
    borderBottomRightRadius: 200,
  },
  bottomShape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 200,
  },

  // Container styles
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    marginHorizontal: 20,
    alignItems: 'center',
  },

  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  alreadyHaveAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyHaveAccountText: {
    color: '#000',
    fontSize: 16,
  },
  loginText: {
    color: '#0F1138',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    },

  // Input styles
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },

  // Button styles
button: {
    width: '100%',
    backgroundColor: '#0F1138',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
},
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#AAA',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginRight: 5,
  },

  // Container styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  noAccountText: {
    color: '#000',
    fontSize: 16,
},
registerText: {
    color: '#0F1138',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
},


  
});

export default commonStyles;