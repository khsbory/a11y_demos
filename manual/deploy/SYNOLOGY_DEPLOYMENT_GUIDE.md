# 🚀 Synology NAS Next.js Docker Deployment Guide (Version-Based)

이 가이드는 **Docker Hub**를 활용하여 시놀로지 NAS에 Next.js 프로젝트를 안전하게 배포하고, **버전 관리**를 통해 상시 롤백 가능한 환경을 구축하는 방법을 설명합니다.

---

## 📂 필수 파일 (manual/deploy 폴더 내)

1.  **`deploy_to_synology.py`**: 메인 배포 스크립트 (이미지 Pull & Blue/Green 배포)
2.  **`docker-compose.db.yml`**: 데이터베이스 전용 스택 설정
3.  **`docker-compose.prod.yml`**: 애플리케이션 서비스 스택 설정
4.  **`fetch_logs.py`**: 도커 로그 확인 도구
5.  **`list_tags.py`**: 도커 허브 태그 목록 확인 도구 [NEW]
6.  **`check_live_status.py`**: 실서버 응답 코드 검증 도구 [NEW]
7.  **`SYNOLOGY_DEPLOYMENT_GUIDE.md`**: 본 배포 가이드

---

## 🚀 배포 워크플로우 (권장 지침)

실수 없는 배포와 안정적인 운영을 위해 모든 배포는 **날짜 기반 버전 태그**를 사용하는 것을 원칙으로 합니다.

### 1단계: 기존 태그 확인 및 버전 결정 (필수)
이미 존재하는 태그를 덮어쓰지 않도록 최신 태그 목록을 먼저 조회합니다.

```powershell
# 고유한 버전명(vYYYYMMDD-순번) 결정을 위해 현재 태그 조회
python manual/deploy/list_tags.py
```

### 2단계: 로컬에서 이미지 빌드 및 버전 태깅
`latest`와 함께 결정된 고유 태그를 생성하여 푸시합니다.

```powershell
# 1. 이미지 빌드 (로컬)
docker build -t khsruru/mynote-app:latest .

# 2. 버전 태그 생성 (관례: vYYYYMMDD-순번)
# 예: 2026년 1월 6일 첫 번째 빌드
docker tag khsruru/mynote-app:latest khsruru/mynote-app:v20260106-1

# 3. Docker Hub로 두 태그 모두 푸시
docker push khsruru/mynote-app:latest
docker push khsruru/mynote-app:v20260106-1
```

### 3단계: NAS에 특정 버전 배포 실행
배포 스크립트 실행 시 `--tag` 인자를 사용하여 배포할 버전을 명시합니다.

```bash
# 특정 버전 배포 실행 (권장 방식)
python manual/deploy/deploy_to_synology.py --tag v20260106-1
```

> [!TIP]
> 태그를 생략하면 기본적으로 `latest`가 배포되지만, 운영 환경에서는 명확한 버전 추적을 위해 항상 태그를 지정하십시오.

---

## 🛠️ 운영 및 롤백 가이드

### 1. 롤백(Rollback) 절차
배포 후 장애가 발견되면, 이전 안정 버전의 태그로 즉시 재배포를 수행하여 서비스를 복구합니다.
```bash
# 예: 어제 버전(v20260105-1)으로 즉시 롤백
python manual/deploy/deploy_to_synology.py --tag v20260105-1
```

### 2. 배포 후 최종 검증 (필수)
배포가 완료된 후에는 반드시 로컬 이미지와 NAS의 이미지가 동일한지 **다이제스트(Digest)**를 통해 확인해야 합니다.

```bash
# 로컬에서 다이제스트 확인
docker images --digests khsruru/mynote-app:latest
```

결과 예시의 `sha256:0e93b8d2...` 값이 NAS의 실행 중인 컨테이너 정보와 일치하는지 대조하십시오.

### 3. 실서버 응답 코드 테스트 (필수)
Nginx 포트 전환이 정상적으로 이루어졌는지, 502 에러가 발생하지 않는지 코드로 검증합니다.

```bash
# 메인 및 설정 페이지 응답 코드 확인 (200 OK 확인 필수)
python manual/deploy/check_live_status.py
```

---



 
 ---
 
## ⚠️ 주의사항: Prisma 및 빌드 정합성 유지

Next.js **Standalone** 빌드는 빌드 시점에 Prisma Client의 메타데이터(DMMF)를 코드 내부에 포함시킵니다. 따라서 아래 순서를 반드시 지켜야 합니다.

1.  **스키마 동기화 최우선**: `schema.prisma` 수정 후에는 반드시 로컬에서 `npx prisma generate`를 먼저 실행하십시오.
2.  **순차 빌드 강제**: 
    - `npx prisma generate` → `npm run build` → `docker build` 순서를 엄격히 준수하십시오.
3.  **Standalone의 특성 이해**: 컨테이너가 뜬 후에 `node_modules` 내부 파일을 수정하거나 재생성해도, 이미 컴파일된 Next.js 서버 코드에는 반영되지 않습니다. 반드시 **새로운 이미지 빌드**가 필요합니다.
4.  **클린 빌드 권장**: 스키마 에러 발생 시 부차적인 조치(컨테이너 내 명령어 실행 등)보다 로컬에서 모든 결과물을 삭제(`rm -rf .next`)하고 처음부터 다시 빌드하는 것이 가장 확실합니다.

---

 ## ⚙️ 설정 수정 (`deploy_to_synology.py`)

새 프로젝트를 배포하려면 스크립트 상단의 **Configuration** 섹션만 수정하면 됩니다.

```python
# Configuration
PROJECT_NAME = 'consulting'
REMOTE_BASE_DIR = '/volume1/docker/projects/consulting'
DOMAIN_NAME = 'consulting.khsruru.com'

# Blue/Green Port Config
BLUE_PORT = 3001
GREEN_PORT = 3002
```
