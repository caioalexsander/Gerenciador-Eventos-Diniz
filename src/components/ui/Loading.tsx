import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingProps {
  visible?: boolean;
  message?: string;
  size?: 'small' | 'large';
  transparent?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message = 'Carregando...',
  size = 'large',
  transparent = true,
}) => {
  if (!visible) return null;

  return (
    <View style={[
      styles.container,
      transparent && styles.transparent
    ]}>
      <View style={styles.loaderBox}>
        <ActivityIndicator 
          size={size} 
          color="#0066CC"   // Cor principal (azul) - podemos mudar depois
        />
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});