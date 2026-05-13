# AGENTS.md — Agent Run Instructions & History

## Active Agents
| Agent | Model | Purpose | Status |
|---|---|---|---|
| Research Agent | (your choice) | Build WARD_DB from public data | PENDING |
| Code Agent | (your choice) | Implement components, utils, integration | PENDING |
| QA Agent | (your choice) | Validate JSON schema, test edge cases | PENDING |

## Agent Run History

### Run Template
Each agent run should produce an output file in `agents/runs/` with the naming convention:
`run-NNN-description.md` (e.g., `run-001-warddb-research.md`)

Each run file should include:
- **Agent name & model used**
- **Prompt version** (link to the prompt in `agents/research-prompt.md`)
- **Date & duration**
- **Output summary**
- **Data quality score** (self-assessed by agent)
- **Known issues / gaps**
- **Human review status** (pending / approved / needs-revision)

## How to Run an Agent
1. Copy the relevant prompt from `agents/`
2. Execute with your chosen agent/model
3. Save output to `agents/runs/run-NNN-description.md`
4. If output is data (e.g., WARD_DB.js), move to `src/data/`
5. Update PROGRESS.md with results
6. Update DECISIONS.md if any new architectural decisions were made

## Iteration Rules
- Always version your outputs (v1.0, v1.1, v2.0, etc.)
- Never overwrite a previous run — create a new file
- If re-running with changes, note what changed and why