# CatchTrack Development Workflow

This document is the binding operating workflow for the CatchTrack project in repository `El-Ninjo1965/CatchTrack-V.1.0`.

It defines the required process for every AI agent and developer working in this repository.
It does not replace the project specification documents; it defines how to use them and how to work safely within the existing architecture.

## 1. Repository and branch rules

- Repository: `El-Ninjo1965/CatchTrack-V.1.0`
- Standard branch: `main`
- Do not work in any other repository.
- Do not switch accounts automatically.
- Do not create new repositories while working on this project.
- Do not assume a different remote or fork is the active project unless the repository state clearly confirms it.

## 2. Required pre-task checks

Before starting any task, check the current repository state and confirm the work is being done on the correct branch and commit.

Required steps:

- `git status`
- `git branch`
- `git log -1 --oneline`
- `git remote -v`
- confirm repo root and active branch
- confirm working tree state
- confirm remote is the expected repository and branch

If the status is dirty or branch/remote state is unexpected, the task must be reviewed before making changes.

## 3. Required analysis before implementation

Before changing code, confirm the actual state of the repository.

Required checks:

- read the relevant project documentation
- inspect the relevant implementation files
- determine the current runtime behavior
- determine the target behavior required by the task
- identify the precise mismatch between IST and SOLL
- do not assume a feature exists just because a document mentions it

## 4. Documentation order

When a task requires implementation guidance, read the relevant materials in order and use them as the required project reference:

1. `AI-FRAMEWORK-SPEC.md`
2. `MODULE-INTEGRATION-SPEC.md`
3. `AI-MODULE-TEMPLATE.md`
4. `DEVELOPER-GUIDE.md`
5. `SERVER-APPLICATION-GUIDE.md`

Additional project files may be read only if they directly support the current task.

The documentation describes the target state. The code describes the current state. The code must be checked before implementation begins.

## 5. Architecture rules

CatchTrack is the application. The neutral framework/core remains the underlying generic runtime and must not be unnecessarily expanded with CatchTrack-specific business logic.

Core principles:

- preserve the existing architecture whenever possible
- do not create parallel systems for authentication, routing, storage, configuration, server connection handling, or module lifecycle
- reuse the existing framework components and canonical flows
- do not add fake APIs or fake module layers
- do not invent a second admin or auth system when a framework system already exists
- keep app-specific logic in the application layer, not in neutral core files

If a feature already exists in the framework, use that implementation instead of creating an equivalent system elsewhere.

## 6. Development workflow

For larger tasks, the required flow is:

1. analysis
2. technical plan
3. implementation
4. validation
5. final verification

When multiple changes are related, work in one coherent block when possible.

Do not perform large unrelated refactors. Prefer precise, direct fixes.

## 7. File and code rules

- read the relevant existing file before making changes
- do not duplicate files that already exist for the same responsibility
- do not create new systems alongside existing ones unless the task clearly requires it
- do not leave unused or temporary files behind
- do not commit runtime artifacts or generated state files
- do not write secrets, passwords, API keys, credentials, or production tokens into the repository
- do not hardcode localhost or production credentials into code for deployment use
- keep the repository clean and deployment-safe

## 8. Server and setup rules

The server must remain uploadable and runnable as a normal Node-based application.

Rules:

- runtime configuration stays outside Git where secrets or environment-specific values are involved
- setup and runtime state must not remain as accidental repository files
- server, database, and connection logic must remain connected to the existing architecture instead of becoming a parallel implementation
- setup and install status must use the project’s existing status model rather than creating a second status engine
- server-dependent functions remain optional unless the current task explicitly requires them

## 9. Testing rules

After changes, at minimum:

- `node --check` for all changed JavaScript files
- `npm test`
- `git diff --check`

For server work, additionally:

- start the local server
- check `/health`
- check `/api/status`
- check `/api/modules`
- check all relevant modified or newly used APIs

For UI work:

- verify the existing routing/auth logic still works
- do not introduce a parallel UI or auth structure
- verify that admin/developer routes still use the existing framework flow

## 10. Git rules

Before commit:

- `git diff`
- `git diff --check`
- `git status`
- only stage the intended files

After commit:

- `git push origin main`
- `git status`
- confirm the working tree is clean
- confirm the local branch matches the remote branch state

Use meaningful commit messages that reflect the actual change.

## 11. Completion report rules

After each larger task, provide a short completion report containing:

- IMPLEMENTIERT: what was implemented
- GEÄNDERT: what files or systems changed
- GETESTET: what was validated
- NOCH OFFEN: remaining items only, if any
- GIT: commit, branch, remote, working tree status

This report must only list functions that were actually implemented and validated.

## 12. Error handling rules

When an error occurs, do not guess.

The exact issue must be identified with:

- the command used
- the file involved
- the endpoint or route involved
- the error message or observable failure
- the current project state

Only after this diagnosis should the code be changed.

## 13. Scope rules

This workflow file is a process standard only.
It must not invent a new architecture.
It must only define the required working method for the existing CatchTrack project and its neutral framework runtime.

## 14. Final workflow requirement

After any task that changes the repository state:

- verify the change with the applicable checks
- run `git diff --check`
- ensure no accidental functional changes were introduced
- commit only the intended files
- push to `origin main`
- confirm the working tree is clean

No unrelated functional work is allowed in the same change unless the task explicitly requires it.
