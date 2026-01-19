import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { connectToChat, sendMessage } from '../store/slices/support.slice';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';

const SupportPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages, isConnected } = useSelector((state: RootState) => state.support);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Подключаемся к WebSocket
    dispatch(connectToChat());
  }, [dispatch]);

  const handleSend = () => {
    if (message.trim()) {
      dispatch(sendMessage({
        text: message,
        userId: user?.email === 'admin@test.com' ? 1 : 2
      }));
      setMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Чат поддержки
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2, height: 400, overflow: 'auto' }}>
        <Typography color={isConnected ? 'success.main' : 'error.main'}>
          Статус: {isConnected ? 'Подключено ✅' : 'Отключено ❌'}
        </Typography>
        
        {messages.map((msg: any, index: number) => (
          <Box key={index} sx={{ 
            mb: 1, 
            p: 1, 
            bgcolor: msg.userId === 1 ? 'primary.light' : 'grey.100', 
            borderRadius: 1,
            textAlign: msg.userId === 1 ? 'right' : 'left'
          }}>
            <Typography variant="body2" color="text.secondary">
              {msg.userId === 1 ? 'Поддержка' : 'Вы'}:
            </Typography>
            <Typography>{msg.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
        
        {messages.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Нет сообщений. Начните общение!
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          variant="contained" 
          onClick={handleSend}
          disabled={!message.trim()}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
};

export default SupportPage;
