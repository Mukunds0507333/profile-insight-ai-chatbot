// Components/chatList.tsx
import { Paper, Chip, Box, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';
import { messageType } from './chatbot';

type MessagesProps = {
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
};

const ChatList: React.FC<MessagesProps> = ({ setMessages }) => {
  const testList: string[] = ['Example Chat 1', 'Example Chat 2'];

  const retrieveMessages = async (index: number) => {
    try {
      const response = await axios.get(`/api/chats/${index + 1}`);
      console.log("response ", response.data.messages);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        margin: 0,
        padding: 0,
      }}
      className='chatList'
      elevation={16}
    >
      <Box
        style={{
          flex: 9,
          padding: 20,
          paddingLeft: 10,
          marginBottom: 15,
          overflow: 'auto',
          overflowY: 'scroll',
        }}
      >
        <Chip
          label='Chat Demonstrations'
          variant='outlined'
          style={{ width: '100%', height: '10%', borderRadius: 3, fontSize: '0.95rem', marginBottom: 10 }}
          className='chatDemonstrations'
        />
        <Box>
          {testList &&
            testList.map((test, index) => (
              <Button
                key={index}
                variant='outlined'
                style={{
                  padding: 5,
                  margin: 5,
                  width: '90%',
                  height: 50,
                }}
                onClick={() => retrieveMessages(index)}
              >
                {test}
              </Button>
            ))}
        </Box>
      </Box>

      <Box style={{ flex: 1, padding: 20, paddingLeft: 10 }}>
        <a href='https://www.linkedin.com/in/mukund-sureshkumar/' target='_blank'>
          <Button
            variant='contained'
            style={{ width: '100%', borderRadius: 5, height: 50 }}
            className='linkedin-button'
          >
            <LinkedInIcon />
          </Button>
        </a>
      </Box>
    </Paper>
  );
};

export default ChatList;
