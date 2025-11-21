// Analitik hesaplama fonksiyonları

export function calculateNPSScore(responses) {
  if (!responses.length) return 0;
  
  const npsResponses = responses.filter(r => r.nps !== null && r.nps !== undefined);
  if (!npsResponses.length) return 0;
  
  const promoters = npsResponses.filter(r => r.nps >= 9).length;
  const detractors = npsResponses.filter(r => r.nps <= 6).length;
  
  return ((promoters - detractors) / npsResponses.length) * 100;
}

export function calculateAverageSatisfaction(responses) {
  if (!responses.length) return 0;
  
  const validResponses = responses.filter(r => r.overall_score);
  if (!validResponses.length) return 0;
  
  const sum = validResponses.reduce((acc, r) => acc + r.overall_score, 0);
  return sum / validResponses.length;
}

export function groupByChannel(responses) {
  return responses.reduce((acc, r) => {
    acc[r.channel] = (acc[r.channel] || 0) + 1;
    return acc;
  }, {});
}

export function groupByMonth(responses) {
  return responses.reduce((acc, r) => {
    const month = new Date(r.submitted_at).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
}

export function extractKeywords(texts) {
  const stopWords = ['bir', 'bu', 've', 'için', 'ile', 'çok', 'daha', 'gibi'];
  const words = texts
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.includes(w));
  
  const frequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}
