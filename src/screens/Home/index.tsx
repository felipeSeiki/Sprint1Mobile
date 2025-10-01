import React, { useState, useEffect, useRef } from 'react';
import { Text, Modal, PanResponder, Animated, TouchableOpacity, Image } from 'react-native';
import { HomeScreenProps } from './type/type';
import { AddButton, AddButtonText, AnimatedCardContainer, BikeIcon, BikeSpot, BottomContainer, Card, CardContainer, Column, Container, EmptySpace, Row, styles } from './styles';
import { HeaderContainer } from '../../components/Header';
import { useHome } from './hook/useHome';
import { parkingSpots } from './models/parkSpotsMock';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const {
        motos,
        panResponder,
        pan,
        scale,
        handleMotoPress,
        handleLogOut,
        getSpotColor
    } = useHome();

    const renderMotoSpot = (x: number, y: number) => {
        const moto = motos.find(m => m.posicaoX === x.toString() && m.posicaoY === y.toString());
        return (
            <BikeSpot
                key={`${x}-${y}`}
                color={getSpotColor(moto)}
                onPress={() => moto && handleMotoPress(moto)}
            >
                <BikeIcon>🏍</BikeIcon>
            </BikeSpot>
        );
    };


    return (
        <Container>
            <CardContainer>
                <AnimatedCardContainer
                    {...panResponder.panHandlers}
                    style={{
                        transform: [
                            { translateX: pan.x },
                            { translateY: pan.y },
                            { scale: scale }
                        ]
                    }}
                >
                    <Card>
                        {/* Topo do pátio */}
                        <Row>
                            {parkingSpots.top.x.map(x => renderMotoSpot(x, parkingSpots.top.y))}
                        </Row>

                        {/* Centro do pátio */}
                        <Row style={{ justifyContent: 'space-between', marginVertical: 30 }}>
                            <Column style={{ width: '30%' }}>
                                {[0, 1, 2].map(x => renderMotoSpot(x, parkingSpots.middle.y))}
                            </Column>
                            <EmptySpace />
                            <Column style={{ width: '30%' }}>
                                {[8, 9, 10].map(x => renderMotoSpot(x, parkingSpots.middle.y))}
                            </Column>
                        </Row>

                        {/* Base do pátio */}
                        <Row>
                            {parkingSpots.bottom.x.map(x => renderMotoSpot(x, parkingSpots.bottom.y))}
                        </Row>
                    </Card>
                </AnimatedCardContainer>
            </CardContainer>

            <BottomContainer>
                <AddButton onPress={() => navigation.navigate('Dashboard')}>
                    <AddButtonText>DashBoard</AddButtonText>
                </AddButton>
                <AddButton onPress={() => navigation.navigate('RegisterMoto')}>
                    <AddButtonText>+ ADD MOTO</AddButtonText>
                </AddButton>
            </BottomContainer>
        </Container>
    );
};

export default HomeScreen;