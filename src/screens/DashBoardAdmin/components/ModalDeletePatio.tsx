import { Modal } from "react-native"
import { CloseButton, CloseText, DetailLabel, DetailRow, DetailValue, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalTitle, StatusValue } from "../styles";
import { Button } from "react-native-elements";

interface ModalPatioProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    selectedPatio: number;
    deletePatio: (patioId: number) => void;
}

export const ModalDeletePatio: React.FC<ModalPatioProps> = ({ showModal, setShowModal, selectedPatio, deletePatio }) => {
    return (
        <Modal
            visible={showModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
        >
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Deseja deletar o patio?</ModalTitle>
                        <CloseButton onPress={() => setShowModal(false)}>
                            <CloseText>✕</CloseText>
                        </CloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Button
                            title="Confirmar"
                            onPress={() => {
                                deletePatio(selectedPatio);
                                setShowModal(false);
                            }}
                        />
                        <Button
                            title="Cancelar"
                            onPress={() => setShowModal(false)}
                        />
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )
}