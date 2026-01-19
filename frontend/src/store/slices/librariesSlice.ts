import { createSlice } from '@reduxjs/toolkit';

interface Library {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface LibrariesState {
  libraries: Library[];
  loading: boolean;
  error: string | null;
}

const initialState: LibrariesState = {
  libraries: [
    { id: 1, name: 'Центральная библиотека', address: 'ул. Ленина, 10', phone: '+7 (495) 123-45-67', email: 'central@library.ru' },
    { id: 2, name: 'Городская библиотека', address: 'пр. Победы, 25', phone: '+7 (495) 234-56-78', email: 'city@library.ru' },
    { id: 3, name: 'Научная библиотека', address: 'ул. Академическая, 5', phone: '+7 (495) 345-67-89', email: 'science@library.ru' },
  ],
  loading: false,
  error: null,
};

const librariesSlice = createSlice({
  name: 'libraries',
  initialState,
  reducers: {},
});

export default librariesSlice.reducer;
