# Spaced Repetition Algorithm (SM-2)

Pocket Sentence uses the **SM-2 Algorithm** to schedule reviews. This algorithm is designed to calculate the optimal interval between reviews to maximize retention.

## Core Concepts

1.  **Easiness Factor (EF)**: A multiplier representing how easy a sentence is for the user. Starts at 2.5.
2.  **Repetitions (n)**: The number of consecutive times the user has successfully recalled the sentence.
3.  **Interval (I)**: The number of days until the next review.

## The Algorithm

When a user reviews a sentence, they rate their recall quality on a scale of 0-5 (mapped to UI buttons):

-   **Easy (5)**: Perfect response, no hesitation.
-   **Good (4)**: Correct response, some hesitation.
-   **Hard (3)**: Correct response, significant difficulty.
-   **Fail (0-2)**: Incorrect response.

### Calculation Steps

1.  **Update Interval (I)**:
    -   If Quality < 3 (Fail):
        -   Interval = 1 day
        -   Repetitions = 0
    -   If Quality >= 3 (Pass):
        -   If Repetitions = 0: Interval = 1 day
        -   If Repetitions = 1: Interval = 6 days
        -   If Repetitions > 1: Interval = Previous Interval * Previous EF

2.  **Update Easiness Factor (EF)**:
    -   New EF = Previous EF + (0.1 - (5 - Quality) * (0.08 + (5 - Quality) * 0.02))
    -   The minimum EF is 1.3.

3.  **Update Repetitions**:
    -   If Pass: Repetitions = Previous Repetitions + 1
    -   If Fail: Repetitions = 0

## Implementation Details

-   **Code**: `src/lib/srs.ts`
-   **Database**: `learning_records` table stores `easiness_factor`, `interval_days`, and `repetitions`.
