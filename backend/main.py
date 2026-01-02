from fastapi import FastAPI
from app.routers import auth, salesforce, agents, rag, agentforce, agentforce_triggers

app = FastAPI(title="BizIntel AI", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "BizIntel AI API is running"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(salesforce.router, prefix="/salesforce", tags=["salesforce"])
app.include_router(rag.router, prefix="/rag", tags=["rag"])
app.include_router(agents.router, prefix="/agents", tags=["agents"])
app.include_router(agentforce.router, prefix="/agentforce", tags=["agentforce"])
app.include_router(agentforce_triggers.router, prefix="/agentforce", tags=["agentforce-triggers"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
