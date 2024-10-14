from pydantic import BaseModel


class Message(BaseModel):
    action_type: int
    action: int
    author_id: int
