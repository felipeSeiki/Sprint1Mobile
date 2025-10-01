import React from 'react';
import { View } from 'react-native';
import Header from './Header';
import styled from 'styled-components/native';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <Container>
      <Header />
      <Content>
        {children}
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Content = styled.View`
  flex: 1;
`;

export default ProtectedLayout;