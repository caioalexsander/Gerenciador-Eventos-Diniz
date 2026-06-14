import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity, Modal } from 'react-native';
import { useContrato } from '../../hooks/useContrato';
import NovoContratoHeader from '../../components/contrato/NovoContratoHeader';
import ContratoFormFields from '../../components/forms/contrato/ContratoFormFields';
import ClausulaPagamentoSelector from '../../components/forms/contrato/ClausulaPagamentoSelector';
import CardapioSelector from '../../components/forms/contrato/CardapioSelector';
import { validarCPF } from '../../utils/validacoes/validarCPF';
import { validarCNPJ } from '../../utils/validacoes/validarCNPJ';
import { Loading } from '../../components/ui/Loading';

export default function NovoContratoScreen({ navigation, route }: any) {
  const {
    form,
    setForm,
    isEditing,
    loading,
    tiposEvento,
    clausulasBase,           // ← Adicionado aqui
    itensCardapio,
    cardapioSelecionado,
    toggleItem,
    salvarContrato,
    showDraftModal,
    continuarComDraft,
    iniciarDoZero,
  } = useContrato(route, navigation);

  const isDocumentoValido = form.tipo_documento_contratante === 'cnpj'
    ? validarCNPJ(form.cpf_contratante)
    : validarCPF(form.cpf_contratante);

  // Condição para habilitar o botão Salvar
  const podeSalvar = 
    form.nome_contratante?.trim() !== '' &&
    form.cpf_contratante?.trim() !== '' &&
    isDocumentoValido &&
    // Adicione aqui outras validações que já existiam (ex: data, valor, etc)
    true;   // mantenha true se não houver mais validações

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <NovoContratoHeader isEditing={isEditing} />
      
      <ContratoFormFields 
        form={form} 
        setForm={setForm} 
        tiposEvento={tiposEvento}
      />

      <ClausulaPagamentoSelector 
        form={form} 
        setForm={setForm} 
        clausulasBase={clausulasBase} 
      />

      <CardapioSelector
        itensCardapio={itensCardapio}
        cardapioSelecionado={cardapioSelecionado}
        toggleItem={toggleItem}
      />

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[
          styles.button,
          (!podeSalvar || loading) && styles.buttonDisabled
        ]}
        onPress={salvarContrato}
        disabled={!podeSalvar || loading}
      >
        <Text style={styles.buttonText}>
          {isEditing
            ? "Atualizar Contrato"
            : "Salvar e Gerar Contrato"}
        </Text>
      </TouchableOpacity>

      {/* Modal de Draft */}
      <Modal visible={showDraftModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rascunho encontrado!</Text>
            <Text style={styles.modalText}>
              Você tem um contrato em andamento. Deseja continuar?
            </Text>
            
            <TouchableOpacity style={styles.buttonContinue} onPress={continuarComDraft}>
              <Text style={styles.buttonText}>Continuar com os dados salvos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonReset} onPress={iniciarDoZero}>
              <Text style={styles.buttonTextReset}>Começar do zero</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Loading
        visible={loading}
        message={
          isEditing
            ? "Atualizando contrato..."
            : "Gerando contrato..."
        }
      />
    </ScrollView>
    <Loading
      visible={loading}
      message={
        isEditing
          ? 'Atualizando contrato...'
          : 'Gerando contrato e PDF...'
      }
    />
  </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f9f9f9' 
  },
  contentContainer: { 
    padding: 16,           // espaçamento lateral e superior
    paddingBottom: 80,     // ← ESPAÇO EXTRA NO FINAL (aqui você controla)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
    lineHeight: 22,
  },
  buttonContinue: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonReset: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextReset: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
    buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});