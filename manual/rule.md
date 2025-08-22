# Windows 환경에서 서버 시작 방법

## 개요
이 프로젝트는 Windows 환경에서 서버를 시작할 때 특별한 명령어를 사용해야 합니다.

## 문제점
Windows PowerShell에서는 `npm run dev` 명령어가 정상적으로 작동하지 않습니다.

### 오류 메시지
```
'NODE_ENV' is not recognized as an internal or external command,
operable program or batch file.
```

### 원인
- `package.json`의 dev 스크립트: `"NODE_ENV=development tsx server/index.ts"`
- Windows PowerShell에서는 `NODE_ENV=development` 환경 변수 설정 방식이 지원되지 않음
- Linux/Mac 환경에서는 정상 작동하지만 Windows에서는 작동하지 않음

## 해결 방법

### Windows에서 서버 시작 명령어
```bash
npx tsx server/index.ts
```

#코드 가이드
모든 텍스트는 다 영어로 작성합니다. 이는 해당 페이지가 영문 페이지이기 때문입니다.