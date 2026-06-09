import json
import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field, field_validator


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY가 .env 파일에 설정되어 있지 않습니다.")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="Structured Bloom API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=800)
    available_time: Optional[str] = None


class Activity(BaseModel):
    title: str
    time: str
    burden: Literal["낮음", "보통", "높음"]
    first_action: str
    steps: List[str]

    @field_validator("burden", mode="before")
    @classmethod
    def normalize_burden(cls, value):
        if value == "중간":
            return "보통"
        return value


class AnalyzeResponse(BaseModel):
    emotion: List[str]
    energy: Literal["low", "medium", "high"]
    situation: str
    goal: Literal[
        "quiet_rest",
        "light_reset",
        "focus_restart",
        "outside_refresh",
        "emotional_comfort",
    ]
    template: Literal[
        "Quiet Rest",
        "Light Reset",
        "Focus Restart",
        "Outside Refresh",
        "Emotional Comfort",
    ]
    background: Literal[
        "soft_room",
        "sunny_window",
        "calm_desk",
        "outside_walk",
        "cozy_evening",
    ]
    color_theme: Literal[
        "calm_blue",
        "soft_beige",
        "fresh_green",
        "clear_gray",
        "warm_pink",
    ]
    flower_theme: Literal[
        "soft_tulip",
        "yellow_bloom",
        "blue_stem",
        "wild_flower",
        "comfort_petal",
    ]
    activity: Activity
    drink: str
    space: str
    clothes: str
    mood_message: str
    reason: str


SYSTEM_PROMPT = """
너는 Structured Bloom이라는 AI 기반 무드 도구 웹 서비스의 분석 엔진이다.

서비스 목적:
- 사용자의 현재 상태 문장을 읽고 감정과 상황을 분석한다.
- 사용자가 직접 선택한 값은 사용 가능한 시간뿐이다.
- 나머지 감정 상태, 에너지 수준, 상황 유형, 회복 목표, 활동 유형, 추천 음료, 추천 공간, 옷차림, 템플릿, 배경, 색상 테마, 꽃 테마는 문맥을 바탕으로 자동 추론한다.
- 의료적 진단이나 심리 상담처럼 말하지 않는다.
- 사용자가 지금 할 수 있는 작고 구체적인 활동을 추천한다.
- 과한 조언이 아니라, 감정과 상황을 정리하고 작은 선택을 돕는 부드러운 무드 도구처럼 응답한다.

반드시 아래 필드를 모두 포함한 JSON만 반환한다.
마크다운, 코드블록, 설명 문장 없이 순수 JSON 객체 하나만 반환한다.

필드 설명:
- emotion: 감정 상태 배열
- energy: low, medium, high 중 하나
- situation: 상황 설명
- goal: quiet_rest, light_reset, focus_restart, outside_refresh, emotional_comfort 중 하나
- template: Quiet Rest, Light Reset, Focus Restart, Outside Refresh, Emotional Comfort 중 하나
- background: soft_room, sunny_window, calm_desk, outside_walk, cozy_evening 중 하나
- color_theme: calm_blue, soft_beige, fresh_green, clear_gray, warm_pink 중 하나
- flower_theme: soft_tulip, yellow_bloom, blue_stem, wild_flower, comfort_petal 중 하나
- activity: title, time, burden, first_action, steps를 포함한 객체
- drink: 추천 음료
- space: 추천 공간
- clothes: 추천 옷차림
- mood_message: 짧은 무드 메시지
- reason: 추천 이유

사용 가능한 시간 available_time을 반드시 반영한다.
예:
- 5min이면 5분 안에 끝나는 아주 짧은 활동
- 10min이면 10분 내외 활동
- 20min이면 20분 내외 활동
- 30min이면 30분 내외 활동
- 1hour이면 1시간 내외 활동
- 2hours이면 2시간 내외 활동
- half_day이면 반나절 활동
- any이면 시간 제한이 적은 활동

template과 flower_theme는 다음 기준으로 맞춘다.
- Quiet Rest: soft_tulip
- Light Reset: yellow_bloom
- Focus Restart: blue_stem
- Outside Refresh: wild_flower
- Emotional Comfort: comfort_petal

추천 톤:
- 사용자를 단정하지 않는다.
- “진단”이라는 표현을 쓰지 않는다.
- “치료”, “우울증”, “불안장애” 같은 의료적 표현을 피한다.
- 실행 가능한 첫 행동을 반드시 제안한다.
- 추천 루틴은 3~5단계로 작성한다.

JSON 예시:
{
  "emotion": ["피로", "과부하"],
  "energy": "low",
  "situation": "장시간 집중 후 회복 필요",
  "goal": "quiet_rest",
  "template": "Quiet Rest",
  "background": "soft_room",
  "color_theme": "calm_blue",
  "flower_theme": "soft_tulip",
  "activity": {
    "title": "10분 조용한 회복",
    "time": "10분",
    "burden": "낮음",
    "first_action": "물 한 잔을 마시고 화면에서 잠시 떨어지기",
    "steps": [
      "조명을 조금 낮추기",
      "따뜻한 물이나 차를 준비하기",
      "10분 동안 눈을 감고 쉬기"
    ]
  },
  "drink": "따뜻한 물",
  "space": "조용한 방",
  "clothes": "압박 없는 편한 옷",
  "mood_message": "지금은 더 하기보다 잠깐 덜어내는 시간이 필요해요.",
  "reason": "입력에서 피로와 정신적 과부하가 나타났고, 사용 가능한 시간이 짧기 때문에 저자극 회복 활동을 추천했습니다."
}
"""


@app.get("/")
def root():
    return {"message": "Structured Bloom API is running"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_mood(request: AnalyzeRequest):
    user_context = {
        "text": request.text,
        "available_time": request.available_time,
    }

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"다음 사용자 입력을 분석해 JSON만 반환해줘: {json.dumps(user_context, ensure_ascii=False)}",
                },
            ],
        )

        raw_text = response.output_text
        parsed = json.loads(raw_text)

        return AnalyzeResponse(**parsed)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI 응답을 JSON으로 변환하지 못했습니다.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"분석 중 오류가 발생했습니다: {str(e)}",
        )