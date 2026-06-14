import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormContrato } from '../../types/contrato.types';

const DRAFT_KEY = '@GerenciadorEventos:contratoDraft';

export const DraftContrato = {
  async salvarDraft(form: FormContrato, cardapioSelecionado: any[]) {
    try {
      const draft = {
        form,
        cardapioSelecionado,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error('Erro ao salvar draft:', e);
    }
  },

  async carregarDraft(): Promise<{ form: FormContrato; cardapioSelecionado: any[] } | null> {
    try {
      const json = await AsyncStorage.getItem(DRAFT_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.error('Erro ao carregar draft:', e);
      return null;
    }
  },

  async limparDraft() {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.error('Erro ao limpar draft:', e);
    }
  },
};