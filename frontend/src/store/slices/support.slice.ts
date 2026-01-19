import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  userId: number;
  text: string;
  timestamp: string;
}

interface SupportState {
  messages: Message[];
  isConnected: boolean;
}

const initialState: SupportState = {
  messages: [
    { userId: 1, text: 'Здравствуйте! Чем могу помочь?', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { userId: 2, text: 'У меня проблема с бронированием книги "Мастер и Маргарита"', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { userId: 1, text: 'Какая именно проблема? Книга не доступна для бронирования?', timestamp: new Date(Date.now() - 1200000).toISOString() },
  ],
  isConnected: true,
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    connectToChat: (state) => {
      state.isConnected = true;
    },
    disconnectFromChat: (state) => {
      state.isConnected = false;
    },
    sendMessage: (state, action: PayloadAction<{ text: string; userId: number }>) => {
      state.messages.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { connectToChat, disconnectFromChat, sendMessage, receiveMessage } = supportSlice.actions;
export default supportSlice.reducer;
