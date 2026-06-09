import { useState } from "react";
import "./App.css";

const API_BASE_URL = "https://skyleaping-structured-bloom-api.hf.space";

const moodOptions = [
  { value: "지침", label: "지침" },
  { value: "답답함", label: "답답함" },
  { value: "산만함", label: "산만함" },
  { value: "무기력함", label: "무기력함" },
];

const timeOptions = [
  { value: "5", label: "5분" },
  { value: "10", label: "10분" },
  { value: "20", label: "20분" },
];

function App() {
  const [mood, setMood] = useState("지침");
  const [time, setTime] = useState("10");
  const [result, setResult] = useState("");
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRecommend = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setResult("");
    setSource("");

    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error("추천 API 요청에 실패했습니다.");
      }

      const data = await response.json();

      setResult(data.recommendation || "추천 결과를 불러오지 못했습니다.");
      setSource(data.source || "openai");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="hero-section">
        <p className="eyebrow">Structured Bloom</p>
        <h1>지금 필요한 작은 회복 활동을 추천합니다</h1>
        <p className="description">
          현재 기분과 사용 가능한 시간을 선택하면, AI API가 바로 실천할 수
          있는 짧은 회복 활동을 추천합니다.
        </p>
      </section>

      <section className="panel">
        <div className="field">
          <h2>현재 기분</h2>
          <div className="options">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={mood === option.value ? "option active" : "option"}
                onClick={() => setMood(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <h2>사용 가능한 시간</h2>
          <div className="options">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={time === option.value ? "option active" : "option"}
                onClick={() => setTime(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="recommend-button"
          onClick={handleRecommend}
          disabled={isLoading}
        >
          {isLoading ? "추천 생성 중..." : "추천받기"}
        </button>
      </section>

      {errorMessage && (
        <section className="result-card error-card">
          <p className="result-label">오류</p>
          <p>{errorMessage}</p>
        </section>
      )}

      {result && (
        <section className="result-card">
          <p className="result-label">추천 결과</p>
          <div className="result-text">
            {result.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          {source && (
            <p className="source-label">
              응답 출처: {source === "openai" ? "OpenAI API" : source}
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;