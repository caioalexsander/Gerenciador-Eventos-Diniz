import { StorageService } from '../../services/storage.service';
import { ContratosService } from '../../services/contratos.service';

type Props = {
  id: number;
  pdfUrl: string;
};

export const deletarContrato = async ({
  id,
  pdfUrl,
}: Props) => {

  try {

    // 1. Deleta PDF do storage
    if (pdfUrl) {
      await StorageService.deletarPDF(pdfUrl);
    }

    // 2. Deleta registro do banco
    await ContratosService.deletarinfodb(id);

    return true;

  } catch (error) {

    console.error(
      'Erro ao deletar contrato completo:',
      error
    );

    throw error;
  }
  
};

