import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendario } from '../../hooks/useCalendario';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarDataExibicao } from '../../utils/formatadores/display';
import { formatarHoraExibicao } from '../../utils/formatadores/display';

const { width } = Dimensions.get('window');

const CalendarioEventosScreen = () => {
  const {
    loading,
    selectedDate,
    setSelectedDate,
    getEventosByDate,
    getMarkedDates,
    getEventosFuturos,
    eventosPorDia,
  } = useCalendario();

  const { agendarAlarmeEvento } = useNotificacoes();

  const eventosDoDia = getEventosByDate(selectedDate);

  console.log('📆 Data selecionada:', selectedDate);
  console.log('📋 Eventos do dia:', eventosDoDia.length);

  const agendarAlarmes = async () => {
    const eventosFuturos = getEventosFuturos();
    if (eventosFuturos.length === 0) {
      Alert.alert('Aviso', 'Não há eventos futuros.');
      return;
    }
    // ... resto da função
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ paddingHorizontal: 8, paddingTop: 10 }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          enableSwipeMonths={true}
          style={{
            borderRadius: 12,
            height: 400,
            width: width - 16,
          }}
          theme={{
            todayTextColor: '#3b82f6',
            selectedDayBackgroundColor: '#3b82f6',
            arrowColor: '#3b82f6',
            textDayFontSize: 16,
            textMonthFontSize: 18,
          }}
        />
      </View>

      {selectedDate && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Eventos em {formatarDataExibicao(selectedDate)}
          </Text>

          {eventosDoDia.length > 0 ? (
            eventosDoDia.map((evento: EventoCalendario) => (
              <TouchableOpacity
                key={evento.id}
                style={{
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  elevation: 3,
                }}
                onPress={() =>
                  Alert.alert(
                    'Detalhes do Evento',
                    `${evento.tipo_evento}\n${evento.nome_contratante}\n${formatarHoraExibicao(evento.hora_inicio)} - ${formatarHoraExibicao(evento.hora_fim)}`
                  )
                }
              >
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{evento.tipo_evento}</Text>
                <Text style={{ color: '#374151' }}>{evento.nome_contratante}</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  {formatarHoraExibicao(evento.hora_inicio)} - {formatarHoraExibicao(evento.hora_fim)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
              Nenhum evento encontrado nesta data.
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity onPress={agendarAlarmes} style={{
        backgroundColor: '#f59e0b',
        margin: 16,
        padding: 16,
        borderRadius: 12,
      }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Agendar Alarmes (2 dias antes)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarioEventosScreen;