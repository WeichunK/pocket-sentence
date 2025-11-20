/**
 * SM-2 Algorithm Implementation
 * 
 * @param quality 0-5 rating (0-2: Fail, 3-5: Pass)
 * @param previousEf Previous Easiness Factor (default 2.5)
 * @param previousRepetitions Previous number of successful repetitions
 * @param previousInterval Previous interval in days
 * @returns New EF, Repetitions, and Interval
 */
export interface SRSResult {
    easinessFactor: number;
    interval: number;
    repetitions: number;
}

export function calculateSM2(
    quality: number,
    previousEf: number = 2.5,
    previousRepetitions: number = 0,
    previousInterval: number = 0
): SRSResult {
    let interval: number;
    let repetitions: number;
    let easinessFactor: number;

    if (quality >= 3) {
        // Correct response
        if (previousRepetitions === 0) {
            interval = 1;
        } else if (previousRepetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(previousInterval * previousEf);
        }
        repetitions = previousRepetitions + 1;
    } else {
        // Incorrect response
        repetitions = 0;
        interval = 1;
    }

    // Calculate new EF
    // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    easinessFactor = previousEf + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // EF cannot go below 1.3
    if (easinessFactor < 1.3) {
        easinessFactor = 1.3;
    }

    return {
        easinessFactor,
        interval,
        repetitions,
    };
}
