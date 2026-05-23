import * as Sharing from 'expo-sharing';
import {  Alert } from 'react-native';
import { downloadPDF } from '../pdf/downloadPDF';

export const compartilharPDF = async (url: string) => {
    try {
      const fileUri = await downloadPDF(url);
      
      if (fileUri && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Link do PDF', url);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Link do PDF', url);
    }
  };