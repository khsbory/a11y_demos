# 프로젝트 운영 및 매뉴얼 규칙

## 환경 구성 원칙
- **로컬 및 프로덕션 환경**은 반드시 **도커(Docker)** 컨테이너 안에서 실행해야 합니다. 
- 직접적인 호스트 설치 방식은 환경 불일치를 방지하기 위해 지양하며, 모든 의존성은 `Dockerfile` 및 `docker-compose`를 통해 관리합니다.

## 매뉴얼 폴더 구조 설명
매뉴얼 파일들은 관리 효율성을 위해 다음과 같이 두 개의 하위 폴더로 분리되어 있습니다.

### 1. [api/](./api)
외부 에이전트 및 시스템 연동을 위한 가이드와 테스트 도구가 포함되어 있습니다.
- **API_USAGE_GUIDE.md**: 인증 방법, 엔드포인트 설명 및 Python 예제 코드
- **verify_api.py** / **api_lifecycle_test.py**: API 동작 및 생명주기 검증용 스크립트

### 2. [deploy/](./deploy)
시놀로지(Synology) NAS 배포 및 서버 운영을 위한 도구들이 포함되어 있습니다.
- **SYNOLOGY_DEPLOYMENT_GUIDE.md**: Blue/Green 배포 전략 및 단계별 가이드
- **deploy_to_synology.py**: SSH를 통한 자동 배포 수행 스크립트
- **docker-compose.prod.yml** / **docker-compose.db.yml**: 운영 환경 도커 설정
- **기타 운영 도구**: 로그 확인(`fetch_logs.py`), 터미널 접속(`open_terminal.py`) 등

## 배포 및 운영 수칙
- 모든 배포 작업 전에는 반드시 [**SYNOLOGY_DEPLOYMENT_GUIDE.md**](./deploy/SYNOLOGY_DEPLOYMENT_GUIDE.md)를 끝까지 정독하고 절차를 준수해야 합니다.
- 특히 **Prisma 스키마 변경** 시에는 로컬 빌드와 서버의 정합성이 깨지지 않도록 가이드에 명시된 빌드 순서를 엄격히 따릅니다.
    - `prisma generate` → `next build` → `docker build` → `docker push` → `deploy script`
