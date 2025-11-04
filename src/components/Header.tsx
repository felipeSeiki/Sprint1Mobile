import React from 'react';
import { Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaWrapper edges={['top']}>
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
    </SafeAreaWrapper>
  );
};

// Header global para React Navigation (inclui botão de voltar e logout quando autenticado)
export const AppStackHeader: React.FC<NativeStackHeaderProps> = ({ route, navigation }) => {
  const { user, signOut } = useAuth();
  const displayName = (user && (user.user || (user as any).login || (user as any).name || (user as any).email)) || '';
  const isLogin = route?.name === 'Login';
  const isHome = route?.name === 'Home';
  const canNavigateHome = user && !isLogin && !isHome;

  return (
    <SafeAreaWrapper edges={['top']}>
      <StyledHeaderContainer showLogo>
        <HeaderLeft>
          <Image
            source={require('../../assets/MottuLogo.png')}
            style={{ width: 120, height: 40, resizeMode: 'contain' }}
          />
          {canNavigateHome && (
            <IconButton 
              onPress={() => {
                try {
                  console.log('Navegando para Home...');
                  navigation.navigate('Home' as any);
                } catch (error) {
                  console.error('Erro ao navegar para Home:', error);
                }
              }}
            >
              <Icon name="home" type="material" color={theme.colors.white} size={28} />
            </IconButton>
          )}
        </HeaderLeft>
        {user && !isLogin ? (
          <HeaderRight>
            <HeaderUserName numberOfLines={1} ellipsizeMode="tail">
              {displayName || 'Usuário'}
            </HeaderUserName>
            <IconButton onPress={signOut}>
              <Icon name="logout" type="material" color={theme.colors.white} size={24} />
            </IconButton>
          </HeaderRight>
        ) : (
          <Spacer />
        )}
      </StyledHeaderContainer>
    </SafeAreaWrapper>
  );
};

interface StyledContainerProps {
  showLogo?: boolean;
}

const SafeAreaWrapper = styled(SafeAreaView)`
  background-color: #000;
`;

const StyledHeaderContainer = styled.View<StyledContainerProps>`
  background-color: #000;
  padding: ${theme.spacing.medium}px ${theme.spacing.large}px;
  padding-top: ${theme.spacing.medium}px;
  padding-bottom: ${theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
  flex-direction: row;
  justify-content: ${(props: StyledContainerProps) => props.showLogo ? 'space-between' : 'center'};
  align-items: center;
  width: 100%;
  min-height: 70px;
  z-index: 1000;
  ${Platform.OS === 'ios' ? 'shadow-color: #000; shadow-offset: 0px 2px; shadow-opacity: 0.1; shadow-radius: 4px;' : 'elevation: 4;'}
`;

// Botão de ícone com área de toque ampliada e efeitos visuais
const IconButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin: 0 ${theme.spacing.small}px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  align-items: center;
  ${Platform.OS === 'ios' ? 'shadow-color: #000; shadow-offset: 0px 1px; shadow-opacity: 0.2; shadow-radius: 2px;' : 'elevation: 2;'}
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
    <SafeAreaWrapper edges={['top']}>
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
          <IconButtonStyled onPress={handleLogout}>
            <Icon
              name="logout"
              type="material"
              color={theme.colors.white}
              size={24}
            />
          </IconButtonStyled>
        </RightContent>
      </Container>
    </SafeAreaWrapper>
  );
};

const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const Container = styled.View`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.medium}px ${theme.spacing.large}px;
  padding-top: ${theme.spacing.medium}px;
  padding-bottom: ${theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.primary};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  ${Platform.OS === 'ios' ? 'shadow-color: #000; shadow-offset: 0px 2px; shadow-opacity: 0.1; shadow-radius: 4px;' : 'elevation: 4;'}
`;

const LogoContainer = styled.View`
  flex: 1;
`;

const RightContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.medium}px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconButtonStyled = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  align-items: center;
  ${Platform.OS === 'ios' ? 'shadow-color: #000; shadow-offset: 0px 1px; shadow-opacity: 0.2; shadow-radius: 2px;' : 'elevation: 2;'}
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
  gap: ${theme.spacing.small}px;
  margin-right: ${theme.spacing.small}px;
`;

const HeaderUserName = styled.Text`
  max-width: 180px;
  color: ${theme.colors.white};
  font-weight: bold;
  padding: ${theme.spacing.small}px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
`;

const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${theme.spacing.small}px;
`;

export default Header;