import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HomeScreenProps } from './type/type';
import { AddButton, AddButtonText, AnimatedCardContainer, BikeIcon, BikeSpot, BottomContainer, Card, CardContainer, Column, Container, EmptySpace, Row, styles, FilterDropdown } from './styles';
import { useAuth } from '../../contexts/AuthContext';
import { useHome } from './hook/useHome';
// Render agora usa layout por pátio em vez de parkingSpots fixo

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const {
        motos,
        selectedPatioId,
        setSelectedPatioId,
        patioOptions,
        motoAt,
        handleMotoPress,
        handleLogOut,
        getSpotColor,
        layout,
        layoutCapacity,
        occupancy,
    } = useHome();

    const { user } = useAuth();
    const [openPatioSelect, setOpenPatioSelect] = useState(false);

    const renderMotoSpot = (x: number, y: number) => {
        // Encaixa motos do pátio selecionado sequencialmente nas vagas do painel
        const moto = motoAt(x, y);
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

    const splitIntoSegments = (arr: number[]): number[][] => {
        if (!arr || arr.length === 0) return [];
        const sorted = [...arr].sort((a, b) => a - b);
        const segs: number[][] = [];
        let cur: number[] = [];
        sorted.forEach((v) => {
            if (cur.length === 0 || v === cur[cur.length - 1] + 1) {
                cur.push(v);
            } else {
                segs.push(cur);
                cur = [v];
            }
        });
        if (cur.length > 0) segs.push(cur);
        return segs;
    };


    return (
        <Container>
            <CardContainer>
                <AnimatedCardContainer>
                    <Card>
                        {/* Topo do pátio */}
                        <Row>
                            {layout.top.x.map(x => renderMotoSpot(x, layout.top.y))}
                        </Row>

                        {/* Centro do pátio - separa em segmentos quando há lacunas */}
                        {(() => {
                            const segments = splitIntoSegments(layout.middle.x);
                            if (segments.length <= 1) {
                                return (
                                    <Row style={{ marginVertical: 30 }}>
                                        {layout.middle.x.map(x => renderMotoSpot(x, layout.middle.y))}
                                    </Row>
                                );
                            }
                            const first = segments[0];
                            const last = segments[segments.length - 1];
                            return (
                                <Row style={{ justifyContent: 'space-between', marginVertical: 30 }}>
                                    <Column style={{ width: '30%' }}>
                                        {first.map(x => renderMotoSpot(x, layout.middle.y))}
                                    </Column>
                                    <EmptySpace />
                                    <Column style={{ width: '30%' }}>
                                        {last.map(x => renderMotoSpot(x, layout.middle.y))}
                                    </Column>
                                </Row>
                            );
                        })()}

                        {/* Base do pátio */}
                        <Row>
                            {layout.bottom.x.map(x => renderMotoSpot(x, layout.bottom.y))}
                        </Row>
                    </Card>
                </AnimatedCardContainer>
            </CardContainer>

                        <BottomContainer>
                                {/* Ocupação */}
                                <View style={{ marginRight: 12 }}>
                                    <Text style={{ color: '#fff' }}>{occupancy}/{layoutCapacity} vagas</Text>
                                </View>
                                {/* Select de Pátio */}
                                <View style={{ flex: 1, maxWidth: 240, marginRight: 8 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setOpenPatioSelect(prev => !prev)}
                                        style={{
                                            backgroundColor: '#2A2A2A',
                                            borderRadius: 8,
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderWidth: 1,
                                            borderColor: '#00CF3A',
                                        }}
                                    >
                                        <Text style={{ color: '#fff' }}>
                                            {selectedPatioId ? (patioOptions.find(p => p.id === selectedPatioId)?.label ?? 'Selecione um pátio') : 'Selecione um pátio'}
                                        </Text>
                                    </TouchableOpacity>
                                                        {openPatioSelect && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: '#1F1F1F',
                                                                    borderRadius: 8,
                                                                    marginTop: 6,
                                                                    borderWidth: 1,
                                                                    borderColor: '#3A3A3A',
                                                                    // Sem ScrollView: lista simples
                                                                }}
                                                            >
                                                                {patioOptions.map(opt => (
                                                                    <TouchableOpacity
                                                                        key={`${opt.id}`}
                                                                        onPress={() => {
                                                                            setSelectedPatioId(opt.id);
                                                                            setOpenPatioSelect(false);
                                                                        }}
                                                                        style={{ paddingVertical: 10, paddingHorizontal: 12 }}
                                                                    >
                                                                        <Text style={{ color: '#fff' }}>{opt.label}</Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </View>
                                                        )}
                                </View>

                <AddButton onPress={() => navigation.navigate('Dashboard')}>
                    <AddButtonText>DashBoard</AddButtonText>
                </AddButton>
                {user && (user.role === 'MASTER') ? (
                  <AddButton onPress={() => navigation.navigate('DashboardAdmin')}>
                    <AddButtonText>Admin</AddButtonText>
                  </AddButton>
                ) : null}
                {user && (user.role !== 'MASTER') ? (
                <AddButton onPress={() => navigation.navigate('RegisterMoto')}>
                    <AddButtonText>+ ADD MOTO</AddButtonText>
                </AddButton>
                ) : null}
            </BottomContainer>
        </Container>
    );
};

export default HomeScreen;