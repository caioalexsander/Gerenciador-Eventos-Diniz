import React from 'react';
import { View, Alert, Linking, Button as RNButton } from 'react-native';
import { ContratosService } from '../../services/contratos.service';

interface AssinaturaDigitalButtonProps {
  contratoId: string;
  statusAssinatura?: string;
  onAssinaturaConcluida?: () => void;
}

export const AssinaturaDigitalButton: React.FC<AssinaturaDigitalButtonProps> = ({
  contratoId,
  statusAssinatura,
  onAssinaturaConcluida,
}) => {
  const handleGerarLinkAssinatura = async () => {
    if (statusAssinatura === 'assinado') {
      Alert.alert('Aviso', 'Este contrato já foi assinado.');
      return;
    }

    try {
      const response = await ContratosService.gerarLinkAssinaturaDigital(contratoId);

      if (response.success && response.signingUrl) {
        Alert.alert(
          'Link Gerado com Sucesso',
          'O link de assinatura digital foi gerado.\n\nDeseja abrir agora no navegador?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Abrir',
              onPress: () => Linking.openURL(response.signingUrl),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível gerar o link de assinatura digital.'
      );
    }
  };

  const isAssinado = statusAssinatura === 'assinado';

  return (
    <View style={{ marginVertical: 12, paddingHorizontal: 8 }}>
      <RNButton
        title={isAssinado ? '✅ Contrato já Assinado' : '✍️ Fazer Assinatura Digital'}
        onPress={handleGerarLinkAssinatura}
        color={isAssinado ? '#28a745' : '#007AFF'}
        disabled={isAssinado}
      />
    </View>
  );
};