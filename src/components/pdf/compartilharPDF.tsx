import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import { downloadPDF } from '../pdf/downloadPDF';

export const compartilharPDF = async (url: string) => {
  try {
    const fileUri = await downloadPDF(url);

    const available = await Sharing.isAvailableAsync();

    if (fileUri && available) {
      await Sharing.shareAsync(fileUri);
      return;
    }

    Alert.alert('PDF', url);

  } catch (e) {
    console.error(e);

    Alert.alert(
      'Erro',
      'Não foi possível compartilhar o PDF'
    );
  }
};