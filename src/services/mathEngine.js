/**
 * Math Engine - Infinite Level & Question Generator with Adaptive Difficulty
 */

export function generateQuestion(level, streak = 0, adaptiveFactor = 1.0) {
  // Effective level combining stage level and adaptive difficulty
  const effectiveLevel = Math.max(1, Math.round(level * adaptiveFactor));

  let type = 'add';
  const rand = Math.random();

  if (effectiveLevel <= 5) {
    type = rand < 0.6 ? 'add' : 'sub';
  } else if (effectiveLevel <= 12) {
    if (rand < 0.35) type = 'add';
    else if (rand < 0.65) type = 'sub';
    else type = 'mul';
  } else if (effectiveLevel <= 22) {
    if (rand < 0.25) type = 'add';
    else if (rand < 0.45) type = 'sub';
    else if (rand < 0.75) type = 'mul';
    else type = 'div';
  } else if (effectiveLevel <= 35) {
    if (rand < 0.15) type = 'add';
    else if (rand < 0.30) type = 'sub';
    else if (rand < 0.50) type = 'mul';
    else if (rand < 0.70) type = 'div';
    else if (rand < 0.85) type = 'algebra';
    else type = 'exponents';
  } else {
    // Level 36+: Advanced Math (Algebra, Exponents/Roots, Percentages/Fractions, Multi-Op Blitz)
    if (rand < 0.10) type = 'add';
    else if (rand < 0.20) type = 'sub';
    else if (rand < 0.35) type = 'mul';
    else if (rand < 0.50) type = 'div';
    else if (rand < 0.65) type = 'algebra';
    else if (rand < 0.80) type = 'exponents';
    else if (rand < 0.90) type = 'percent';
    else type = 'blitz';
  }

  let num1, num2, answer, promptText, difficultyScore;

  switch (type) {
    case 'add': {
      const maxVal = Math.min(150, 10 + effectiveLevel * 4);
      num1 = Math.floor(Math.random() * maxVal) + 1;
      num2 = Math.floor(Math.random() * maxVal) + 1;
      answer = num1 + num2;
      promptText = `${num1} + ${num2}`;
      difficultyScore = Math.round(10 + Math.sqrt(num1 + num2) * 2);
      break;
    }

    case 'sub': {
      const maxVal = Math.min(150, 10 + effectiveLevel * 4);
      const valA = Math.floor(Math.random() * maxVal) + 5;
      const valB = Math.floor(Math.random() * maxVal) + 1;
      num1 = Math.max(valA, valB);
      num2 = Math.min(valA, valB);
      answer = num1 - num2;
      promptText = `${num1} − ${num2}`;
      difficultyScore = Math.round(12 + Math.sqrt(num1) * 2);
      break;
    }

    case 'mul': {
      const maxMultiplier = Math.min(20, 3 + Math.floor(effectiveLevel / 2.5));
      num1 = Math.floor(Math.random() * maxMultiplier) + 2;
      num2 = Math.floor(Math.random() * maxMultiplier) + 2;
      answer = num1 * num2;
      promptText = `${num1} × ${num2}`;
      difficultyScore = Math.round(25 + (num1 * num2) / 5);
      break;
    }

    case 'div': {
      // Division MUST produce whole numbers
      const maxDivisor = Math.min(15, 2 + Math.floor(effectiveLevel / 3.5));
      num2 = Math.floor(Math.random() * maxDivisor) + 2; // divisor
      const maxQuotient = Math.min(20, 3 + Math.floor(effectiveLevel / 3));
      answer = Math.floor(Math.random() * maxQuotient) + 2; // target quotient
      num1 = num2 * answer; // dividend
      promptText = `${num1} ÷ ${num2}`;
      difficultyScore = Math.round(35 + answer * 2);
      break;
    }

    case 'algebra': {
      // e.g., X + 15 = 40 or 3X = 27 or X - 8 = 14
      const algType = Math.random();
      if (algType < 0.4) {
        // X + A = B
        const a = Math.floor(Math.random() * (12 + effectiveLevel)) + 5;
        answer = Math.floor(Math.random() * (18 + effectiveLevel)) + 2;
        const b = answer + a;
        promptText = `X + ${a} = ${b}`;
      } else if (algType < 0.7) {
        // X - A = B
        const a = Math.floor(Math.random() * (12 + effectiveLevel)) + 3;
        answer = Math.floor(Math.random() * (18 + effectiveLevel)) + 5;
        const b = answer - a;
        promptText = `X − ${a} = ${b}`;
      } else {
        // kX = B
        const k = Math.floor(Math.random() * 6) + 2;
        answer = Math.floor(Math.random() * 12) + 2;
        const b = k * answer;
        promptText = `${k}X = ${b}`;
      }
      difficultyScore = Math.round(50 + effectiveLevel * 1.5);
      break;
    }

    case 'exponents': {
      // Powers or Square Roots
      const isSqrt = Math.random() < 0.5;
      if (isSqrt) {
        // Square Root: √64 = 8
        answer = Math.floor(Math.random() * 12) + 3; // 3 to 14
        const sq = answer * answer;
        promptText = `√${sq}`;
        difficultyScore = Math.round(45 + answer * 3);
      } else {
        // Powers: 2^4 = 16 or 5^2 = 25 or 3^3 = 27
        const baseOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];
        let exp = 2;
        if (base === 2) exp = Math.floor(Math.random() * 4) + 3; // 2^3 to 2^6
        else if (base === 3) exp = Math.floor(Math.random() * 3) + 2; // 3^2 to 3^4
        else exp = 2; // X^2
        answer = Math.pow(base, exp);
        promptText = `${base}<sup>${exp}</sup>`;
        difficultyScore = Math.round(50 + answer / 4);
      }
      break;
    }

    case 'percent': {
      // Percentages: e.g. 20% of 150 = 30 or 50% of 80 = 40
      const percentages = [10, 20, 25, 50, 75];
      const p = percentages[Math.floor(Math.random() * percentages.length)];
      const multiplier = Math.floor(Math.random() * 12) + 2;
      let baseVal;
      if (p === 25 || p === 75) baseVal = multiplier * 4;
      else if (p === 20) baseVal = multiplier * 5;
      else baseVal = multiplier * 10;
      answer = (p / 100) * baseVal;
      promptText = `${p}% of ${baseVal}`;
      difficultyScore = Math.round(55 + p);
      break;
    }

    case 'blitz': {
      // Speed Blitz Multi-Op: (A × B) ± C or (A + B) × C
      const op = Math.random();
      if (op < 0.5) {
        // (A × B) + C
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 20) + 1;
        answer = (a * b) + c;
        promptText = `(${a} × ${b}) + ${c}`;
      } else {
        // (A + B) × C
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        answer = (a + b) * c;
        promptText = `(${a} + ${b}) × ${c}`;
      }
      difficultyScore = Math.round(65 + effectiveLevel * 2);
      break;
    }
  }

  // Generate 4 multiple choice options (including correct answer)
  const choices = generateChoices(answer);

  return {
    id: Date.now() + Math.random(),
    type,
    promptText,
    answer,
    choices,
    difficultyScore,
    effectiveLevel
  };
}

/**
 * Generates 4 distractor choices around the correct answer
 */
function generateChoices(answer) {
  const options = new Set([answer]);

  const offsets = [-1, 1, -2, 2, -10, 10, -5, 5, -3, 3];
  
  // Shuffle offsets
  offsets.sort(() => Math.random() - 0.5);

  for (const offset of offsets) {
    if (options.size >= 4) break;
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      options.add(candidate);
    }
  }

  // Fallback random choices if set not full
  let attempts = 0;
  while (options.size < 4 && attempts < 20) {
    attempts++;
    const r = answer + (Math.floor(Math.random() * 15) - 7);
    if (r >= 0) options.add(r);
  }

  // Return shuffled array of options
  return Array.from(options).sort(() => Math.random() - 0.5);
}

/**
 * Calculates score earned based on difficulty, time remaining, and combo state
 */
export function calculateScore(baseDifficulty, timeRemaining, isFireMode) {
  const timeBonus = Math.round(timeRemaining * 1.5);
  const total = (baseDifficulty + timeBonus) * (isFireMode ? 2 : 1);
  return {
    totalPoints: total,
    timeBonus,
    baseDifficulty
  };
}
