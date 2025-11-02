import { RefreshControl, ScrollView, View } from "react-native";
import { HeaderText, ListHeader, MotoList, MotoText } from "../styles";
import { Patio } from "../../../types/patios";
import { List } from "react-native-paper";
import { ModalDeletePatio } from "./ModalDeletePatio";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";

interface ListProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    patios: Patio[];
    selectedPatio: number;
    handlePatioPress: (patio: any) => void;
    deletePatio: (patioId: number) => void;
    refreshing?: boolean;
    onRefresh?: () => void;
}

export const ListPatio: React.FC<ListProps> = ({ showModal, setShowModal, patios, selectedPatio, handlePatioPress, deletePatio, refreshing = false, onRefresh }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleEditUsers = (patioId: number) => {
        console.log('Navegando para EditUsers com patioId:', patioId);
        try {
            navigation.navigate('EditUsers', { patioId });
        } catch (error) {
            console.error('Erro ao navegar para EditUsers:', error);
        }
    };

    const handleEditPatio = (patio: Patio) => {
        console.log('Navegando para RegisterPatio com patio:', patio);
        try {
            navigation.navigate('RegisterPatio', { patio });
        } catch (error) {
            console.error('Erro ao navegar para RegisterPatio:', error);
        }
    };

    return (
        <MotoList>
            <ListHeader>
                <HeaderText style={{ textAlign: 'center', fontSize: 18 }}>Pátios</HeaderText>
            </ListHeader>

            <ScrollView refreshControl={
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#00CF3A" />
            }>
                {patios.length === 0 ? (
                    <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
                        <MotoText>Nenhum pátio encontrado</MotoText>
                        {onRefresh && (
                            <View style={{ marginTop: 12 }}>
                                <List.Icon icon="refresh" color="#00CF3A" />
                            </View>
                        )}
                    </View>
                ) : (
                patios.map((patio, idx) => (
                    <View key={patio.id} style={{ backgroundColor: idx % 2 === 0 ? '#262626' : '#2A2A2A' }}>
                        <List.Accordion
                            title={`${patio.endereco.logradouro}, ${patio.endereco.numero} - ${patio.endereco.cidade}/${patio.endereco.estado}`}
                            description={`ID: ${patio.id} | ${patio.endereco.bairro} | CEP: ${patio.endereco.cep}`}
                            titleStyle={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}
                            descriptionStyle={{ color: '#CCCCCC', fontSize: 12 }}
                            style={{ backgroundColor: idx % 2 === 0 ? '#262626' : '#2A2A2A', borderBottomWidth: 1, borderBottomColor: '#00CF3A' }}
                            theme={{ colors: { primary: '#00CF3A' } }}
                        >
                            <List.Item
                                title="Editar Usuários"
                                description="Gerenciar usuários deste pátio"
                                onPress={() => handleEditUsers(patio.id)}
                                left={() => <List.Icon icon="account-edit" color="#00CF3A" />}
                                titleStyle={{ color: '#FFFFFF' }}
                                descriptionStyle={{ color: '#AAAAAA', fontSize: 11 }}
                                style={{ backgroundColor: '#1E1E1E', paddingLeft: 16 }}
                            />
                            <List.Item
                                title="Editar Pátio"
                                description="Atualizar dados do pátio"
                                onPress={() => handleEditPatio(patio)}
                                left={() => <List.Icon icon="pencil" color="#00CF3A" />}
                                titleStyle={{ color: '#FFFFFF' }}
                                descriptionStyle={{ color: '#AAAAAA', fontSize: 11 }}
                                style={{ backgroundColor: '#1E1E1E', paddingLeft: 16 }}
                            />
                            <List.Item
                                title="Excluir Pátio"
                                description="Remover este pátio permanentemente"
                                onPress={() => handlePatioPress(patio)}
                                left={() => <List.Icon icon="delete" color="#FF4D4F" />}
                                titleStyle={{ color: '#FF4D4F' }}
                                descriptionStyle={{ color: '#AAAAAA', fontSize: 11 }}
                                style={{ backgroundColor: '#1E1E1E', paddingLeft: 16 }}
                            />
                        </List.Accordion>
                    </View>
                )))}
            </ScrollView>

            <ModalDeletePatio
                showModal={showModal}
                setShowModal={setShowModal}
                selectedPatio={selectedPatio}
                deletePatio={deletePatio}
            />
        </MotoList>
    )
};