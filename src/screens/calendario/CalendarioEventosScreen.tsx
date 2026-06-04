import React from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useCalendario } from '../../hooks/useCalendario';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarDataExibicao } from '../../utils/formatadores/display';
import { formatarHoraExibicao } from '../../utils/formatadores/display';

const { width } = Dimensions.get('window');

const CalendarioEventosScreen = () => {
  const {
    selectedDate,
    setSelectedDate,
    getEventosByDate,
    getMarkedDates,
  } = useCalendario();

  const eventosDoDia = getEventosByDate(selectedDate);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Calendário estilo Agenda */}
      <CalendarList
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        calendarWidth={width}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        dayComponent={({ date, state }: any) => {
          const eventos = getEventosByDate(date?.dateString || '');
          const isSelected = selectedDate === date?.dateString;
          const isToday = state === 'today';

          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(date?.dateString || '')}
              style={{
                //flex: 1,
                minHeight: 100,
                padding: 6,
                borderRightWidth: 0.5,
                borderBottomWidth: 0.5,
                borderColor: '#e5e7eb',
                backgroundColor: 'white',
              }}
            >
              {/* Número do dia */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? '#1e40af' : isToday ? '#bfdbfe' : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: isSelected ? '#fff' : isToday ? '#1e40af' : '#111827',
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  {date?.day}
                </Text>
              </View>

              {/* Mini cards de eventos */}
              <View style={{ marginTop: 6 }}>
                {eventos.slice(0, 2).map((evento: EventoCalendario) => (
                  <View
                    key={evento.id}
                    style={{
                      backgroundColor: '#dbeafe',
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 11.5,
                        color: '#1e40af',
                        fontWeight: '500',
                      }}
                    >
                      {evento.tipo_evento}
                    </Text>
                  </View>
                ))}
                {eventos.length > 2 && (
                  <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                    +{eventos.length - 2} mais
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textMonthFontSize: 32,
          textMonthFontWeight: '700',
          monthTextColor: '#111827',
          textDayHeaderFontSize: 15,
          textSectionTitleColor: '#6b7280',
          todayTextColor: '#1e40af',
        }}
      />

      {/* Lista detalhada do dia selecionado */}
      {selectedDate && (
        <View style={{ 
          backgroundColor: 'white', 
          flex: 1, 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}>
          <View style={{ padding: 20 }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: 16 
            }}>
              {formatarDataExibicao(selectedDate)}
            </Text>

            {eventosDoDia.length > 0 ? (
              eventosDoDia.map((evento: EventoCalendario) => (
                <TouchableOpacity
                  key={evento.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: 18,
                    borderRadius: 14,
                    marginBottom: 12,
                    borderLeftWidth: 5,
                    borderLeftColor: '#3b82f6',
                  }}
                  onPress={() =>
                    Alert.alert(
                      evento.tipo_evento,
                      `${evento.nome_contratante}\n\n${formatarHoraExibicao(evento.hora_inicio)} - ${formatarHoraExibicao(evento.hora_fim)}`
                    )
                  }
                >
                  <Text style={{ fontSize: 17, fontWeight: '600', color: '#1f2937' }}>
                    {evento.tipo_evento}
                  </Text>
                  <Text style={{ color: '#374151', marginTop: 4 }}>
                    {evento.nome_contratante}
                  </Text>
                  <Text style={{ color: '#64748b', marginTop: 8, fontSize: 16 }}>
                    {formatarHoraExibicao(evento.hora_inicio)} — {formatarHoraExibicao(evento.hora_fim)}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: '#9ca3af', marginTop: 40 }}>
                Nenhum evento neste dia
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default CalendarioEventosScreen;