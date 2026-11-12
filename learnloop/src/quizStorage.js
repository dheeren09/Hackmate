const STORAGE_KEY = "learnloop_quiz_results";

export function getQuizResults() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveQuizResult(result) {
  const results = getQuizResults();

  results.push({
    ...result,
    id: Date.now(),
    submittedAt: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  window.dispatchEvent(new Event("learnloop-results-updated"));
}