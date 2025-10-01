import styled from 'styled-components/native';
import theme from './theme';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.white};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})`
  flex: 1;
  background-color: ${theme.colors.white};
`;

export const PageTitle = styled.Text`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin: ${theme.spacing.medium}px;
  text-align: center;
`;
