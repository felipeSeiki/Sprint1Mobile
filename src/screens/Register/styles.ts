import { Platform, StyleSheet } from "react-native";
import styled from "styled-components/native";

export const FormCard = styled.View`
  width: 95%;
  background-color: #2a2a2a;
  border-radius: 20px;
  border: 2px solid #00cf3a;
  margin: 10px auto;
  padding: 20px;
  max-width: 500px;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    minHeight: "100%",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginLeft: -25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00CF3A",
    textAlign: "center",
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    height: 50,
    backgroundColor: "#2F8028", // Verde do Google
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  logOutButton: {
    height: 30,
    width: 50,
    backgroundColor: "#00CF3A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    alignSelf: "center",
  },
  loginText: {
    color: "#037325",
    fontSize: 14,
  },
});
