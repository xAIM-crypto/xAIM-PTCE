# How It Works: PTCE Implementation Guide

This guide provides detailed instructions for setting up, running, and testing the Predictive Triadic Consensus Engine (PTCE) implementation locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)
- [Implementation Details](#implementation-details)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/xAIM-PTCE.git
   cd xAIM-PTCE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Connection
   DATABASE_URL=postgres://username:password@localhost:5432/your_database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=your_database_name

   # API Keys
   OPEN_AI_API_KEY=your_openai_api_key_here

   # PTCE Configuration
   PTCE_CONFIDENCE_THRESHOLD=2.0
   PTCE_ADJUSTMENT_FACTOR=0.4
   ```

3. Create a PostgreSQL database:
   ```bash
   createdb your_database_name
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will start at http://localhost:3000 (or the port you specified in the `.env` file).

3. You should see output similar to:
   ```
   Server running in development mode on port 3000
   PTCE API available at http://localhost:3000/api/ptce
   Press CTRL+C to stop the server
   ```

## Testing the API

### 1. Health Check

First, verify the service is running:

```bash
curl http://localhost:3000/api/ptce/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "PTCE service is running"
}
```

### 2. Test with Model Objects

You can test the PTCE with full model objects:

```bash
curl -X POST http://localhost:3000/api/ptce/determine-winner \
  -H "Content-Type: application/json" \
  -d '{
    "model1": {
      "id": "test-model-1",
      "name": "Aggressive Fighter",
      "prompt": "A powerful fighter with aggressive tactics",
      "finalThumbnailUrl": "https://example.com/thumbnail1.jpg",
      "finalModelUrl": "https://example.com/model1.glb",
      "video_url": "https://example.com/video1.mp4",
      "texture_urls": ["https://example.com/texture1.jpg"],
      "attributes": {
        "attack_power": 85,
        "defense": 60,
        "speed_agility": 75,
        "strategy": 65,
        "endurance": 70
      },
      "ip_address": "127.0.0.1",
      "secretKey": "test-key-1"
    },
    "model2": {
      "id": "test-model-2",
      "name": "Strategic Defender",
      "prompt": "A tactical defender with high endurance",
      "finalThumbnailUrl": "https://example.com/thumbnail2.jpg",
      "finalModelUrl": "https://example.com/model2.glb",
      "video_url": "https://example.com/video2.mp4",
      "texture_urls": ["https://example.com/texture2.jpg"],
      "attributes": {
        "attack_power": 65,
        "defense": 85,
        "speed_agility": 60,
        "strategy": 80,
        "endurance": 75
      },
      "ip_address": "127.0.0.1",
      "secretKey": "test-key-2"
    }
  }'
```

### 3. Test with Database Models

If you have models already in your database, you can test using their IDs:

```bash
curl -X POST http://localhost:3000/api/ptce/determine-winner-by-ids \
  -H "Content-Type: application/json" \
  -d '{
    "model1Id": "1",
    "model2Id": "2"
  }'
```

### 4. Expected Response

The response should look something like this:

```json
{
  "matchId": "550e8400-e29b-41d4-a716-446655440000",
  "winner": {
    "id": "test-model-1",
    "name": "Aggressive Fighter",
    "prompt": "A powerful fighter with aggressive tactics",
    "finalThumbnailUrl": "https://example.com/thumbnail1.jpg",
    "finalModelUrl": "https://example.com/model1.glb",
    "video_url": "https://example.com/video1.mp4",
    "texture_urls": ["https://example.com/texture1.jpg"],
    "attributes": {
      "attack_power": 85,
      "defense": 60,
      "speed_agility": 75,
      "strategy": 65,
      "endurance": 70
    },
    "ip_address": "127.0.0.1",
    "secretKey": "test-key-1"
  },
  "scores": {
    "test-model-1": 8.2,
    "test-model-2": 7.8
  },
  "confidence": 0.7,
  "reasoning": "Agreement achieved in initial evaluation (variance: test-model-1=0.25, test-model-2=0.30)."
}
```

### 5. Using Postman or Similar Tools

For more complex testing, you can use Postman:

1. Create a new POST request to `http://localhost:3000/api/ptce/determine-winner`
2. Set the Content-Type header to `application/json`
3. Add the JSON payload with model1 and model2 objects
4. Send the request and examine the response

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ptce/health` | GET | Check if the service is running |
| `/api/ptce/determine-winner` | POST | Determine winner between two model objects |
| `/api/ptce/determine-winner-detailed` | POST | Determine winner with detailed LLM interactions |
| `/api/ptce/determine-winner-by-ids` | POST | Determine winner between two models by their IDs |
| `/api/ptce/determine-winner-by-ids-detailed` | POST | Determine winner by IDs with detailed LLM interactions |

### Viewing LLM Interactions

To see the detailed interactions between LLMs during the evaluation process, use the `-detailed` endpoints:

```bash
curl -X POST http://localhost:3000/api/ptce/determine-winner-detailed \
  -H "Content-Type: application/json" \
  -d '{
    "model1": {
      "id": "test-model-1",
      "name": "Aggressive Fighter",
      "prompt": "A powerful fighter with aggressive tactics",
      "finalThumbnailUrl": "https://example.com/thumbnail1.jpg",
      "finalModelUrl": "https://example.com/model1.glb",
      "video_url": "https://example.com/video1.mp4",
      "texture_urls": ["https://example.com/texture1.jpg"],
      "attributes": {
        "attack_power": 85,
        "defense": 60,
        "speed_agility": 75,
        "strategy": 65,
        "endurance": 70
      },
      "ip_address": "127.0.0.1",
      "secretKey": "test-key-1"
    },
    "model2": {
      "id": "test-model-2",
      "name": "Strategic Defender",
      "prompt": "A tactical defender with high endurance",
      "finalThumbnailUrl": "https://example.com/thumbnail2.jpg",
      "finalModelUrl": "https://example.com/model2.glb",
      "video_url": "https://example.com/video2.mp4",
      "texture_urls": ["https://example.com/texture2.jpg"],
      "attributes": {
        "attack_power": 65,
        "defense": 85,
        "speed_agility": 60,
        "strategy": 80,
        "endurance": 75
      },
      "ip_address": "127.0.0.1",
      "secretKey": "test-key-2"
    }
  }'
```

The response will include an `interactions` array that contains a chronological log of all LLM interactions during the evaluation process:

```json
{
  "matchId": "550e8400-e29b-41d4-a716-446655440000",
  "winner": { /* winner details */ },
  "scores": { /* scores */ },
  "confidence": 0.7,
  "reasoning": "Agreement achieved in initial evaluation...",
  "interactions": [
    {
      "timestamp": "2023-06-01T12:34:56.789Z",
      "phase": "initial_evaluation",
      "llm": "LLM1 (ChatGPT)",
      "action": "evaluating_creativity",
      "details": { /* details about the evaluation */ }
    },
    {
      "timestamp": "2023-06-01T12:34:57.123Z",
      "phase": "initial_evaluation",
      "llm": "LLM1 (ChatGPT)",
      "action": "evaluated_model",
      "details": { /* evaluation results */ }
    },
    // ... many more interaction logs ...
    {
      "timestamp": "2023-06-01T12:35:10.456Z",
      "phase": "final_determination",
      "action": "winner_determined",
      "details": { /* final determination details */ }
    }
  ],
  "initialEvaluations": { /* raw initial evaluations */ },
  "discussionResults": { /* discussion process results */ },
  "consensusScores": { /* detailed consensus scores */ },
  "predictiveOutcomes": { /* predictive outcome probabilities */ }
}
```

This detailed response allows you to:
1. See each LLM's individual evaluations
2. Track how the discussion phase affected the scores
3. Understand how the consensus was built
4. View the predictive outcomes that influenced the final decision

The interactions are logged chronologically with timestamps, making it easy to follow the entire decision-making process from start to finish.

## Troubleshooting

### OpenAI API Issues

If you see an error like this:
```
Error in OpenAI evaluation: BadRequestError: 400 Invalid parameter: 'response_format' of type 'json_object' is not supported with this model.
```

**Solution**: Edit the `src/services/openai-service.ts` file and modify the OpenAI API call:

```typescript
// Find this code around line 30
const response = await this.openai.chat.completions.create({
  model: "gpt-4", // Using GPT-4 for all evaluations in test mode
  messages: [
    { 
      role: "system", 
      content: this.getSystemPromptForEvaluationType(request.evaluationType) 
    },
    { 
      role: "user", 
      content: prompt 
    }
  ],
  temperature: 0.7,
  max_tokens: 500,
  response_format: { type: "json_object" }
});

// Change it to:
const response = await this.openai.chat.completions.create({
  model: "gpt-4o-mini", // Use a model that supports JSON response format
  messages: [
    { 
      role: "system", 
      content: this.getSystemPromptForEvaluationType(request.evaluationType) 
    },
    { 
      role: "user", 
      content: prompt 
    }
  ],
  temperature: 0.7,
  max_tokens: 500,
  response_format: { type: "json_object" }
});
```

Alternatively, you can remove the `response_format` parameter entirely and parse the response manually:

```typescript
const response = await this.openai.chat.completions.create({
  model: "gpt-4", // Using GPT-4 for all evaluations in test mode
  messages: [
    { 
      role: "system", 
      content: this.getSystemPromptForEvaluationType(request.evaluationType) 
    },
    { 
      role: "user", 
      content: prompt 
    }
  ],
  temperature: 0.7,
  max_tokens: 500
});
```

### Database Connection Issues

If you encounter database connection errors:

1. Verify your PostgreSQL service is running:
   ```bash
   sudo service postgresql status  # Linux
   brew services list              # macOS
   ```

2. Check your database credentials in the `.env` file

3. Ensure the database exists:
   ```bash
   psql -U your_username -c "SELECT datname FROM pg_database WHERE datname='your_database_name';"
   ```

### Other Common Issues

1. **Port already in use**: Change the PORT in your `.env` file

2. **Missing dependencies**: Run `npm install` again

3. **TypeScript errors**: Run `npm run build` to check for compilation errors

## Implementation Details

### Project Structure

```
xAIM-PTCE/
├── migrations/                # Database migration scripts
│   └── 001-create-ptce-tables.sql
├── src/
│   ├── config/               # Configuration files
│   │   └── config.ts
│   ├── controllers/          # API controllers
│   │   └── ptce-controller.ts
│   ├── routes/               # API routes
│   │   └── ptce-routes.ts
│   ├── scripts/              # Utility scripts
│   │   └── run-migrations.ts
│   ├── services/             # Business logic
│   │   ├── db-service.ts
│   │   ├── model-service.ts
│   │   ├── openai-service.ts
│   │   └── ptce-service.ts
│   ├── types/                # TypeScript type definitions
│   │   └── ptce.types.ts
│   └── index.ts              # Application entry point
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Example environment variables
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project overview
└── HOW_IT_WORKS.md           # This file
```

### Key Components

1. **PTCE Service**: Implements the core PTCE algorithm
2. **OpenAI Service**: Handles interactions with the OpenAI API
3. **Model Service**: Manages model data and database interactions
4. **Database Service**: Provides database access and query execution
5. **PTCE Controller**: Exposes the PTCE functionality through API endpoints

### Database Schema

The implementation uses two main tables:

1. **saved_models**: Stores the 3D models with their attributes
2. **ptce_evaluations**: Records the results of PTCE evaluations

A view called **vw_model_performance** provides aggregated statistics on model performance.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ptce/health` | GET | Check if the service is running |
| `/api/ptce/determine-winner` | POST | Determine winner between two model objects |
| `/api/ptce/determine-winner-detailed` | POST | Determine winner with detailed LLM interactions |
| `/api/ptce/determine-winner-by-ids` | POST | Determine winner between two models by their IDs |
| `/api/ptce/determine-winner-by-ids-detailed` | POST | Determine winner by IDs with detailed LLM interactions |

---

For more detailed information about the PTCE algorithm and methodology, please refer to the [README.md](README.md) file. 