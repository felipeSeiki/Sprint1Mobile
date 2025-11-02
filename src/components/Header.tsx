import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import styled from 'styled-components/native';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

interface HeaderContainerProps {
  title?: string;
  showLogo?: boolean;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ title, showLogo = true }) => {
  return (
    <StyledHeaderContainer showLogo={showLogo}>
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

// Header global para React Navigation (inclui botão de voltar e logout quando autenticado)
export const AppStackHeader: React.FC<NativeStackHeaderProps> = ({ route, navigation }) => {
  const { user, signOut } = useAuth();
  const displayName = (user && (user.user || (user as any).login || (user as any).name || (user as any).email)) || '';
  const isLogin = route?.name === 'Login';
  const isHome = route?.name === 'Home';
  const isDashboard = route?.name === 'Dashboard';
  const isMaster = user?.role === 'MASTER';
  const canNavigateHome = user && !isLogin && !isHome && isMaster && !isDashboard;
  
  // Debug: remova após verificar
  console.log('Header Debug:', { 
    routeName: route?.name, 
    userRole: user?.role, 
    isMaster, 
    canNavigateHome 
  });

  return (
    <StyledHeaderContainer showLogo>
      <HeaderLeft>
        <Image
          source={require('../../assets/MottuLogo.png')}
          style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
        {canNavigateHome && (
          <TouchableOpacity onPress={() => navigation.navigate('Home' as any)} style={{ marginLeft: 16 }}>
            <Icon name="home" type="material" color={theme.colors.white} size={28} />
          </TouchableOpacity>
        )}
      </HeaderLeft>
      {user && !isLogin ? (
        <HeaderRight>
          <HeaderUserName numberOfLines={1} ellipsizeMode="tail">
            {displayName || 'Usuário'}
          </HeaderUserName>
          <TouchableOpacity onPress={signOut}>
            <Icon name="logout" type="material" color={theme.colors.white} size={24} />
          </TouchableOpacity>
        </HeaderRight>
      ) : (
        <Spacer />
      )}
    </StyledHeaderContainer>
  );
};

interface StyledContainerProps {
  showLogo?: boolean;
}

const StyledHeaderContainer = styled.View<StyledContainerProps>`
  background-color: #000; /* force dark header on web */
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
  flex-direction: row;
  justify-content: ${(props: StyledContainerProps) => props.showLogo ? 'space-between' : 'center'};
  align-items: center;
  width: 100%;
`;

interface HeaderTitleProps {
  showLogo?: boolean;
}

const StyledTitle = styled.Text<HeaderTitleProps>`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: bold;
  color: ${theme.colors.white};
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
            color={theme.colors.white}
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

const Spacer = styled.View`
  width: 24px;
  height: 24px;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const HeaderUserName = styled.Text`
  max-width: 180px;
  color: ${theme.colors.white};
  font-weight: bold;
`;

const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default Header;