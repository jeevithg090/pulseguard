import { assessSymptom, assessSymptoms, suggestRelatedSymptoms, toHours } from '../triage';

const entry = (id, severity, duration = 1, unit = 'hours') => ({ id, severity, duration, unit });

describe('toHours', () => {
  it('converts units', () => {
    expect(toHours(2, 'hours')).toBe(2);
    expect(toHours(3, 'days')).toBe(72);
    expect(toHours(1, 'weeks')).toBe(168);
  });
  it('treats invalid values as zero', () => {
    expect(toHours('abc', 'days')).toBe(0);
    expect(toHours(-4, 'days')).toBe(0);
  });
});

describe('assessSymptom', () => {
  it('rates a mild, recent symptom as self-care', () => {
    expect(assessSymptom(entry('headache', 2, 3)).level).toBe('self-care');
  });
  it('escalates severe red-flag symptoms to emergency', () => {
    const result = assessSymptom(entry('chest_pain', 8));
    expect(result.level).toBe('emergency');
    expect(result.reasons.length).toBeGreaterThan(0);
  });
  it('treats moderate red-flag symptoms as urgent', () => {
    expect(assessSymptom(entry('shortness_of_breath', 4)).level).toBe('urgent');
  });
  it('flags long-lasting symptoms for review or urgent care', () => {
    expect(assessSymptom(entry('fever', 2, 2, 'days')).level).toBe('routine');
    expect(assessSymptom(entry('fever', 2, 4, 'days')).level).toBe('urgent');
  });
  it('recommends a routine visit for moderate severity', () => {
    expect(assessSymptom(entry('rash', 5)).level).toBe('routine');
  });
  it('ignores unknown symptom ids', () => {
    expect(assessSymptom(entry('unknown', 10)).level).toBe('self-care');
  });
});

describe('assessSymptoms', () => {
  it('returns self-care with no entries', () => {
    expect(assessSymptoms([]).level).toBe('self-care');
  });
  it('uses the most urgent individual level', () => {
    const { level, flagged } = assessSymptoms([entry('headache', 2), entry('vomiting', 9)]);
    expect(level).toBe('urgent');
    expect(flagged).toEqual(['vomiting']);
  });
  it('treats chest pain with breathlessness as an emergency', () => {
    const { level, reasons } = assessSymptoms([
      entry('chest_pain', 5),
      entry('shortness_of_breath', 5),
    ]);
    expect(level).toBe('emergency');
    expect(reasons.join(' ')).toMatch(/chest pain together/i);
  });
  it('escalates several severe symptoms at once', () => {
    const { level } = assessSymptoms([
      entry('headache', 6),
      entry('nausea', 6),
      entry('fatigue', 6),
    ]);
    expect(level).toBe('urgent');
  });
});

describe('suggestRelatedSymptoms', () => {
  it('suggests related symptoms that are not already selected', () => {
    const suggestions = suggestRelatedSymptoms(['fever']);
    expect(suggestions).toContain('cough');
    expect(suggestions).not.toContain('fever');
  });
  it('ranks symptoms related to several selections first', () => {
    expect(suggestRelatedSymptoms(['chest_pain', 'cough'])[0]).toBe('shortness_of_breath');
  });
  it('respects the limit', () => {
    expect(suggestRelatedSymptoms(['fever', 'nausea'], 2)).toHaveLength(2);
  });
});
