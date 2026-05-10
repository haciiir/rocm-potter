# rocm-potter: Autonomous CUDA→ROCm Kernel Porting

## Overview

Autonomous CUDA→ROCm kernel porting system for AMD Instinct MI300X (Linux). The `potter` agent enforces an 8-phase gated workflow — each phase must pass its gate before the next begins. All execution through built-in tools (bash, edit, grep, webfetch, skill).

## Constraints

- **Linux + MI300X only** — no Windows, no other GPUs
- **No third-party dependencies** in ported kernels — exclude triton, python, pytorch. Only ROCm ecosystem libraries (rocBLAS, hipBLASLt, MIOpen, rocPRIM, rocWMMA, Composable Kernel, etc.)
- **Original kernel is sacred** — never modify `original.cu`
- **Autonomous execution** — no questions asked. Input is CUDA kernel, output is ported HIP kernel
- **Correctness validation** — C/C++ test harness runs the HIP kernel and checks for NaN/Inf/crashes only. No CPU reference implementation. Correctness equivalence is the reviewer's job.
- **CMake for builds** — not Makefile
- **Per-kernel directory** output structure under `kernels/<name>/`
- **Benchmark sizing** per `rocm-optimization-guide` skill
- **Profiling iterations** per `rocm-profiling-guide` skill
- **FLOP counting** per `rocm-profiling-guide` skill
- **Benchmark reports NERSC roofline metrics** per `rocm-optimization-guide` → `references/roofline-and-benchmark.md`

## 8-Phase Gated Workflow

```
Phase 0: Setup → Phase 1: Plan → Phase 2: Code → Phase 3: Correctness → Phase 4: Benchmark → Phase 5: Profile → Phase 6: Optimize → Phase 7: Review
```

Each phase has a hard gate. `potter` CANNOT proceed to Phase N+1 until Phase N's gate is verified.

| Phase | Name | Action | Gate |
|---|---|---|---|
| 0 | Setup | Create `kernels/<name>/`, save `original.cu` | `original.cu` exists on disk |
| 1 | Plan | Dispatch `rocm-planner` (loads rocm-documentation, rocm-knowledge, rocm-optimization-guide) | `plan.md` exists with tasks + benchmark spec |
| 2 | Code | Dispatch `rocm-coder` per task (loads rocm-documentation). After each, dispatch `rocm-reviewer` scope:phase. | Build succeeds. All phase reviews PASS. |
| 3 | Correctness | Run `./test_harness --correctness` | No NaN/Inf, no crashes. |
| 4 | Benchmark | Run `./test_harness --bench --iterations 50` | Roofline metrics reported. |
| 5 | Profile | Dispatch `rocm-profiler` (loads rocm-profiling-guide, rocm-optimization-guide) | Roofline findings returned. AI cross-validated. |
| 6 | Optimize | Dispatch `rocm-coder` with optimization instructions (loads rocm-optimization-guide). Re-benchmark. | Measurable improvement vs Phase 4 baseline. |
| 7 | Review | Dispatch `rocm-reviewer` scope:final (loads rocm-documentation). | PASS (no CRITICAL issues). |

## Agents

| Agent | Mode | Role |
|---|---|---|
| `potter` | primary (default) | Orchestrator. 8-phase gated workflow. Dispatches subagents. Never writes code. |
| `rocm-coder` | subagent | Implements specific coding task. Loads rocm-documentation for API mapping depth. Returns DONE/CONCERNS/BLOCKED. |
| `rocm-planner` | subagent | Analyzes CUDA, writes plan.md with benchmark spec. Loads rocm-documentation, rocm-knowledge, rocm-optimization-guide. |
| `rocm-profiler` | subagent | Profiles HIP kernel. Loads rocm-profiling-guide, rocm-optimization-guide. Returns roofline findings. |
| `rocm-reviewer` | subagent | Reviews code (phase + final scope). Loads rocm-documentation for domain checks. Returns PASS/FAIL. |

## Skills

| Skill | Purpose | Loaded By |
|---|---|---|
| `rocm-knowledge` | ROCm doc URL reference table | rocm-planner |
| `rocm-documentation` | CUDA→HIP API mapping + coding patterns (7 reference files) | rocm-planner, rocm-coder, rocm-reviewer |
| `rocm-optimization-guide` | MI300X optimization + roofline constants + benchmark sizing | rocm-planner, rocm-profiler |
| `rocm-profiling-guide` | Profiling workflow + counter collection | rocm-profiler |

## Subagent Dispatch Protocol

When `potter` dispatches subagents:
1. Read `plan.md` once, extract ALL tasks with full text
2. Provide full task text in the dispatch prompt — never tell subagents to read the plan file
3. Specify which skills the subagent should load — do not paste skill content
4. Include context: kernel name, target arch (gfx942), build system (hipcc, CMake)
5. Handle subagent status: DONE → proceed, DONE_WITH_CONCERNS → assess, BLOCKED → escalate, NEEDS_CONTEXT → provide

## Output Structure

```
kernels/
└── <kernel-name>/
    ├── original.cu          # Source CUDA kernel (never modified)
    ├── plan.md              # Phased porting plan with benchmark specification
    ├── ported.hip           # Ported HIP kernel
    ├── CMakeLists.txt       # Build with hipcc, target gfx942
    ├── test_harness.cpp     # Dual-mode: --correctness + --bench --iterations N
    └── profiling_results/   # Profiler output (CSV, roofline data)
```

## Test Harness Modes

```
./test_harness                            # or --correctness: small inputs, quick pass/fail
./test_harness --bench                   # large inputs, 50 iterations, roofline metrics
./test_harness --bench --iterations 100  # custom iteration count
```

## Commands

```bash
# Build
cd kernels/<name>
cmake -B build && cmake --build build

# Correctness
./build/test_harness --correctness

# Benchmark (50 iterations)
./build/test_harness --bench --iterations 50

# Profile
rocprofv3 --kernel-trace -d profiling_results -f csv -o kernel_trace -- ./build/test_harness --bench --iterations 50

# Roofline
rocprof-compute profile -n <name> --roof-only -- ./build/test_harness --bench --iterations 50
```
