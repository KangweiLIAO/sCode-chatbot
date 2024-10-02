
# sCode - AI-Powered Coding Assistant

sCode is a powerful coding assistant chatbot designed to help developers with real-time code generation, debugging, and providing quick answers to coding-related questions. Built using Google's **Gemma7B** language model, sCode delivers intelligent suggestions for various programming challenges, making it a valuable tool for both beginners and experienced developers.

## Key Features
- **Real-time Code Assistance**: Get immediate answers to coding questions and suggestions for code snippets.
- **Debugging Support**: Identify and fix code issues with intelligent recommendations.
- **Seamless User Experience**: Built with an intuitive front-end interface to facilitate smooth interactions with the chatbot.
- **Highly Scalable**: Optimized to handle multiple user requests using efficient server-side logic.

## Tech Stack
- **Frontend**: NextJS
- **Backend**: FastAPI, Heroku, Vercel
- **AI Model**: Google/Gemma7B
- **Chatbot Framework**: Dialogflow
- **Database**: MongoDB

## Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KangweiLIAO/sCode-chatbot.git
   cd scode
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Set your Huggingface API keys

4. **Run the Backend**
   Navigate to the backend directory and install FastAPI dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Run the Frontend**
   Navigate back to the frontend directory:
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Deploying to Heroku/Vercel**
   - Use **Heroku** for backend deployment.
   - Use **Vercel** for frontend deployment.
   Make sure to set up the environment variables on both platforms.

## Usage

Once the setup is complete, the chatbot can be accessed from the frontend web interface. Users can input their coding questions, and sCode will respond with relevant suggestions powered by the **Gemma7B** model. The chatbot supports a wide range of programming languages and provides real-time assistance.

## Contributing

Contributions are welcome! Please open an issue first to discuss any proposed changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
