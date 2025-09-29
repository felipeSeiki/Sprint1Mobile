import { Modal } from "react-native";
import { CloseButton, CloseButtonText, InfoLabel, InfoRow, InfoText, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalTitle, StatusText } from "../styles";

interface ModalMotosProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    selectedMoto: {
        modelo: string;
        placa: string;
        cod_tag: string;
        status: string;
    } | null;
}

export const ModalMotos: React.FC<ModalMotosProps> = ({ showModal, setShowModal, selectedMoto }) => {
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
                        <ModalTitle>Informações da Moto</ModalTitle>
                        <CloseButton onPress={() => setShowModal(false)}>
                            <CloseButtonText>✕</CloseButtonText>
                        </CloseButton>
                    </ModalHeader>

                    {selectedMoto && (
                        <ModalBody>
                            <InfoRow>
                                <InfoLabel>Modelo:</InfoLabel>
                                <InfoText>{selectedMoto.modelo}</InfoText>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Placa:</InfoLabel>
                                <InfoText>{selectedMoto.placa}</InfoText>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Tag:</InfoLabel>
                                <InfoText>{selectedMoto.cod_tag}</InfoText>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Status:</InfoLabel>
                                <StatusText status={selectedMoto.status}>{selectedMoto.status}</StatusText>
                            </InfoRow>
                        </ModalBody>
                    )}
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}