"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useTheme } from "@/Context/themeContext";
import axios from "axios";

type messageType = {
  role: string;
  content: string;
};

type MessagesProps = {
  messages: messageType[];
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  isExample: boolean;
  setIsExample: React.Dispatch<React.SetStateAction<boolean>>;
};

const Messages: React.FC<MessagesProps> = ({
  messages,
  setMessages,
  isExample,
  setIsExample,
}) => {
  const chatbotMessagesRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState<string>("");
  const { isLoading, toggleMessageLoading, theme } = useTheme();
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (chatbotMessagesRef.current) {
      const container = chatbotMessagesRef.current;

      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      if (isAtBottom) {
        container.scrollTop = container.scrollHeight;
      } else {
        if (!isExample) {
          const newMessageElement = container.lastElementChild as HTMLElement;
          if (newMessageElement) {
            const scrollOffset = newMessageElement.offsetHeight / 3;
            container.scrollTop += scrollOffset;
          }
        }
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    chatbotMessagesRef.current!.scrollTop =
      chatbotMessagesRef.current!.scrollHeight;

    if (prompt?.length > 0) {
      toggleMessageLoading();
      const userQuestion: messageType = { role: "user", content: prompt };
      setMessages((prevMessages) => [...prevMessages, userQuestion]);
      setIsExample(false);
      setPrompt("");
      const endpoint = process.env.NEXT_PUBLIC_PROFILE_INSIGHT_AI_ENDPOINT;
      if (!endpoint) {
        console.error("NEXT_PUBLIC_PROFILE_INSIGHT_AI_ENDPOINT is not defined");
        return;
      }
      try {
        const response = await axios.post(endpoint, {
          message_list: [...messages, userQuestion],
        });
        const reply: messageType = { role: "AI", content: response.data };
        setMessages((prevMessages) => [...prevMessages, reply]);
        toggleMessageLoading();
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    }
  };

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_PROFILE_INSIGHT_AI_ENDPOINT;
    const serverlessColdStartMitigator = async () => {
      if (endpoint) {
        await axios.post(endpoint, {
          message_list: [{ role: "user", content: "user" }],
        });
      }
    };
    serverlessColdStartMitigator();
  }, []);

  const parseLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split("\n").map((line, i) => {
      const parts = line.split(urlRegex).map((part, idx) =>
        urlRegex.test(part) ? (
          <a
            key={idx}
            href={part}
            style={{
              color: theme === "dark" ? "#90caf9" : "#1976d2",
              textDecoration: "underline",
              transition: "color 0.3s ease",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        ) : (
          part
        )
      );
      return <div key={i}>{parts}</div>;
    });
  };

  return (
    <>
      <Box
        ref={chatbotMessagesRef}
        style={{
          flex: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          overflow: "auto",
          overflowY: "scroll",
        }}
        className="chat-messages"
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
            width: "90%",
          }}
        >
          {isLoading && progress != 0 && messages?.length <= 1 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100 - (progress / 18) * 100}
              ></CircularProgress>
              <p
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  color:
                    theme === "dark"
                      ? "var(--text-secondary)"
                      : "rgba(0, 0, 0, 0.6)",
                  fontStyle: "italic",
                }}
              >
                The system is initializing due to a cold start. AWS Lambda is
                setting up a containerized environment to process your request.
              </p>
            </div>
          ) : messages?.length > 0 ? (
            <>
              {messages.map((message: messageType, index: number) => {
                return message?.role == "user" ? (
                  <Paper
                    key={index}
                    className="userMessage"
                    style={{
                      // width: "80%",
                      padding: 20,
                      alignSelf: "flex-end",
                      marginTop: 10,
                      marginBottom: 10,
                      wordWrap: "break-word",
                    }}
                    elevation={6}
                  >
                    {message?.content
                      ?.split("\n")
                      .map((line: string, i: number) => (
                        <div key={i}>{line}</div>
                      ))}
                  </Paper>
                ) : (
                  <Paper
                    key={index}
                    className="botMessage"
                    style={{
                      width: "80%",
                      padding: 20,
                      alignSelf: "flex-start",
                      marginTop: 10,
                      marginBottom: 10,
                      wordWrap: "break-word",
                    }}
                    elevation={10}
                  >
                    {parseLinks(message?.content)}
                  </Paper>
                );
              })}
              {isLoading && (
                <Skeleton
                  animation="pulse"
                  height={200}
                  width={300}
                  sx={{
                    backgroundColor:
                      theme === "dark"
                        ? "var(--secondary)"
                        : "rgba(0, 0, 0, 0.11)",
                    "&::after": {
                      background:
                        theme === "dark"
                          ? "var(--scrollbar-thumb)"
                          : "rgba(0, 0, 0, 0.25)",
                    },
                    alignSelf: "flex-start",
                    animationDuration: "0.5s",
                  }}
                />
              )}
            </>
          ) : (
            <>
              <Typography style={{ textAlign: "center" }} variant="body2">
                This Retrieval Augmented Generation(RAG) chatbot was developed
                by Mukund Sureshkumar. <br></br>
                <br></br>
                Check out the code{" "}
                <a
                  href="https://github.com/Mukunds0507333/profile-insight-ai-chatbot"
                  target="_blank"
                  style={{
                    color: theme === "dark" ? "#90caf9" : "#1976d2",
                    textDecoration: "underline",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#64b5f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      theme === "dark" ? "#90caf9" : "#1976d2")
                  }
                >
                  here
                </a>
              </Typography>
            </>
          )}
          <Box>
            <br />
          </Box>
        </Box>
      </Box>
      {messages && (
        <Box
          style={{
            flex: 2,
            display: "flex",
            width: "75%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Your message"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={isLoading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            multiline
            maxRows={1}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--outline)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--accent)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary)",
                },
              },
              "& .MuiInputLabel-outlined": {
                color: "var(--text)",
              },
              "& .MuiOutlinedInput-input": {
                color: "var(--text)",
              },
            }}
            inputProps={{
              style: {
                overflow: "auto",
              },
            }}
          />
          <Button
            style={{ marginLeft: "10px", height: "36px" }}
            variant="contained"
            onClick={handleSendMessage}
            disabled={isLoading || prompt?.length < 1}
          >
            {isLoading ? (
              <CircularProgress
                size={24}
                color={theme === "light" ? "inherit" : "secondary"}
              />
            ) : (
              <SendRoundedIcon />
            )}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Messages;
