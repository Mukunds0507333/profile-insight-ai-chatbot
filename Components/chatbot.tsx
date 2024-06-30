'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import ChatList from './chatList';
import Messages from './messages';
import ThemeToggle from './themeToggle';
import MenuIcon from '@mui/icons-material/Menu';

export type messageType = {
    role: string;
    content: string;
  };

const Chatbot: React.FC = () => {
    
    const [showChatList, setShowChatList] = useState(false);
    const [messages, setMessages] = useState<messageType[]>([]);
    const chatListRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            toggleButtonRef.current &&
            !toggleButtonRef.current.contains(event.target as Node)
        ) {
            setShowChatList(false);
        }
    };

    useEffect(() => {
        if (showChatList) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showChatList]);

    return (
        <Grid container className='chatbot' style={{ height: '100vh', margin: 0 }}>
            <Box 
                sx={{ 
                    display: { xs: 'block', md: 'none' }, 
                    position: 'absolute', 
                    top: 10, 
                    left: 10 
                }}
            >
                <IconButton onClick={toggleChatList} className='menu-button'>
                    <MenuIcon />
                </IconButton>
            </Box>

            <Grid
                item
                xs={10}
                md={2}
                className={`chatList ${showChatList ? 'visible' : 'hidden'}`}
                style={{ height: "100%" }}
                ref={chatListRef}
            >
                <ChatList setMessages = {setMessages}/>
            </Grid>

            <Grid item xs={12} md={10} style={{ height: "100%" }}>
                <Box style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: "100%",
                    width: "100%",
                    padding: 0,
                    margin: 0
                }}>
                    <Box style={{ flex: 0.5, width: "90%", margin: 40, display: 'flex', justifyContent: 'space-between' }}>
                        <Box style={{ marginTop: 10 }}>
                            <Typography variant='h5' style={{ fontWeight: 'bold', textAlign: 'center' }}>Profile Insight AI Chatbot</Typography>
                        </Box>
                        <Box  ref={toggleButtonRef}>
                            <ThemeToggle />
                        </Box>
                    </Box>
                    <Messages messages={messages} setMessages={setMessages}/>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Chatbot;
