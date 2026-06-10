import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useContrato } from '../../hooks/useContrato';
import NovoContratoHeader from '../../components/contrato/NovoContratoHeader';
import ContratoFormFields from '../../components/forms/contrato/ContratoFormFields';
import ClausulaPagamentoSelector from '../../components/forms/contrato/ClausulaPagamentoSelector';
import CardapioSelector from '../../components/forms/contrato/CardapioSelector';
import { validarCPF } from '../../utils/validacoes/validarCPF';
import { validarCNPJ } from '../../utils/validacoes/validarCNPJ';

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
        style={[styles.button, !podeSalvar && styles.buttonDisabled]}
        onPress={salvarContrato}
        disabled={!podeSalvar}
      >
        <Text style={styles.buttonText}>
          {loading 
            ? (isEditing ? "Atualizando..." : "Salvando...") 
            : (isEditing ? "Atualizar Contrato" : "Salvar e Gerar Contrato")
          }
        </Text>
      </TouchableOpacity>
    </ScrollView>
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