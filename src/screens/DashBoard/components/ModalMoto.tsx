import { Modal } from "react-native"
import { CloseButton, CloseText, DetailLabel, DetailRow, DetailValue, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalTitle, StatusValue } from "../styles";

interface ModalMotoProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    selectedMoto: {
        modelo: string;
        placa: string;
        cod_tag: string;
        status: string;
    } | null;
}
    
export const ModalMoto: React.FC<ModalMotoProps> = ({ showModal, setShowModal, selectedMoto }) => {
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
                        <ModalTitle>Detalhes da Moto</ModalTitle>
                        <CloseButton onPress={() => setShowModal(false)}>
                            <CloseText>✕</CloseText>
                        </CloseButton>
                    </ModalHeader>

                    {selectedMoto && (
                        <ModalBody>
                            <DetailRow>
                                <DetailLabel>Modelo:</DetailLabel>
                                <DetailValue>{selectedMoto.modelo}</DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Placa:</DetailLabel>
                                <DetailValue>{selectedMoto.placa}</DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Tag:</DetailLabel>
                                <DetailValue>{selectedMoto.cod_tag}</DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Status:</DetailLabel>
                                <StatusValue status={selectedMoto.status}>
                                    {selectedMoto.status}
                                </StatusValue>
                            </DetailRow>
                        </ModalBody>
                    )}
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )
}