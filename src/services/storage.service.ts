import { supabase } from './supabase';

export class StorageService {

  static async deletarPDF(pdfUrl: string) {
    try {
      if (!pdfUrl) return;

      // Extrai o path do arquivo (ex: "contratos/contrato-123.pdf")
      const urlParts = pdfUrl.split('/storage/v1/object/public/');
      if (urlParts.length < 2) return;

      const fullPath = urlParts[1];
      const path = fullPath.split('?')[0]; // remove query params

      const { error } = await supabase.storage
        .from('contratos')           // ← Nome do seu bucket
        .remove([path]);

      if (error) throw error;
      
      console.log('PDF deletado com sucesso:', path);
    } catch (error) {
      console.error('Erro ao deletar PDF do Storage:', error);
      // Não quebrar o fluxo se falhar na deleção
    }
  }
}