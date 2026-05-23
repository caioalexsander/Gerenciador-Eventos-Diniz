import * as Sharing from 'expo-sharing';
import {  Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export const downloadPDF = async (url: string): Promise<string | null> => {
    try {
      const fileName = `contrato-${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      const download = await FileSystem.downloadAsync(url, fileUri);
      return download.uri;
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      return null;
    }
  };