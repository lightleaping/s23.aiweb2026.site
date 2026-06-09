# Structured Bloom

Structured Bloom은 사용자의 현재 기분과 사용 가능한 시간을 바탕으로  
가볍게 실천할 수 있는 회복 활동을 추천하는 웹 서비스입니다.

## 1. Project Overview

현대인은 쉬어야 한다는 것을 알면서도, 막상 시간이 생기면 무엇을 해야 할지 모르는 경우가 많습니다.  
Structured Bloom은 사용자가 현재의 기분과 여유 시간을 선택하면, 상황에 맞는 작은 회복 활동을 추천해주는 서비스입니다.

이 프로젝트는 AI웹융합 과제용 MVP로 제작되었으며, 복잡한 입력 없이 간단한 선택만으로 사용자에게 맞는 활동을 제안하는 것을 목표로 합니다.

## 2. Main Concept

Structured Bloom의 핵심은 사용자가 직접 복잡한 계획을 세우지 않아도 된다는 점입니다.

사용자는 현재 상태와 가능한 시간만 선택합니다.  
서비스는 그 조건을 바탕으로 다음과 같은 활동을 추천합니다.

- 짧은 휴식
- 가벼운 정리
- 감각 전환
- 간단한 움직임
- 생각 비우기
- 집중 회복

## 3. Key Features

| Feature | Description |
|---|---|
| Mood Selection | 현재 기분이나 상태를 선택합니다. |
| Time Selection | 사용 가능한 시간을 선택합니다. |
| Activity Recommendation | 입력 조건에 맞는 활동을 추천합니다. |
| Simple Result UI | 추천 결과를 카드 형태로 보여줍니다. |
| Responsive UI | PC와 모바일 화면에서 사용할 수 있도록 구성했습니다. |

## 4. Workflow

```txt
User Input
  ↓
Mood / Time Selection
  ↓
Condition Matching
  ↓
Activity Recommendation
  ↓
Result Card Display
```

## 5. Tech Stack

| Category | Stack |
|---|---|
| Frontend | React, JavaScript, CSS, Vite |
| Backend | Python, FastAPI |
| Introduction Page | HTML, CSS, zero-md |
| Deployment | GitHub, s23.aiweb2026.site |
| Version Control | Git, GitHub |

## 6. Project Structure

```txt
structured-bloom/
├── backend/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── contents.md
```

## 7. How to Run

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Local URL:

```txt
http://localhost:5173
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

백엔드 실행 파일명은 실제 프로젝트 구조에 따라 다를 수 있습니다.

## 8. AI Usage and Future Expansion

현재 MVP는 사용자의 선택값을 기준으로 사전에 구성된 추천 데이터를 반환하는 방식입니다.  
즉, 현재 버전에서는 외부 AI API를 필수로 사용하지 않고, 추천 서비스의 기본 흐름을 먼저 구현했습니다.

향후에는 다음과 같은 AI 기능으로 확장할 수 있습니다.

- 사용자의 감정 상태에 맞는 자연어 추천 문장 생성
- 사용자의 이전 선택 기록을 기반으로 한 개인화 추천
- 활동 완료 후 피드백 분석
- 감정 변화 흐름 분석
- 상황별 회복 루틴 자동 생성

## 9. Service URL

https://s23.aiweb2026.site

## 10. My Role

- 서비스 아이디어 기획
- 사용자 입력 구조 설계
- 추천 결과 데이터 구성
- React 기반 화면 구현
- CSS 기반 UI 디자인
- FastAPI 백엔드 구조 구성
- GitHub 업로드 및 과제 제출용 문서 정리

## 11. Limitations

현재 버전은 MVP 단계이기 때문에 다음과 같은 한계가 있습니다.

- 실제 사용자 기록 저장 기능은 포함하지 않았습니다.
- 추천 결과는 사전 정의된 데이터 기반으로 제공됩니다.
- 실제 LLM 또는 감정 분석 모델은 아직 연동하지 않았습니다.
- 로그인, 데이터베이스, 장기 기록 분석 기능은 포함하지 않았습니다.

## 12. Future Improvements

- 사용자 기록 저장 기능 추가
- 활동 완료 여부 체크 기능 추가
- 감정 변화 시각화
- LLM 기반 추천 문장 생성
- 모바일 웹앱 형태로 확장
- 개인별 회복 루틴 추천 기능 추가

## 13. Project Summary

Structured Bloom은 사용자의 기분과 여유 시간을 바탕으로 작고 실천 가능한 회복 활동을 추천하는 웹 서비스입니다.

이 프로젝트는 AI웹융합 과제용 MVP로, 사용자의 상태 입력을 기반으로 추천 결과를 제공하는 웹 서비스 구조를 구현하는 데 목적이 있습니다. 현재는 규칙 기반 추천 구조이지만, 향후 AI 모델이나 LLM을 연동하여 개인화된 감정 기반 추천 서비스로 확장할 수 있습니다.
