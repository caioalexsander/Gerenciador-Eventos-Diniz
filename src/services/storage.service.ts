import { supabase } from './supabase';

export const StorageService = {
  async deletarPDF(pdfUrl: string) {
    try {
      if (!pdfUrl) {
        console.warn('URL do PDF está vazia');
        return;
      }

      console.log('🗑️ Tentando deletar PDF:', pdfUrl);

      // Extrai o filename do URL
      const urlParts = pdfUrl.split('/storage/v1/object/public/contratos/');
      if (urlParts.length < 2) {
        console.warn('Formato de URL não reconhecido');
        return;
      }

      let fileName = urlParts[1].split('?')[0]; // remove query params

      const { error } = await supabase.storage
        .from('contratos')
        .remove([fileName]);

      if (error) {
        console.error('Erro ao deletar do Storage:', error);
        throw error;
      }

      console.log('✅ PDF deletado com sucesso:', fileName);
    } catch (error) {
      console.error('❌ Falha ao deletar PDF antigo:', error);
    }
  }
};