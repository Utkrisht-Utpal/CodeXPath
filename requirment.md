# Requirements Document: CODEXPATH AI

## 1. Project Overview

CODEXPATH AI is an AI-powered structured code intelligence and learning system that analyzes GitHub repositories using deterministic static analysis (AST-based parsing) and uses LLM only for explanation and roadmap generation.

**Core Principle**: The system acts as a structured code analysis engine + technical mentor, NOT a generic chatbot.

---

## 2. Functional Requirements

### 2.1 Repository Ingestion
- **FR-1.1**: System must accept GitHub repository URLs as input
- **FR-1.2**: System must accept uploaded project folders (ZIP or directory)
- **FR-1.3**: System must validate repository accessibility before processing
- **FR-1.4**: System must clone repositories to temporary storage for analysis
- **FR-1.5**: System must handle authentication for private repositories (optional for MVP)

### 2.2 Language & Framework Detection
- **FR-2.1**: System must detect primary programming language(s) in the repository
- **FR-2.2**: System must identify frameworks used (e.g., React, Express, Django, Flask)
- **FR-2.3**: System must parse package.json, requirements.txt, and similar manifest files
- **FR-2.4**: System must report language distribution by file count and lines of code
- **FR-2.5**: System must flag unsupported languages and exclude them from analysis

### 2.3 AST-Based Structural Analysis
- **FR-3.1**: System must parse source files into Abstract Syntax Trees (AST) using deterministic parsers
- **FR-3.2**: System must extract function/method definitions with signatures
- **FR-3.3**: System must extract class definitions and inheritance relationships
- **FR-3.4**: System must identify import/require statements and module dependencies
- **FR-3.5**: System must extract variable declarations and their scopes
- **FR-3.6**: System must NOT use LLM for code structure analysis
- **FR-3.7**: System must store parsed AST data in structured format (JSON/database)

### 2.4 Dependency Graph Construction
- **FR-4.1**: System must build a directed graph of module dependencies
- **FR-4.2**: System must identify internal dependencies (within repository)
- **FR-4.3**: System must identify external dependencies (third-party packages)
- **FR-4.4**: System must detect circular dependencies and flag them
- **FR-4.5**: System must calculate dependency depth for each module
- **FR-4.6**: System must visualize dependency graph (optional for MVP)

### 2.5 Entry Point Detection Heuristics
- **FR-5.1**: System must identify main entry points using deterministic heuristics:
  - JavaScript: index.js, main.js, app.js, server.js, package.json "main" field
  - Python: __main__.py, main.py, app.py, manage.py
- **FR-5.2**: System must detect framework-specific entry points (e.g., Next.js pages, Flask routes)
- **FR-5.3**: System must rank entry points by confidence score
- **FR-5.4**: System must trace execution flow from entry points

### 2.6 Concept Extraction Engine
- **FR-6.1**: System must extract programming concepts from code patterns:
  - Control flow patterns (loops, conditionals, recursion)
  - Data structures used (arrays, objects, classes)
  - Design patterns (singleton, factory, observer, etc.)
  - Architectural patterns (MVC, REST API, middleware)
- **FR-6.2**: System must map code patterns to learning concepts deterministically
- **FR-6.3**: System must rank concepts by frequency and complexity
- **FR-6.4**: System must distinguish between FACT (detected patterns) and INFERENCE (interpretation)

### 2.7 LLM Explanation Layer
- **FR-7.1**: System must use LLM ONLY for generating human-readable explanations
- **FR-7.2**: System must provide LLM with structured factual data (AST, dependencies, concepts)
- **FR-7.3**: System must NOT allow LLM to analyze raw code directly
- **FR-7.4**: System must generate explanations for:
  - Repository architecture overview
  - Module purpose and relationships
  - Detected patterns and their significance
  - Code complexity assessment
- **FR-7.5**: System must clearly label LLM-generated content as "Explanation" or "Interpretation"

### 2.8 Personalized Roadmap Generator
- **FR-8.1**: System must generate a learning roadmap based on extracted concepts
- **FR-8.2**: System must order concepts by prerequisite relationships
- **FR-8.3**: System must suggest learning resources for each concept
- **FR-8.4**: System must adapt roadmap based on user's stated skill level (beginner/intermediate/advanced)
- **FR-8.5**: System must link roadmap items to specific code examples in the repository
- **FR-8.6**: System must use LLM for roadmap narrative and recommendations only

### 2.9 Output & Reporting
- **FR-9.1**: System must generate a structured analysis report containing:
  - Repository metadata (language, size, structure)
  - Dependency graph
  - Entry points
  - Extracted concepts with code references
  - Architecture explanation
  - Learning roadmap
- **FR-9.2**: System must export report in JSON and Markdown formats
- **FR-9.3**: System must provide interactive UI for exploring analysis results

---

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-1.1**: System must complete analysis of repositories up to 100 files within 60 seconds
- **NFR-1.2**: System must complete analysis of repositories up to 500 files within 5 minutes
- **NFR-1.3**: AST parsing must process at least 1000 lines of code per second
- **NFR-1.4**: LLM explanation generation must complete within 30 seconds per section

### 3.2 Scalability
- **NFR-2.1**: System must support concurrent analysis of up to 10 repositories
- **NFR-2.2**: System must handle repositories up to 10,000 files (stretch goal)
- **NFR-2.3**: System must implement rate limiting for GitHub API calls
- **NFR-2.4**: System must cache parsed AST data to avoid redundant processing

### 3.3 Repository Size Limits
- **NFR-3.1**: MVP must support repositories up to 500 files
- **NFR-3.2**: MVP must support repositories up to 50 MB in size
- **NFR-3.3**: System must reject repositories exceeding size limits with clear error message
- **NFR-3.4**: System must support incremental analysis for large repositories (future)

### 3.4 Accuracy & Reliability
- **NFR-4.1**: AST parsing must achieve 100% accuracy (deterministic)
- **NFR-4.2**: Entry point detection must achieve >90% accuracy on common project structures
- **NFR-4.3**: Concept extraction must have <5% false positive rate
- **NFR-4.4**: System must NOT hallucinate code structures or relationships
- **NFR-4.5**: System must clearly distinguish FACT (parsed data) from INFERENCE (LLM interpretation)

### 3.5 Security
- **NFR-5.1**: System must not store repository code permanently after analysis
- **NFR-5.2**: System must sanitize user inputs to prevent injection attacks
- **NFR-5.3**: System must use secure temporary storage with automatic cleanup
- **NFR-5.4**: System must not expose GitHub tokens or credentials in logs
- **NFR-5.5**: System must implement rate limiting to prevent abuse

### 3.6 Data Retention Policy
- **NFR-6.1**: Repository code must be deleted within 1 hour after analysis completion
- **NFR-6.2**: Analysis results (AST, graphs, reports) may be cached for 24 hours
- **NFR-6.3**: User must be able to request immediate deletion of analysis data
- **NFR-6.4**: System must not retain any personally identifiable information

### 3.7 Availability
- **NFR-7.1**: System must maintain 95% uptime during hackathon demo period
- **NFR-7.2**: System must handle graceful degradation if LLM service is unavailable
- **NFR-7.3**: System must provide meaningful error messages for all failure modes
- **NFR-7.4**: System must implement retry logic for transient failures

### 3.8 Usability
- **NFR-8.1**: System must provide progress indicators during analysis
- **NFR-8.2**: System must complete initial repository validation within 5 seconds
- **NFR-8.3**: UI must be responsive and accessible (WCAG 2.1 Level AA)
- **NFR-8.4**: System must provide clear documentation for all features

---

## 4. Constraints

### 4.1 Technical Constraints
- **C-1.1**: MVP supports JavaScript and Python only
- **C-1.2**: MVP targets small to medium repositories (up to 500 files)
- **C-1.3**: System must use deterministic AST parsers (e.g., Babel, Acorn, ast module)
- **C-1.4**: LLM must NOT analyze raw code directly
- **C-1.5**: System must run on standard cloud infrastructure (AWS, GCP, Azure)

### 4.2 Data Constraints
- **C-2.1**: No hallucination allowed in factual code analysis
- **C-2.2**: All code relationships must be derived from deterministic parsing
- **C-2.3**: LLM-generated content must be clearly labeled as interpretation

### 4.3 Time Constraints
- **C-3.1**: MVP must be completed within hackathon timeline
- **C-3.2**: System must prioritize core analysis features over UI polish

### 4.4 Resource Constraints
- **C-4.1**: System must operate within free tier limits of LLM APIs during development
- **C-4.2**: System must minimize external API calls to reduce costs

---

## 5. Success Metrics

### 5.1 Functional Success Metrics
- **SM-1.1**: System successfully analyzes 95% of public JavaScript/Python repositories under 500 files
- **SM-1.2**: Entry point detection accuracy >90% on test dataset
- **SM-1.3**: Dependency graph completeness >95% (all imports/requires captured)
- **SM-1.4**: Zero hallucinated code structures or relationships

### 5.2 Performance Success Metrics
- **SM-2.1**: Average analysis time <2 minutes for repositories with 100-500 files
- **SM-2.2**: AST parsing throughput >1000 LOC/second
- **SM-2.3**: LLM explanation generation <30 seconds per section

### 5.3 User Experience Success Metrics
- **SM-3.1**: Users can understand repository architecture within 5 minutes of viewing report
- **SM-3.2**: Learning roadmap contains actionable, ordered steps
- **SM-3.3**: System provides clear distinction between facts and interpretations

### 5.4 Quality Success Metrics
- **SM-4.1**: Zero security vulnerabilities in code analysis pipeline
- **SM-4.2**: 100% of temporary repository data deleted within 1 hour
- **SM-4.3**: System handles errors gracefully with <1% crash rate

---

## 6. Out of Scope (MVP)

The following features are explicitly out of scope for the MVP:

- **OS-1**: Support for languages other than JavaScript and Python
- **OS-2**: Real-time collaborative analysis
- **OS-3**: Code quality scoring or linting
- **OS-4**: Automated code refactoring suggestions
- **OS-5**: Integration with IDEs or CI/CD pipelines
- **OS-6**: User authentication and multi-user support
- **OS-7**: Historical analysis or version comparison
- **OS-8**: Advanced visualizations (3D graphs, animations)

---

## 7. Acceptance Criteria

### 7.1 Core Functionality
- [ ] System accepts GitHub URL and successfully clones repository
- [ ] System detects JavaScript or Python as primary language
- [ ] System parses all supported files into AST without errors
- [ ] System builds complete dependency graph
- [ ] System identifies at least one entry point
- [ ] System extracts minimum 5 programming concepts from typical repository
- [ ] System generates human-readable explanation using LLM
- [ ] System produces personalized learning roadmap

### 7.2 Quality Gates
- [ ] Zero hallucinated code structures in analysis output
- [ ] All code relationships verified against AST data
- [ ] LLM content clearly labeled as "Explanation" or "Interpretation"
- [ ] System completes analysis within performance targets
- [ ] Repository data deleted within 1 hour of analysis

### 7.3 Demo Readiness
- [ ] System successfully analyzes 3 sample repositories (small, medium, complex)
- [ ] UI displays all analysis results clearly
- [ ] Error handling works for invalid URLs and unsupported repositories
- [ ] Documentation explains system architecture and usage

---

## 8. Glossary

- **AST (Abstract Syntax Tree)**: A tree representation of source code structure
- **Deterministic Parsing**: Code analysis using rule-based parsers that produce consistent, verifiable results
- **Entry Point**: The main file or function where program execution begins
- **Dependency Graph**: A directed graph showing relationships between modules
- **Concept Extraction**: Process of identifying programming patterns and mapping them to learning concepts
- **FACT**: Information derived directly from deterministic code analysis
- **INFERENCE**: Interpretation or explanation generated by LLM based on facts
- **Hallucination**: LLM generating false or unverifiable information about code structure

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-11  
**Status**: Draft
