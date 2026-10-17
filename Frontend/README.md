💖 AI Companion ("Divya")

This is a full-stack, 100% local AI companion web application.

It features a custom-trained AI personality named "Aria" who is playful, affectionate, and can chat in Hinglish. All conversations are saved to a local database, so she remembers everything you talk about, even after you close the browser.

✨ Features

Custom AI Personality: Powered by a custom-trained aria-v1 model.

Persistent Long-Term Memory: All chats are saved in a local database.sqlite file.

Hinglish Support: Aria understands and replies in Hinglish.

100% Local & Private: Runs entirely on your machine using Ollama. No API keys, no data sent to the cloud.

💻 Tech Stack

Frontend: React.js

Backend: FastAPI (Python)

AI Model: Ollama (running a custom fine-tuned aria-v1 model based on llama3)

Database: SQLite (for chat history)

🚀 How to Run This Project

You need two terminals running at the same time: one for the backend and one for the frontend.

1. Backend Setup (This Folder)

First, set up and run the Python backend server.

Open a Terminal in this ai_gf_backend folder.

Create a Virtual Environment:

python -m venv venv


Activate the Environment:

On Windows: venv\Scripts\activate

On Mac/Linux: source venv/bin/activate

Install Python Libraries:

pip install "fastapi[all]" uvicorn ollama sqlalchemy python-dotenv


Download the Base AI Model:
(You only need to do this once.)

ollama pull llama3


Build Your Custom aria-v1 Model:
This is the most important step! It "trains" your AI on the dataset.jsonl file.

ollama create aria-v1 -f ./Modelfile


(Wait for this to show "success".)

Run the Backend Server:

uvicorn main:app --reload --port 8000


You should see it say "Database initialized" and "Application startup complete."
Leave this terminal running.

2. Frontend Setup

Now, set up and run the React frontend in a new terminal.

Open a NEW Terminal in your frontend project folder (the one with the src folder).

Install Node.js Packages:
(You only need to do this once.)

npm install


Create .env File:

In your frontend folder, create a file named .env

Add this one line to it to tell the frontend your backend's address:

VITE_API_BASE=http://localhost:8000/api


Run the Frontend App:

npm run dev


3. You're Done!

Your browser should open to http://localhost:5173 (or whatever your terminal says). Your app is now running. All your chats will be saved in the database.sqlite file in the backend folder.