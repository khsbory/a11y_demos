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

### 서버 접속 정보
- **URL**: `http://localhost:5000`
- **포트**: 5000
- **상태**: 정상 실행 시 "serving on port 5000" 메시지 출력

## 주의사항

### 1. 파일 수정 관련
- `server/index.ts` 파일은 Windows 환경에서만 사용하기 위해 `.gitignore`에 추가됨
- 실제 서버 배포 시에는 원본 코드가 사용됨
- 이 파일을 수정해도 git에 커밋되지 않음

### 2. 환경 변수
- Windows에서는 `NODE_ENV=development`가 자동으로 설정되지 않음
- 필요시 수동으로 환경 변수를 설정하거나 코드에서 확인

### 3. 포트 충돌
- 5000번 포트가 이미 사용 중인 경우 다른 포트로 변경 필요
- `server/index.ts` 파일에서 포트 번호 수정 가능

## 대안 방법

### 1. cross-env 패키지 사용 (권장)
```bash
npm install --save-dev cross-env
```
그 후 `package.json`의 dev 스크립트를:
```json
"dev": "cross-env NODE_ENV=development tsx server/index.ts"
```

### 2. Windows용 별도 스크립트 추가
`package.json`에 추가:
```json
"dev:windows": "npx tsx server/index.ts"
```

## 개발 워크플로우

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **서버 시작** (Windows)
   ```bash
   npx tsx server/index.ts
   ```

3. **브라우저에서 확인**
   - `http://localhost:5000` 접속

4. **개발 완료 후**
   - `Ctrl + C`로 서버 중지

## 문제 해결

### 서버가 시작되지 않는 경우
1. 포트 5000이 사용 중인지 확인
2. `netstat -ano | findstr :5000` 명령어로 확인
3. 다른 프로세스 종료 후 재시도

### tsx 명령어를 찾을 수 없는 경우
1. `npx tsx` 사용 (권장)
2. 또는 `npm install -g tsx`로 전역 설치

---

**참고**: 이 문서는 Windows 환경에서의 개발을 위한 가이드입니다. Linux/Mac 환경에서는 `npm run dev` 명령어를 그대로 사용할 수 있습니다. 