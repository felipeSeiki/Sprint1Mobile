import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const PageTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: ${theme.colors.white};
  margin: 32px 0 16px 0;
  text-align: center;
`;

export const Card = styled.View`
  background-color: #232323;
  border-radius: 16px;
  margin: 0 16px;
  padding: 24px 16px 16px 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 4;
  flex-shrink: 0;
`;

export const CardContent = styled.View`
  gap: 8px;
`;

export const CardButton = styled.TouchableOpacity`
  background-color: #00CF3A;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 12px;
`;

export const CardButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;