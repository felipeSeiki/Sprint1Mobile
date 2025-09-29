import { ScrollView } from "react-native-gesture-handler";
import { HeaderText, ListHeader, MotoItem, MotoList, MotoText, StatusBadge, StatusText } from "../styles";
import { Moto } from "../../../types/motos";

interface ListMotoProps {
    motos: Moto[];
    handleMotoPress: (moto: any) => void;
}

export const ListMoto: React.FC<ListMotoProps> = ({ motos, handleMotoPress }) => {
    return (
        <MotoList>
            <ListHeader>
                <HeaderText>Modelo</HeaderText>
                <HeaderText>Placa</HeaderText>
                <HeaderText>Status</HeaderText>
            </ListHeader>

            <ScrollView>
                {motos.map(moto => (
                    <MotoItem key={moto.id} onPress={() => handleMotoPress(moto)}>
                        <MotoText>{moto.modelo}</MotoText>
                        <MotoText>{moto.placa}</MotoText>
                        <StatusBadge status={moto.status}>
                            <StatusText>{moto.status}</StatusText>
                        </StatusBadge>
                    </MotoItem>
                ))}
            </ScrollView>
        </MotoList>
    )
};