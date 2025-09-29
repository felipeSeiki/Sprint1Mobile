import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginLeft: -25, // Para alinhar melhor o logo
  }, pickerContainer: {
    borderWidth: 1,
    borderColor: '#00CF3A',
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    overflow: 'hidden',
    marginTop: 5,
  },
  picker: {
    color: '#FFFFFF',
    height: isSmallDevice ? 45 : 50,
    backgroundColor: '#333333',
  },
  logOutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: isSmallDevice ? 15 : 25,
    marginHorizontal: isSmallDevice ? 10 : 20,
    borderColor: '#00CF3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    color: '#00CF3A',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  label: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: isSmallDevice ? 45 : 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    backgroundColor: '#333333',
  },
  positionContainer: {
    marginBottom: isSmallDevice ? 20 : 25,
  },
  positionInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  positionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  positionLabel: {
    marginRight: 10,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    width: 20,
    fontWeight: '500',
  },
  positionInput: {
    flex: 1,
  },
  submitButton: {
    height: isSmallDevice ? 48 : 52,
    backgroundColor: '#00CF3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logOutButton: {
    height: 30,
    width: 50,
    backgroundColor: '#00CF3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: 'bold',
  },
});