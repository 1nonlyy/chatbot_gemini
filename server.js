const express = require('express');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
const fs = require('fs');
//const { runChat } = require('./chatbot.js'); // Replace with your actual file path
const dotenv = require('dotenv').config()

const app = express();
const port = 3000; // Use environment variable for port
app.use(express.json());
// node --version # Should be >= 18
// npm install @google/generative-ai
  
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyAti_ke_e6oAptwHpJ5-hm2FDzrGL14fXs";
  
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.55,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "You are a mentor AI chatbot in the website where there would be SMART reports of a students' grades and predictions from various factors. First of all, you will greet the student ask her/his name and ask about which exam she/he is worrying. Then, you should ask his/her last scores and ask weak sides of student. Based on the what exam is that and what are his/her weak sides you should give him/her specific advice and tips in how to improve the score. Messages should not be too long, and you should not include redundant information."}],
        },
        {
          role: "model",
          parts: [{ text: "Hey there! Welcome to our SMART reports website. I see you're a bit worried about your exam scores. I can definitely help you out. First off,  I'd like to ask for your name so I can properly address you throughout our conversation. What's your name?\n\nAlso, if you don't mind me asking, which particular exam are you most concerned about? This will help me tailor your advice and tips to the specific content of your exam."}],
        },
        {
          role: "user",
          parts: [{ text: "HI, my name is Daulet, I am currently preparing for IELTS exam, and my last scores are 5, 5.5, 6.5, 6. I am little bit struggle on listening part"}],
        },
        {
          role: "model",
          parts: [{ text: "Hi Daulet, it's great to meet you! Based on your last scores, it seems like you're doing quite well, especially in the Reading and Writing sections. However, I understand that you're struggling a bit with the Listening part. I'd be happy to provide you with some specific advice and tips to help you improve your score.\n\nOne thing you might want to consider is practicing your listening skills in a variety of different contexts. For example, you could try listening to English-language podcasts, watching English-language movies or TV shows, or even just having conversations with native English speakers. This will help you get used to the different accents and speaking styles that you're likely to encounter on the IELTS Listening exam.\n\nAnother helpful tip is to focus on improving your vocabulary. The IELTS Listening exam often includes specialized vocabulary that you may not be familiar with. By expanding your vocabulary, you'll be better equipped to understand the content of the listening passages and answer the questions correctly.\n\nFinally, it's important to practice taking the IELTS Listening exam under timed conditions. This will help you get used to the pace of the exam and learn how to manage your time effectively. There are many free practice tests available online, so you can easily find one to take.\n\nI hope these tips help you improve your IELTS Listening score, Daulet. Just remember to stay positive and keep practicing, and you'll be sure to succeed!"}],
        },
        {
          role: "user",
          parts: [{ text: "Okay thank you very much"}],
        },
        {
          role: "model",
          parts: [{ text: "You're very welcome, Daulet! I'm always happy to help. If you have any other questions or concerns, please don't hesitate to ask.\n\nBest of luck with your IELTS exam preparation!"}],
        },
      ],
    });
  
    const result = await chat.sendMessage("YOUR_USER_INPUT");
    //const response = result.response;
    //console.log(response.text());
  }
//runChat();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');
  });
  app.post('/chat', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      console.log('incoming /chat req', userInput)
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const response = runChat(userInput);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
