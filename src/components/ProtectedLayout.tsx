import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <Container>
      <Content>
        {children}
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #1A1A1A;
`;

const Content = styled.View`
  flex: 1;
`;

export default ProtectedLayout;