import { RefreshControl, ScrollView, View } from "react-native";
import { HeaderText, ListHeader, MotoItem, MotoList, MotoText } from "../styles";
import { Patio } from "../../../types/patios";
import { IconButton } from "react-native-paper";
import { ModalDeletePatio } from "./ModalDeletePatio";

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
    return (
        <MotoList>
            <ListHeader>
                <HeaderText>Patio</HeaderText>
                <HeaderText>Local</HeaderText>
                <HeaderText>Ações</HeaderText>
            </ListHeader>

                        <ScrollView refreshControl={
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#00CF3A" />
            }>
                                {patios.length === 0 ? (
                                    <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
                                        <MotoText>Nenhum pátio encontrado</MotoText>
                                        {onRefresh && (
                                            <View style={{ marginTop: 12 }}>
                                                <IconButton icon="refresh" mode="contained-tonal" onPress={onRefresh} iconColor="#00CF3A" />
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                patios.map((patio, idx) => (
                                        <MotoItem key={patio.id} style={{ backgroundColor: idx % 2 === 0 ? '#262626' : '#2A2A2A' }}>
                        <MotoText>{patio.id}</MotoText>
                        <MotoText>{patio.endereco.cidade} - {patio.endereco.estado}</MotoText>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <IconButton icon="account-edit" size={20} iconColor="#FFFFFF" onPress={() => handlePatioPress(patio)} />
                                                    <IconButton icon="pencil" size={20} iconColor="#FFFFFF" onPress={() => handlePatioPress(patio)} />
                                                    <IconButton icon="delete" size={20} iconColor="#FF4D4F" onPress={() => handlePatioPress(patio)} />
                        </View>
                    </MotoItem>
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