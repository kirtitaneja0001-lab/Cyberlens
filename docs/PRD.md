
# CyberLens: Product Requirements

**Status:** Draft  
**Version:** 0.1.0

## 1. Overview

CyberLens is a web application that helps users understand publicly observable website security signals through clear findings and actionable recommendations.

## 2. Problem Statement

Security-related HTTP responses and configuration details can be difficult for beginners to interpret. CyberLens aims to make selected observations easier to understand.

## 3. Target Users

- Students learning cybersecurity
- Developers checking their own websites
- Website owners seeking basic configuration insights

## 4. MVP Features

- Accept and validate a public HTTP/HTTPS URL.
- Inspect HTTPS/TLS-related information where supported.
- Analyze selected HTTP security headers.
- Display findings with evidence and explanations.
- Provide actionable remediation recommendations.
- Show loading, error, and completion states.
- Label unavailable checks and uncertain findings accurately.

## 5. Safety Requirements

- Restrict requests to eligible public web targets.
- Prevent server-side request forgery (SSRF).
- Handle redirects, timeouts, and invalid responses safely.
- Never expose secrets or sensitive server information.
- Do not perform exploitation or intrusive vulnerability testing.

## 6. Non-Goals

- Guaranteeing that a website is secure.
- Replacing a professional penetration test.
- Exploiting vulnerabilities.
- Scanning private networks or internal services.

## 7. Success Criteria

- Valid URLs are processed correctly.
- Invalid and unsafe targets are rejected.
- Results reflect actual observations.
- Failures are communicated clearly.
- Recommendations are relevant to the findings.
- Setup and usage instructions allow another developer to run the project.

## 8. Constraints and Open Questions

- Confirm the existing application framework and backend.
- Select the final scanning implementation after reviewing the codebase.
- Decide whether scan history requires persistent storage.
- Confirm deployment requirements before release.
