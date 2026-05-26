import { supabase } from './supabase';
import  api  from './api';

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
  },

async uploadFile(file: any, fileName: string): Promise<string> {
  try {
    // ✅ CORREÇÃO: PDFs na RAIZ do bucket (sem pasta "contratos/")
    let finalFileName = fileName;

    // Remove qualquer prefixo "contratos/" se existir
    if (fileName.startsWith('contratos/')) {
      finalFileName = fileName.replace('contratos/', '');
    }

    console.log('📤 Upload na RAIZ do bucket:', finalFileName);

    const fileResponse = await fetch(file.uri);
    const arrayBuffer = await fileResponse.arrayBuffer();

    const { error } = await supabase.storage
      .from('contratos')
      .upload(finalFileName, arrayBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('contratos')
      .getPublicUrl(finalFileName);

    console.log('✅ Upload OK - URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (error: any) {
    console.error('❌ ERRO NO UPLOADFILE:', error);
    throw error;
  }
}

};