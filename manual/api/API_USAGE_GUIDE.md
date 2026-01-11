# External Note API Usage Guide

This API allows authorized external agents (like AI, scripts) to manage notes in the system.

## Authentication
## Authentication
All requests must include the API Key in the header:
- Header: `x-api-key`
- Value: `[YOUR_GENERATED_KEY]` (starts with `sk_`)

**How to get a key:**
1. Log in to the application.
2. Go to **Settings**.
3. Click "Generate New API Key".
4. Copy the key immediately (it won't be shown again).

## Base URL
- Local: `http://localhost:3000/api/external/notes`
- Production: `https://mynote.khsruru.com/api/external/notes`

## Endpoints

### 1. Search Notes (GET)
Search for notes by query text, category, or favorite status.

- **URL**: `/api/external/notes`
- **Params**:
  - `query` (optional): Search text (title or content)
  - `categoryId` (optional): Filter by category ID
  - `isFavorite` (optional): "true" to filter favorites

**Example (Python):**
```python
import requests

# For production, use: url = "https://mynote.khsruru.com/api/external/notes"
url = "https://mynote.khsruru.com/api/external/notes"
headers = {"x-api-key": "YOUR_KEY"}
params = {"query": "Next.js", "isFavorite": "true"}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```

### 2. Create Note (POST)
Create a new note.

- **URL**: `/api/external/notes`
- **Body (JSON)**:
  - `title` (required): Note title
  - `content` (optional): Note content
  - `categoryId` (optional): Category ID
  - `isDraft` (optional): boolean (default: false)

**Example (Python):**
```python
import requests

url = "https://mynote.khsruru.com/api/external/notes"
headers = {"x-api-key": "YOUR_KEY"}
data = {
    "title": "Meeting Notes",
    "content": "- Discussed API design...",
    "category": "work",  # Note: Must be ID, not name. Needs category lookup first if by name.
    "isDraft": False
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### 3. Delete Note (DELETE)
Delete a note.

- **URL**: `/api/external/notes`
- **Params**:
  - `id` (required): Note ID
  - `force` (optional): "true" for permanent delete, otherwise soft delete (trash)

**Example (Python):**
```python
import requests

url = "https://mynote.khsruru.com/api/external/notes"
headers = {"x-api-key": "YOUR_KEY"}
params = {"id": "note-uuid-123", "force": "false"}

response = requests.delete(url, headers=headers, params=params)
print(response.json())
```
