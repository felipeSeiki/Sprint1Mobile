import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Animated, PanResponder, Dimensions, Modal, FlatList, StyleSheet } from 'react-native';
import { HomeScreenProps } from './type/type';
import { AddButton, AddButtonText, AnimatedCardContainer, BikeIcon, BikeSpot, BottomContainer, Card, CardContainer, Column, Container, EmptySpace, Row, styles as homeStyles, FilterDropdown } from './styles';
import { useAuth } from '../../contexts/AuthContext';
import { useHome } from './hook/useHome';
// Render agora usa layout por pátio em vez de parkingSpots fixo
import { ModalMoto } from '../DashBoard/components/ModalMoto';

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
        selectedMoto,
        showModal,
        setShowModal,
        loading,
        error,
        reloadData,
    } = useHome();

    const { user } = useAuth();
    const [openPatioSelect, setOpenPatioSelect] = useState(false);
    
    // Estados para pan e zoom
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);
    const initialDistance = useRef(0);
    
    // Refs para armazenar os valores atuais de pan e scale
    const currentPanX = useRef(0);
    const currentPanY = useRef(0);
    const currentScale = useRef(1);
    
    // Adicionar listeners para atualizar os valores atuais
    React.useEffect(() => {
        const panXListener = pan.x.addListener(({ value }) => {
            currentPanX.current = value;
        });
        const panYListener = pan.y.addListener(({ value }) => {
            currentPanY.current = value;
        });
        const scaleListener = scale.addListener(({ value }) => {
            currentScale.current = value;
        });
        
        return () => {
            pan.x.removeListener(panXListener);
            pan.y.removeListener(panYListener);
            scale.removeListener(scaleListener);
        };
    }, []);
    
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    
    // PanResponder para arrastar e dar zoom
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        
        onPanResponderGrant: (evt) => {
          // Salva a posição atual do pan
          pan.setOffset({
            x: currentPanX.current,
            y: currentPanY.current,
          });
          
          // Detecta zoom inicial com dois dedos
          if (evt.nativeEvent.touches.length === 2) {
            const touch1 = evt.nativeEvent.touches[0];
            const touch2 = evt.nativeEvent.touches[1];
            initialDistance.current = Math.sqrt(
              Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2)
            );
            lastScale.current = currentScale.current;
          }
        },
        
        onPanResponderMove: (evt, gestureState) => {
          // Detecta pinch (zoom) quando há dois toques
          if (evt.nativeEvent.touches.length === 2 && initialDistance.current > 0) {
            const touch1 = evt.nativeEvent.touches[0];
            const touch2 = evt.nativeEvent.touches[1];
            
            const currentDistance = Math.sqrt(
              Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2)
            );
            
            const ratio = currentDistance / initialDistance.current;
            const newScale = Math.max(1, Math.min(3, lastScale.current * ratio));
            scale.setValue(newScale);
          } else if (evt.nativeEvent.touches.length === 1) {
            // Arrasta normalmente com um dedo
            pan.setValue({ 
              x: gestureState.dx, 
              y: gestureState.dy 
            });
          }
        },
        
        onPanResponderRelease: () => {
          pan.flattenOffset();
          const currentScaleValue = currentScale.current;
          lastScale.current = currentScaleValue;
          initialDistance.current = 0;
          
          // Limita o movimento para não sair muito da tela quando há zoom
          if (currentScaleValue > 1) {
            const maxX = (screenWidth * (currentScaleValue - 1)) / 2;
            const maxY = (screenHeight * (currentScaleValue - 1)) / 2;
            
            Animated.parallel([
              Animated.spring(pan.x, {
                toValue: Math.max(-maxX, Math.min(maxX, currentPanX.current)),
                useNativeDriver: false,
                tension: 50,
                friction: 7,
              }),
              Animated.spring(pan.y, {
                toValue: Math.max(-maxY, Math.min(maxY, currentPanY.current)),
                useNativeDriver: false,
                tension: 50,
                friction: 7,
              }),
            ]).start();
          }
        },
      })
    ).current;
    
    // Handler para resetar zoom
    const resetZoom = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }),
      ]).start(() => {
        lastScale.current = 1;
        initialDistance.current = 0;
      });
    };

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


    // Exibe loading enquanto carrega os dados
    if (loading) {
        return (
            <Container>
                <CardContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#00CF3A" />
                    <Text style={{ color: '#fff', marginTop: 16 }}>Carregando...</Text>
                </CardContainer>
            </Container>
        );
    }

    // Exibe erro se houver problema ao carregar
    if (error) {
        return (
            <Container>
                <CardContainer style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: '#FF0000', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>
                        {error}
                    </Text>
                    <TouchableOpacity 
                        onPress={reloadData}
                        style={{
                            backgroundColor: '#00CF3A',
                            padding: 12,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </CardContainer>
            </Container>
        );
    }

    return (
        <Container>
            <CardContainer>
                <View style={{ flex: 1, width: '100%', position: 'relative' }}>
                    <Animated.View
                        style={{
                            transform: [
                                { translateX: pan.x },
                                { translateY: pan.y },
                                { scale: scale },
                            ],
                        }}
                        {...panResponder.panHandlers}
                    >
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
                    </Animated.View>
                    
                    {/* Botão para resetar zoom */}
                    <TouchableOpacity
                        onPress={resetZoom}
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            backgroundColor: '#00CF3A',
                            borderRadius: 25,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 5,
                            zIndex: 1000,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>⌂</Text>
                    </TouchableOpacity>
                </View>
            </CardContainer>

                        <BottomContainer>
                                {/* Ocupação */}
                                <View style={{ marginRight: 12 }}>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{occupancy}/{layoutCapacity} vagas</Text>
                                </View>
                                
                                {/* Select de Pátio - Modal para mobile */}
                                <View style={{ flex: 1, maxWidth: 180, marginRight: 8 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setOpenPatioSelect(true)}
                                        style={{
                                            backgroundColor: '#2A2A2A',
                                            borderRadius: 8,
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderWidth: 1,
                                            borderColor: '#00CF3A',
                                            minHeight: 40,
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text 
                                            style={{ 
                                                color: '#fff', 
                                                fontSize: 11,
                                                flex: 1,
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {selectedPatioId ? (patioOptions.find(p => p.id === selectedPatioId)?.label ?? 'Selecione') : 'Selecione'}
                                        </Text>
                                        <Text style={{ color: '#00CF3A', marginLeft: 4, fontSize: 12 }}>▼</Text>
                                    </TouchableOpacity>
                                    
                                    {/* Modal para seleção de pátio */}
                                    <Modal
                                        visible={openPatioSelect}
                                        transparent={true}
                                        animationType="slide"
                                        onRequestClose={() => setOpenPatioSelect(false)}
                                    >
                                        <View style={patioModalStyles.modalOverlay}>
                                            <TouchableOpacity
                                                style={{ flex: 1 }}
                                                activeOpacity={1}
                                                onPress={() => setOpenPatioSelect(false)}
                                            />
                                            <View style={patioModalStyles.modalContent}>
                                                <View style={patioModalStyles.modalHeader}>
                                                    <Text style={patioModalStyles.modalTitle}>Selecione um Pátio</Text>
                                                    <TouchableOpacity
                                                        onPress={() => setOpenPatioSelect(false)}
                                                        style={patioModalStyles.closeButton}
                                                    >
                                                        <Text style={patioModalStyles.closeButtonText}>✕</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                
                                                <FlatList
                                                    data={patioOptions}
                                                    keyExtractor={(item) => String(item.id)}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            style={[
                                                                patioModalStyles.patioItem,
                                                                selectedPatioId === item.id && patioModalStyles.patioItemSelected
                                                            ]}
                                                            onPress={() => {
                                                                setSelectedPatioId(item.id);
                                                                setOpenPatioSelect(false);
                                                            }}
                                                        >
                                                            <Text style={[
                                                                patioModalStyles.patioItemText,
                                                                selectedPatioId === item.id && patioModalStyles.patioItemTextSelected
                                                            ]}>
                                                                {item.label}
                                                            </Text>
                                                            {selectedPatioId === item.id && (
                                                                <Text style={patioModalStyles.checkIcon}>✓</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    )}
                                                    ItemSeparatorComponent={() => <View style={patioModalStyles.separator} />}
                                                    showsVerticalScrollIndicator={false}
                                                />
                                            </View>
                                        </View>
                                    </Modal>
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

            {/* Modal de detalhes da moto (mesmo do Dashboard) */}
            <ModalMoto
              showModal={showModal}
              setShowModal={setShowModal}
              selectedMoto={selectedMoto}
            />
        </Container>
    );
};

const patioModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#2A2A2A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 2,
        borderTopColor: '#00CF3A',
        maxHeight: '70%',
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3A',
    },
    modalTitle: {
        color: '#00CF3A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#3A3A3A',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    patioItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#1F1F1F',
        marginHorizontal: 16,
        marginVertical: 3,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#3A3A3A',
        minHeight: 50,
    },
    patioItemSelected: {
        backgroundColor: '#00CF3A20',
        borderColor: '#00CF3A',
    },
    patioItemText: {
        color: '#fff',
        fontSize: 15,
        flex: 1,
        marginRight: 8,
        lineHeight: 20,
    },
    patioItemTextSelected: {
        color: '#00CF3A',
        fontWeight: 'bold',
    },
    checkIcon: {
        color: '#00CF3A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#3A3A3A',
    },
});

export default HomeScreen;