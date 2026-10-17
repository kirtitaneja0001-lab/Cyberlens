
# CyberLens: Architecture

**Status:** Provisional; verify against the existing codebase.

## 1. Planned System

CyberLens is expected to contain a user interface and a server-side scanning layer.

### Frontend

Responsibilities:

- Collect a URL from the user.
- Validate basic input formatting.
- Show scan progress and errors.
- Display findings and recommendations.

### Backend

Responsibilities:

- Validate submitted targets independently.
- Enforce safe destination and redirect policies.
- Perform supported HTTP and TLS observations.
- Normalize observations into structured findings.
- Return appropriate errors without leaking sensitive details.

### Scanning Layer

Responsibilities:

- Inspect selected HTTP security headers.
- Observe HTTPS/TLS connection information where supported.
- Distinguish observed facts from warnings and unavailable checks.

## 2. Planned Request Flow

1. User submits a website URL.
2. Frontend sends the request to the backend.
3. Backend validates the target and enforces network restrictions.
4. Scanning logic performs permitted checks.
5. Backend returns structured findings.
6. Frontend renders the report.

## 3. Data and Storage

Persistent storage is not assumed for the initial version.

Scan history may use a database if required. The choice will depend on the existing implementation and deployment needs.

## 4. Security Boundaries

- Never trust frontend validation alone.
- Restrict requests to permitted public destinations.
- Revalidate every redirect destination.
- Apply request timeouts and response-size limits.
- Never return credentials or internal infrastructure details.
- Do not treat missing evidence as proof of vulnerability or safety.

## 5. Implementation Record

Complete this section after inspecting the codebase.

- Frontend framework: TBD
- Backend framework: TBD
- Runtime and language: TBD
- API routes: TBD
- Storage: TBD
- Deployment platform: TBD

## 6. Architecture Decisions

Record significant decisions here, including the reason for each choice and any alternatives considered.
