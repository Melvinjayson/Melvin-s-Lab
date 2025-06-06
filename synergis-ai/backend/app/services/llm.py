from typing import Optional, Dict, Any
from langchain.llms import GPT4All
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LLMService:
    def __init__(self):
        self.model_path = os.getenv("MODEL_PATH")
        self.model_type = os.getenv("MODEL_TYPE", "gpt4all")
        
        # Initialize the language model
        self.llm = self._initialize_llm()
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings()
        
        # Initialize vector store
        self.vectorstore = self._initialize_vectorstore()
        
        # Initialize conversation memory
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Initialize the conversation chain
        self.chain = self._initialize_chain()

    def _initialize_llm(self) -> GPT4All:
        """Initialize the language model"""
        try:
            return GPT4All(
                model=self.model_path,
                verbose=True,
                n_ctx=2048,  # Context window
                n_threads=8,  # Number of CPU threads to use
                temp=0.7,    # Temperature for response generation
            )
        except Exception as e:
            raise Exception(f"Failed to initialize LLM: {str(e)}")

    def _initialize_vectorstore(self) -> Chroma:
        """Initialize the vector store for document retrieval"""
        try:
            return Chroma(
                collection_name="synergis_kb",
                embedding_function=self.embeddings,
                persist_directory=".chroma"
            )
        except Exception as e:
            raise Exception(f"Failed to initialize vector store: {str(e)}")

    def _initialize_chain(self) -> ConversationalRetrievalChain:
        """Initialize the conversation chain"""
        try:
            # Custom prompt template for consultation
            prompt_template = """
            You are an AI consultant specializing in professional services.
            Use the following pieces of context to answer the question at the end.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.
            
            Context: {context}
            
            Chat History: {chat_history}
            
            Question: {question}
            
            Answer: Let's approach this step by step:
            """

            PROMPT = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "chat_history", "question"]
            )

            return ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vectorstore.as_retriever(),
                memory=self.memory,
                combine_docs_chain_kwargs={"prompt": PROMPT}
            )
        except Exception as e:
            raise Exception(f"Failed to initialize conversation chain: {str(e)}")

    async def process_message(self, message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Process a message and return the AI response"""
        try:
            # Add any additional context to the conversation
            if context:
                self.memory.save_context(
                    {"input": "System: Additional context provided"},
                    {"output": str(context)}
                )

            # Get response from the chain
            response = await self.chain.arun(message)

            return response

        except Exception as e:
            raise Exception(f"Failed to process message: {str(e)}")

    async def update_knowledge_base(self, documents: list):
        """Update the knowledge base with new documents"""
        try:
            # Add documents to the vector store
            self.vectorstore.add_documents(documents)
            self.vectorstore.persist()
            return {"status": "success", "message": "Knowledge base updated successfully"}
        except Exception as e:
            raise Exception(f"Failed to update knowledge base: {str(e)}")

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model configuration"""
        return {
            "model_type": self.model_type,
            "model_path": self.model_path,
            "context_window": 2048,
            "embedding_model": "sentence-transformers",
        }