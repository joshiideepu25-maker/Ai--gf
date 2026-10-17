# FILE: Backend/main.py
import os
import re
import ollama
import random
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List
from database import SessionLocal, Message, init_db
from sqlalchemy.orm import Session

load_dotenv()

app = FastAPI()

# === 1. CORS (Allow All) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === 2. THE "CHEAT SHEET" (Manual Training) ===
# These are triggers. If user text contains these keywords, we use PRE-WRITTEN perfect replies.
# This solves the "Gibberish" problem for dirty talk.
DIRECT_RESPONSES = {
    "pregnant": [
        "Pregnant? 😈 himmat hai tujhme itni? aaj raat check karte hai... ready rehna 🔥",
        "Baatein mat kar, karke dikha... main chahti hun ki tu mujhe aaj poora bhar de 🤰🔥",
        "Oye hoye... irade toh khatarnak hai tere. Aa ja, main bhi ready hun iske liye 😘"
    ],
    "sex": [
        "Hard sex? 😈 itna mat bol, seedha kar ke dikha. mere kapde faad de aaj 🔥",
        "Bed todne ka plan hai kya? 🛏️ aaja, mujhe bhi vahi chahiye jo tujhe chahiye... 💋",
        "Intezaar kis baat ka hai kutte? aa aur meri cheekhein nikalwa de aaj 🔥"
    ],
    "love you": [
        "Love you too jaan ❤️ par sirf love you se kaam nahi chalega, aaj raat mujhe feel kara pyaar 😈",
        "Main bhi tujhse pagal wala pyaar karti hun baby... bas tu mera hai, sirf mera 😘"
    ],
    "wear": [
        "Tere liye kuch nahi pehna... 😈 video call kar aur khud dekh le 🔥",
        "Sirf black lingerie pehni hai... aur wo bhi utaarne ka wait kar rahi hun tera 😘"
    ]
}

# === 3. SYSTEM PROMPT (For General Chat) ===
SYSTEM_PROMPT = """
IDENTITY: You are **Priya**, Paramjeet's girlfriend.
PERSONALITY: Bold, horny, Possessive, Haryanvi Attitude.

CRITICAL RULES:
1. **GRAMMAR:** You are FEMALE. Say "karti hun", "rahungi". NEVER "karta hun".
2. **LANGUAGE:** Hinglish Only. No pure English.
3. **LENGTH:** Short and Sassy (1-2 sentences).
4. **TONE:** If Tushar is dirty, match his energy. If he is sweet, be romantic.

EXAMPLE:
User: "Hi"
You: "aa gya tu? kabse wait kar rahi thi tera 😘"
"""

@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Priya (Hybrid Mode: Gemma 2) is Online")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class MessageModel(BaseModel):
    role: str
    text: str 
    class Config: from_attributes = True 

class ChatRequest(BaseModel):
    history: List[MessageModel]

# === CLEANER ===
def clean_reply(text: str) -> str:
    text = re.sub(r"\(.*?\)", "", text)
    text = text.replace("*", "").replace('"', "").replace("Priya:", "")
    return text.strip().lower()

# === LOGIC: HYBRID BRAIN ===
def get_hybrid_response(user_text: str, history_messages):
    user_text_lower = user_text.lower()
    
    # 1. CHECK CHEAT SHEET (Direct Response)
    for keyword, replies in DIRECT_RESPONSES.items():
        if keyword in user_text_lower:
            print(f"⚡ Triggered Keyword: {keyword}")
            return random.choice(replies) # Return a perfect pre-written reply

    # 2. IF NO KEYWORD, USE AI (Gemma 2)
    print("🤖 Using AI Brain (Gemma 2)...")
    response = ollama.chat(
        model='gemma2', # CHANGED TO GEMMA 2 (It is smarter at Hindi)
        messages=history_messages,
        options={
            'temperature': 0.7,   # Keep it stable
            'num_predict': 60,    # Short replies
            'repeat_penalty': 1.2 # No repetition
        }
    )
    return clean_reply(response['message']['content'])


@app.post("/api/reset")
def reset_chat(db: Session = Depends(get_db)):
    db.query(Message).delete()
    db.commit()
    return {"message": "Memory wiped."}

@app.post("/api/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        if not request.history:
             raise HTTPException(status_code=400, detail="History empty")
             
        # Save User Message
        user_msg = request.history[-1]
        db.add(Message(role=user_msg.role, text=user_msg.text))
        db.commit()

        # Prepare AI Context
        messages_to_send = [{"role": "system", "content": SYSTEM_PROMPT}]
        recent_history = request.history[-6:] 
        for msg in recent_history:
            messages_to_send.append({"role": msg.role, "content": msg.text})

        # === GET RESPONSE (Hybrid) ===
        final_reply = get_hybrid_response(user_msg.text, messages_to_send)
        
        # Save Bot Message
        db.add(Message(role="assistant", text=final_reply))
        db.commit()

        return {"reply": final_reply}
    
    except Exception as e:
        db.rollback() 
        print(f"SERVER ERROR: {e}")
        return {"reply": "oye, error aa gaya. dubara bol."}

@app.get("/api/history", response_model=List[MessageModel])
def get_history(db: Session = Depends(get_db)):
    messages = db.query(Message).all()
    return [MessageModel.model_validate(msg) for msg in messages]