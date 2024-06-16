import { Grid, Box, Typography } from '@mui/material';
import ChatList from './chatList';
import Messages from './messages';
import ThemeToggle from './themeToggle';

const Chatbot: React.FC = () => {
    return (
        <Grid container className='chatbot' style={{ height: '100vh', margin: 0 }}>
            <Grid item xs={12} md={2} style={{ height: "100%" }}>
                <ChatList />
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
                    <Box style={{ flex: 0.5, width: "90%",margin: 40, display: 'flex', justifyContent: 'space-between' }}>
                        <Box style={{ marginTop: 10 }}>
                            <Typography variant='h5' style={{ fontWeight: 'bold', textAlign: 'center' }}>Profile Insight AI Chatbot</Typography>
                        </Box>
                        <Box>
                            <ThemeToggle />
                        </Box>
                    </Box>
                    <Messages />
                </Box>
            </Grid>
        </Grid>
    );
}

export default Chatbot;
