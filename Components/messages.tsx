'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, Paper, Button, Typography } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ThemeToggle from './themeToggle';
import axios from 'axios';

const Messages: React.FC = () => {
  type messageType = {
    role: string;
    content: string;
  };

  const chatbotMessagesRef = useRef<HTMLDivElement | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<messageType[]>([]);

  useEffect(() => {
    if (chatbotMessagesRef.current) {
      chatbotMessagesRef.current.scrollTop = chatbotMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (prompt?.length > 0) {
      const userQuestion: messageType = { role: 'user', content: prompt };
      setMessages((prevMessages) => [...prevMessages, userQuestion]);
      setPrompt('');
      const response = await axios.post('https://i55xx7w3lrjdmamc4ut4bzgcjm0yulke.lambda-url.ap-south-1.on.aws/', {
        question: prompt,
      });
      console.log(response);

      const reply: messageType = { role: 'AI', content: response.data.result };
      setMessages((prevMessages) => [...prevMessages, reply]);
      console.log(messages);
    }
  };

  return (
    <>
      <Box
        ref={chatbotMessagesRef}
        style={{
          flex: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          overflow: 'auto',
          overflowY: 'scroll',
        }}
        className='chat-messages'
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: '100%',
            width: '90%',
          }}
        >
          {messages?.length > 0 ? (
            messages.map((message: messageType, index: number) => {
              console.log('conditional ', message);
              return message.role === 'user' ? (
                <Paper
                  key={index}
                  className='userMessage'
                  style={{ padding: 20, alignSelf: 'flex-end', marginTop: 5, marginBottom: 5 }}
                  elevation={6}
                >
                  {message.content.split('\n').map((line: string, i: number) => (
                    <div key={i}>{line}</div>
                  ))}
                </Paper>
              ) : (
                <Paper
                  key={index}
                  className='botMessage'
                  style={{ padding: 20, alignSelf: 'flex-start', marginTop: 5, marginBottom: 5 }}
                  elevation={10}
                >
                  {message.content.split('\n').map((line: string, i: number) => (
                    <div key={i} style={{ margin: 5 }}>
                      {line}
                    </div>
                  ))}
                </Paper>
              );
            })
          ) : (<>
            <Typography style={{ textAlign: 'center' }} variant='body2'>
              This Retrieval Augmented Generation(RAG) chatbot was developed by Mukund Sureshkumar. <br></br><br></br>
              Check out the code <a href="https://github.com/Mukunds0507333/profile-insight-ai-chatbot" target="_blank">here</a> 
            </Typography>
          </>
          )}
          <Box>
            <br />
          </Box>
        </Box>
      </Box>
      {messages && (
        <Box style={{ flex: 2, display: 'flex', width: '75%' }}>
          <TextField
            label='Your message'
            variant='outlined'
            fullWidth
            margin='normal'
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--outline)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--accent)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--primary)',
                },
              },
              '& .MuiInputLabel-outlined': {
                color: 'var(--text)',
              },
              '& .MuiOutlinedInput-input': {
                color: 'var(--text)',
              },
            }}
            InputProps={{
              endAdornment: (
                <Button
                  style={{ paddingLeft: 1, width: 1, marginLeft: -12, marginRight: 8, backgroundColor: '#1847a0' }}
                  variant='contained'
                  color='primary'
                  onClick={handleSendMessage}
                  endIcon={<SendRoundedIcon />}
                />
              ),
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Messages;