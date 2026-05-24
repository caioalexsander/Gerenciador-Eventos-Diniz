import { Alert, Platform } from 'react-native';

import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';

import { downloadPDF } from './downloadPDF';

export const abrirPDF = async (url: string) => {
  try {
    if (!url) {
      Alert.alert('Erro', 'PDF não encontrado.');
      return;
    }

    const fileUri = await downloadPDF(url);

    if (!fileUri) {
      Alert.alert('Erro', 'Arquivo inválido.');
      return;
    }

    if (Platform.OS === 'android') {

      const contentUri =
        await FileSystem.getContentUriAsync(fileUri);

      await IntentLauncher.startActivityAsync(
        'android.intent.action.VIEW',
        {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        }
      );
    }

  } catch (error) {
    console.error(error);

    Alert.alert(
      'Erro',
      'Não foi possível abrir o PDF.'
    );
  }
};