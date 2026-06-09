import { useState } from "react";
import "./App.css";

const templateLabels = {
  "Quiet Rest": "조용한 회복",
  "Light Reset": "가벼운 전환",
  "Focus Restart": "다시 집중",
  "Outside Refresh": "바깥 환기",
  "Emotional Comfort": "마음 달래기",
};

const flowerThemeLabels = {
  soft_tulip: "연한 튤립",
  yellow_bloom: "작은 노란 꽃",
  blue_stem: "푸른 줄기 꽃",
  wild_flower: "바람결 들꽃",
  comfort_petal: "포근한 꽃잎",
};

const energyLabels = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

const timeOptions = [
  { value: "5min", label: "5분" },
  { value: "10min", label: "10분" },
  { value: "20min", label: "20분" },
  { value: "30min", label: "30분" },
  { value: "1hour", label: "1시간" },
  { value: "2hours", label: "2시간" },
  { value: "half_day", label: "반나절" },
  { value: "any", label: "상관없음" },
];

function App() {
  const [text, setText] = useState("");
  const [availableTime, setAvailableTime] = useState("20min");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMood = async () => {
    if (!text.trim()) {
      alert("지금 상태를 한 문장 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://skyleaping-structured-bloom-api.hf.space/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          available_time: availableTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "분석 요청에 실패했습니다.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const themeClass = result ? `theme-${result.color_theme}` : "theme-default";
  const flowerClass = result
    ? `flower-${result.flower_theme}`
    : "flower-default";

  return (
    <main className={`page ${themeClass} ${flowerClass}`}>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">mood tools · soft systems · quiet build</p>
          <h1>Structured Bloom</h1>
          <p className="subtitle">
            감정과 상황을 정리해 오늘 할 수 있는 작은 회복 행동을 추천합니다.
          </p>

          <div className="hero-points">
            <span>AI 감정·상황 분석</span>
            <span>시간 기반 추천</span>
            <span>무드 카드 자동 구성</span>
          </div>
        </div>

        <div className="visual-card">
          <div className="soft-flower" aria-hidden="true">
            <span className="petal petal-1"></span>
            <span className="petal petal-2"></span>
            <span className="petal petal-3"></span>
            <span className="stem"></span>
            <span className="leaf leaf-1"></span>
            <span className="leaf leaf-2"></span>
          </div>

          <h2>입력은 가볍게, 추천은 구체적으로.</h2>
          <p>
            현재 상태와 사용 가능한 시간만 입력하면 AI가 감정, 상황, 추천
            활동을 카드로 구성합니다.
          </p>
        </div>
      </section>

      <section className="input-section">
        <div className="input-card">
          <div className="card-heading">
            <span className="step-badge">01</span>
            <div>
              <h2>오늘의 상태를 적어주세요</h2>
              <p>
                정리되지 않은 문장이어도 괜찮아요. 시간만 선택하면 나머지는
                AI가 자동으로 정리합니다.
              </p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="예: 오늘 너무 지치고 머리가 복잡해. 쉬어야 하는데 뭘 해야 할지 모르겠어."
          />

          <div className="time-section">
            <p className="section-label">사용 가능한 시간</p>
            <div className="chip-group">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`chip-button ${
                    availableTime === option.value ? "active" : ""
                  }`}
                  onClick={() => setAvailableTime(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={analyzeMood}
            disabled={loading}
          >
            {loading ? "AI가 정리하는 중..." : "AI가 무드 카드 추천하기"}
          </button>
        </div>
      </section>

      <section className="result-section">
        {!result && (
          <div className="empty-result">
            <span>02</span>
            <h2>분석 결과가 여기에 표시됩니다</h2>
            <p>
              현재 상태를 입력하면 AI가 감정, 에너지, 상황을 정리하고 오늘의
              무드 카드를 구성합니다.
            </p>
          </div>
        )}

        {result && (
          <>
            <div className="analysis-summary">
              <div className="section-title">
                <span>02</span>
                <div>
                  <h2>AI가 정리한 오늘의 상태</h2>
                  <p>입력 문장을 바탕으로 현재 상태를 간단히 요약했습니다.</p>
                </div>
              </div>

              <div className="summary-grid">
                <div>
                  <strong>감정 상태</strong>
                  <p>{result.emotion.join(" · ")}</p>
                </div>

                <div>
                  <strong>에너지</strong>
                  <p>{energyLabels[result.energy] || result.energy}</p>
                </div>

                <div>
                  <strong>상황</strong>
                  <p>{result.situation}</p>
                </div>

                <div>
                  <strong>추천 방향</strong>
                  <p>
                    {templateLabels[result.template] || result.template} ·{" "}
                    {flowerThemeLabels[result.flower_theme] || "꽃 테마"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mood-result">
              <div className="section-title">
                <span>03</span>
                <div>
                  <h2>오늘의 무드 카드</h2>
                  <p>
                    시간과 상태에 맞춰 바로 실행할 수 있는 작은 행동을
                    추천합니다.
                  </p>
                </div>
              </div>

              <div className="mood-card">
                <div className="mood-card-top">
                  <p className="template-name">
                    {templateLabels[result.template] || result.template}
                  </p>
                  <h3>{result.activity.title}</h3>
                  <p className="message">{result.mood_message}</p>
                </div>

                <div className="meta">
                  <span>소요 시간: {result.activity.time}</span>
                  <span>부담감: {result.activity.burden}</span>
                </div>

                <div className="small-choices">
                  <p>
                    <strong>마실 것</strong>
                    <span>{result.drink}</span>
                  </p>

                  <p>
                    <strong>공간</strong>
                    <span>{result.space}</span>
                  </p>

                  <p>
                    <strong>옷차림</strong>
                    <span>{result.clothes}</span>
                  </p>
                </div>

                <div className="steps">
                  <strong>추천 루틴</strong>
                  <ol>
                    {result.activity.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="first-action">
                  첫 행동: {result.activity.first_action}
                </div>

                <p className="reason">{result.reason}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default App;