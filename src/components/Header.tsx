import React from 'react';
import { Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import styled from 'styled-components/native';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

interface HeaderContainerProps {
  title?: string;
  showLogo?: boolean;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ title, showLogo = true }) => {
  return (
    <StyledHeaderContainer>
      {showLogo ? (
        <Image
          source={require('../../assets/MottuLogo.png')}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
      ) : null}
      {title ? (
        <StyledTitle showLogo={showLogo}>{title}</StyledTitle>
      ) : null}
    </StyledHeaderContainer>
  );
};

interface StyledContainerProps {
  showLogo?: boolean;
}

const StyledHeaderContainer = styled.View<StyledContainerProps>`
  background-color: ${theme.colors.background};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
  flex-direction: row;
  justify-content: ${(props: StyledContainerProps) => props.showLogo ? 'space-between' : 'center'};
  align-items: center;
`;

interface HeaderTitleProps {
  showLogo?: boolean;
}

const StyledTitle = styled.Text<HeaderTitleProps>`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.text};
  ${(props: HeaderTitleProps) => props.showLogo ? 'flex: 1; text-align: right;' : ''};
`;

const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container>
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          title={user.user.charAt(0).toUpperCase()}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          <UserName>{user.user}</UserName>
        </TextContainer>
      </UserInfo>
    </Container>
  );
};

const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const Container = styled.View`
  background-color: ${theme.colors.background};
  padding: 16px;
  border-bottom-width: 1px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TextContainer = styled.View`
  margin-left: 12px;
`;

const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export default Header;