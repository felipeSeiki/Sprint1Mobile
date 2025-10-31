import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
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
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Container>
      <LogoContainer>
        <Image
          source={require('../../assets/MottuLogo.png')}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
      </LogoContainer>
      <RightContent>
        <UserInfo>
            {(() => {
              const displayName = (user && (user.user || (user as any).login || (user as any).name || (user as any).email)) || '';
              const initial = displayName ? String(displayName).charAt(0).toUpperCase() : '?';
              return (
                <>
                  <Avatar
                    size="small"
                    rounded
                    title={initial}
                    containerStyle={styles.avatar}
                  />
                  <TextContainer>
                    <UserName>{displayName || 'Usuário'}</UserName>
                  </TextContainer>
                </>
              );
            })()}
        </UserInfo>
        <TouchableOpacity onPress={handleLogout}>
          <Icon
            name="logout"
            type="material"
            color={theme.colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </RightContent>
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
  border-bottom-color: ${theme.colors.primary};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.View`
  flex: 1;
`;

const RightContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TextContainer = styled.View`
  margin-left: 8px;
`;

const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export default Header;