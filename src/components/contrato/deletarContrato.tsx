import { Alert } from 'react-native';
import { StorageService } from '../../services/storage.service';
import { ContratosService } from '../../services/contratos.service';

type Props = {
  id: number;
  pdfUrl: string;
  onSuccess?: () => void;
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

export const confirmarExclusao = ({
  id,
  pdfUrl,
  onSuccess,
}: Props) => {

  Alert.alert(
    'Excluir contrato',
    'Deseja realmente excluir este contrato?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },

      {
        text: 'Excluir',
        style: 'destructive',

        onPress: async () => {

          try {

            // PDF
            if (pdfUrl) {
              await StorageService.deletarPDF(pdfUrl);
            }

            // Banco
            await ContratosService.deletarinfodb(id);

            Alert.alert(
              'Sucesso',
              'Contrato deletado.'
            );

            onSuccess?.();

          } catch (error) {

            console.error(error);

            Alert.alert(
              'Erro',
              'Não foi possível deletar.'
            );
          }
        },
      },
    ]
  );
};