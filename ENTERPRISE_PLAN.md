# Enterprise Expansion Implementation Plan

## 1. Modernized Folder Structure
To support enterprise-grade features, we will transition to a more granular domain-driven structure.

```text
src/
├── domain/
│   ├── models.ts            # Expanded Core Models
│   ├── scoring.ts           # Scoring Entities
│   ├── governance.ts        # Versioning & Audit Logs
│   └── scheduling.ts        # Slot & Calendar Models
├── engines/
│   ├── rule-engine/         # (Existing) Eligibility
│   ├── scoring-engine/      # Weighted calculation & ranking
│   ├── resume-engine/       # Parsing & Skill Extraction
│   ├── screening-engine/    # Questionnaire evaluation
│   └── analytics-engine/    # Bias detection & Funnel metrics
├── common/
│   ├── explanation/         # Unified Explanation Framework
│   └── events/              # Event Bus / Notification System
└── services/                # Orchestrated Business Logic
```

## 2. Model Extensions (Simplified Schema)

### PlacementDrive (Updated)
- `scoringConfig: WeightConfig[]`
- `preScreeningQuestions: Question[]`
- `versionId: string`
- `isFrozen: boolean`

### WeightConfig
- `attribute: string` (cgpa, skills, etc.)
- `weight: number` (0 to 1)

### Question
- `id: string`, `text: string`, `type: 'MCQ' | 'BOOL'`, `expectedAnswer: any`, `weight: number`

### Application (Updated)
- `compositeScore: number`
- `scoreBreakdown: ScoreExplanation[]`
- `screeningResponses: Response[]`
- `versionBoundTo: string`

## 3. Explanation Framework
A centralized `Explainor` that aggregates outputs from:
1. `RuleEvaluator.evaluate()` -> `RuleEvaluationResult[]`
2. `ScoringEngine.calculate()` -> `ScoreExplanation[]`
3. `ScreeningEngine.evaluate()` -> `QuestionExplanation[]`

## 4. Migration Plan (Non-Breaking)
- Default weights to `0` if undefined.
- Defaults version to `v1` for existing records.
- Preserve existing `eligibilityExplanation` property but wrap it in a `UnifiedExplanation` object.

## 5. Security & Access
- Implement a decorator-based RBAC for services.
- Mock notification system with simple event listeners.
