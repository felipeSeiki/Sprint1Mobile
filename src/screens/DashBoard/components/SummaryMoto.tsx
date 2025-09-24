import { Moto } from "../../../types/motos";
import { SummaryCard, SummaryContainer, SummaryLabel, SummaryNumber } from "../styles"

interface SummaryMotoProps {
    motos: Moto[];
}

export const SummaryMoto: React.FC<SummaryMotoProps> = ({ motos }) => {
    return (
        <SummaryContainer>
            <SummaryCard>
                <SummaryNumber>{motos.length}</SummaryNumber>
                <SummaryLabel>Total de Motos</SummaryLabel>
            </SummaryCard>

            <SummaryCard>
                <SummaryNumber>{motos.filter(m => m.status === 'Disponível').length}</SummaryNumber>
                <SummaryLabel>Disponíveis</SummaryLabel>
            </SummaryCard>

            <SummaryCard>
                <SummaryNumber>{motos.filter(m => m.status === 'Manutenção').length}</SummaryNumber>
                <SummaryLabel>Em Manutenção</SummaryLabel>
            </SummaryCard>
        </SummaryContainer>
    )
}