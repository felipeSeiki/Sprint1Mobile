import { ScrollView } from "react-native-gesture-handler";
import { HeaderText, ListHeader, MotoItem, MotoList, MotoText } from "../styles";
import { Patio } from "../../../types/patios";
import { List } from "react-native-paper";
import { ModalDeletePatio } from "./ModalDeletePatio";

interface ListProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    patios: Patio[];
    selectedPatio: number;
    handlePatioPress: (patio: any) => void;
    deletePatio: (patioId: number) => void;
}

export const ListPatio: React.FC<ListProps> = ({ showModal, setShowModal, patios, selectedPatio, handlePatioPress, deletePatio }) => {
    return (
        <MotoList>
            <ListHeader>
                <HeaderText>Patio</HeaderText>
                <HeaderText>Local</HeaderText>
                <HeaderText>Ações</HeaderText>
            </ListHeader>

            <ScrollView>
                {patios.map(patio => (
                    <MotoItem key={patio.id}>
                        <MotoText>{patio.id}</MotoText>
                        <MotoText>{patio.endereco.cidade} - {patio.endereco.estado}</MotoText>
                        <List.Accordion
                            key={patio.id}
                            title={`${patio.endereco.cidade} - ${patio.endereco.estado}`}
                            description={`ID: ${patio.id}`}
                        >
                            <List.Item
                                title="Edit. Usuários"
                                onPress={() => handlePatioPress(patio)}
                                left={() => <List.Icon icon="eye" />}
                            />
                            <List.Item
                                title="Edit. Pátio"
                                onPress={() => deletePatio(patio.id)}
                                left={() => <List.Icon icon="pencil" />}
                            />
                            <List.Item
                                title="Excluir"
                                onPress={() => handlePatioPress(patio)}
                                left={() => <List.Icon icon="delete" />}
                            />
                        </List.Accordion>
                    </MotoItem>
                ))}
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