export const formatarData = (texto: string, setForm: React.Dispatch<React.SetStateAction<any>>) => {
  let numeros = texto.replace(/\D/g, '').slice(0, 8);

  if (numeros.length > 4) {
    numeros = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  } else if (numeros.length > 2) {
    numeros = numeros.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  }

  setForm((prev: any) => ({ ...prev, data_evento: numeros }));
};
