# Predictive Triadic Consensus Engine (PTCE)

## PTCE Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  PREDICTIVE TRIADIC CONSENSUS ENGINE            │
├─────────────┬─────────────────────────────────┬─────────────────┤
│             │                                 │                 │
│  LLM 1      │           LLM 2                 │     LLM 3       │
│ (ChatGPT)   │         (DeepSeek)              │    (Grok)       │
│             │                                 │                 │
│ Creativity  │  Technical Accuracy             │  Performance    │
│             │                                 │                 │
├─────────────┴─────────────────────────────────┴─────────────────┤
│                                                                 │
│                     INTERACTIVE DISCUSSION                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  CONFIDENCE-WEIGHTED CONSENSUS                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                   PREDICTIVE FEATURE VECTORS                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     BAYESIAN REFINEMENT                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Table of Contents
- [Introduction](#introduction)
- [Methodology](#methodology)
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Usage](#usage)
- [Evaluation](#evaluation)
- [Future Work](#future-work)
- [Getting Started](#getting-started)
 
## Introduction

The Predictive Triadic Consensus Engine (PTCE) is an advanced decision-making system that leverages multiple Large Language Models (LLMs) in a collaborative framework to produce more robust and accurate evaluations than any single model could achieve alone. PTCE forms the core of TMOF (Tournament Model Optimization Framework), enhancing the process for determining tournament winners through a structured, multi-model approach.

This repository contains a provisional implementation of the PTCE algorithm, demonstrating its key components and workflow.

## Methodology

PTCE operates on the principle that a diverse ensemble of specialized LLMs working in concert can produce evaluations superior to any individual model. The methodology involves five key phases:

### 1. Specialized Evaluation Criteria

Each LLM in the triadic system is assigned a specific evaluation criterion:

| LLM | Model | Focus Area | Evaluation Criteria |
|-----|-------|------------|---------------------|
| LLM 1 | ChatGPT | Creativity & Originality | Novelty, artistic value, innovation |
| LLM 2 | DeepSeek | Technical Accuracy & Stability | Structural integrity, reliability, robustness |
| LLM 3 | Grok | Performance & Functionality | Effectiveness in simulated scenarios, practical utility |

### 2. Initial Evaluation

Each LLM independently assesses the input models based on its specialized criteria, providing:
- A numerical score (scaled to a common metric)
- Detailed reasoning for the score
- A confidence score reflecting certainty in the evaluation

### 3. Interactive Discussion

The LLMs engage in a simulated discussion, sharing their evaluations and potentially revising their assessments based on peer feedback. This collaborative process is designed to:
- Identify and resolve disagreements
- Leverage the strengths of each specialized model
- Produce more robust final evaluations

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  LLM 1 (ChatGPT)│     │ LLM 2 (DeepSeek)│     │  LLM 3 (Grok)   │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     INITIAL EVALUATIONS                         │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  VARIANCE CALCULATION                           │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
┌─────────────────────────┐         ┌─────────────────────────────┐
│                         │         │                             │
│  HIGH DISAGREEMENT      │         │  AGREEMENT ACHIEVED         │
│  (Variance > Threshold) │         │  (Variance <= Threshold)    │
│                         │         │                             │
└────────────┬────────────┘         └─────────────────────────────┘
             │                                     │
             ▼                                     │
┌─────────────────────────┐                        │
│                         │                        │
│  ADDITIONAL DISCUSSION  │                        │
│  ROUND                  │                        │
│                         │                        │
└────────────┬────────────┘                        │
             │                                     │
             └─────────────────┬───────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     FINAL EVALUATIONS                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Consensus Building and Aggregation

After the discussion phase, final scores are aggregated using confidence-weighted averaging:

```
Wi = Si × Ci  (Weighted score for LLM i)
S = ∑Wi / ∑Ci  (Consensus score)
```

Where:
- Si is the score from LLM i
- Ci is the confidence score from LLM i
- Wi is the weighted score

### 5. Predictive Feature Integration

Beyond present evaluation, PTCE incorporates predictive elements to forecast future performance:
- Each LLM generates a feature vector predicting future outcomes
- A meta-model (neural network) combines these predictions with confidence weighting
- Bayesian inference refines the consensus with prior knowledge

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       INPUT PROCESSING                          │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     INITIAL EVALUATION                          │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   INTERACTIVE DISCUSSION                        │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    CONSENSUS BUILDING                           │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  PREDICTIVE INTEGRATION                         │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   WINNER DETERMINATION                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The PTCE system follows a sequential workflow:

1. **Input Processing**: Models to be evaluated are prepared and formatted
2. **Initial Evaluation**: Each LLM evaluates independently
3. **Interactive Discussion**: LLMs share and refine evaluations
4. **Consensus Building**: Weighted aggregation of final scores
5. **Predictive Integration**: Future performance prediction
6. **Winner Determination**: Final decision with confidence score

## Implementation Details

The current implementation is provisional and simulates the core PTCE logic. Key components include:

### Main Process Flow

```javascript
// 1. Initial Evaluation Phase
const evaluations = await performInitialEvaluations(model1, model2);

// 2. Interactive Discussion Phase
const discussionResults = await facilitateInteractiveDiscussion(evaluations);

// 3. Consensus Building and Aggregation
const consensusScores = calculateConsensusScores(discussionResults);

// 4. Predictive Feature Integration
const predictiveOutcomes = await generatePredictiveOutcomes(model1, model2, consensusScores);

// 5. Final Winner Determination
const winner = determineWinner(model1, model2, consensusScores, predictiveOutcomes);
```

### Key Functions

| Function | Purpose | Mathematical Basis |
|----------|---------|-------------------|
| `performInitialEvaluations()` | Each LLM evaluates models independently | Individual scoring algorithms |
| `facilitateInteractiveDiscussion()` | LLMs review and possibly revise evaluations | Variance threshold detection |
| `calculateConsensusScores()` | Aggregates evaluations with confidence weighting | S = ∑Wi / ∑Ci |
| `generatePredictiveOutcomes()` | Creates feature vectors for future prediction | Poutcome = NN(∑Ci × Fi) |
| `determineWinner()` | Makes final determination with Bayesian refinement | P(Ai\|Si,Ci) = P(Si,Ci\|Ai) × P(Ai) / P(Si,Ci) |

### Conflict Resolution

The system detects high disagreement between LLMs by calculating the variance of their scores:
- If variance exceeds a threshold (e.g., 2), additional discussion rounds are triggered
- Evaluations converge toward consensus through iterative refinement
- Confidence scores increase after successful discussion rounds

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     INITIAL EVALUATIONS                         │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  CALCULATE VARIANCE                             │
│                                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
┌─────────────────────────┐         ┌─────────────────────────────┐
│                         │         │                             │
│  VARIANCE > THRESHOLD   │         │  VARIANCE <= THRESHOLD      │
│                         │         │                             │
└────────────┬────────────┘         └─────────────┬───────────────┘
             │                                    │
             ▼                                    │
┌─────────────────────────┐                       │
│                         │                       │
│  ADJUST SCORES TOWARD   │                       │
│  MEAN                   │                       │
│                         │                       │
└────────────┬────────────┘                       │
             │                                    │
             ▼                                    │
┌─────────────────────────┐                       │
│                         │                       │
│  INCREASE CONFIDENCE    │                       │
│  SCORES                 │                       │
│                         │                       │
└────────────┬────────────┘                       │
             │                                    │
             └─────────────────┬──────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     FINAL EVALUATIONS                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Usage

This is a provisional implementation of PTCE. To integrate it into your project:

1. Ensure you have proper API access to the LLMs (currently using OpenAI API)
2. Initialize the models to be evaluated with the required attributes
3. Call the PTCE evaluation endpoint with the models to compare
4. Process the response containing the winner and detailed scoring information

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ptce/health` | GET | Check if the service is running |
| `/api/ptce/determine-winner` | POST | Determine winner between two model objects |
| `/api/ptce/determine-winner-detailed` | POST | Determine winner with detailed LLM interactions |
| `/api/ptce/determine-winner-by-ids` | POST | Determine winner between two models by their IDs |
| `/api/ptce/determine-winner-by-ids-detailed` | POST | Determine winner by IDs with detailed LLM interactions |

### Example API Response

```json
{
  "matchId": "550e8400-e29b-41d4-a716-446655440000",
  "winner": {
    "id": "model123",
    "name": "ChampionModel"
  },
  "scores": {
    "model123": 8.7,
    "model456": 7.9
  },
  "confidence": 0.85,
  "reasoning": "Initial disagreement detected (variance: model1=1.25, model2=1.75). After discussion, the evaluations were refined."
}
```

### OpenAI API Compatibility

The current implementation uses OpenAI's API for all three LLM roles. It requires a model that supports the JSON response format. By default, it uses `gpt-4o-mini`. If you want to use a different model, you may need to modify the `openai-service.ts` file.

For detailed setup and testing instructions, please refer to the [HOW_IT_WORKS.md](HOW_IT_WORKS.md) file.

## Evaluation

The PTCE system will be evaluated through several experiments:

1. **Comparison with Individual LLMs**: Testing PTCE against each LLM's individual performance
2. **Comparison with Simple Averaging**: Measuring improvement over basic averaging without weighting
3. **Conflict Resolution Efficacy**: Assessing how well the system handles disagreements
4. **Predictive Accuracy**: Evaluating forecasting capability with F1 score metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  EXPECTED PERFORMANCE COMPARISON                │
│                                                                 │
├─────────────────┬─────────────────────────────┬─────────────────┤
│                 │                             │                 │
│  Individual LLM │      Simple Averaging       │      PTCE       │
│                 │                             │                 │
├─────────────────┼─────────────────────────────┼─────────────────┤
│                 │                             │                 │
│     Baseline    │        +5-10% Gain          │   +15-20% Gain  │
│                 │                             │                 │
└─────────────────┴─────────────────────────────┴─────────────────┘
```

Based on theoretical analysis, we anticipate PTCE to demonstrate approximately 15% improvement in accuracy over individual LLMs.

## Future Work

This implementation is provisional and several enhancements are planned:

- Integration with actual LLM APIs rather than simulated responses
- Training of the neural network for predictive outcomes on real tournament data
- Development of a more sophisticated Bayesian inference layer for refinement
- Implementation of an adaptive confidence threshold for discussion triggering
- Enhanced visualization of the decision-making process for transparency

## Getting Started

For detailed instructions on how to set up, run, and test the PTCE implementation, please refer to the [HOW_IT_WORKS.md](HOW_IT_WORKS.md) file. This guide provides step-by-step instructions for:

- Setting up the development environment
- Configuring the necessary API keys
- Running the database migrations
- Testing the API endpoints
- Troubleshooting common issues

---

<div align="center">
  <p>Predictive Triadic Consensus Engine (PTCE)</p>
  <p><em>A Next-Generation Multi-LLM Collaborative Decision System</em></p>
</div>
