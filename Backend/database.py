# FILE: Backend/database.py

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create a simple SQLite database file
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.sqlite"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define the structure of the messages table
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String) # 'user' or 'assistant'
    text = Column(Text)   # The content of the message

def init_db():
    Base.metadata.create_all(bind=engine)