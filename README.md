# rocm-potter

Autonomous CUDA→ROCm kernel porting system for AMD Instinct MI300X.

## Projects

### rocm-potter

The core agent system. Uses an 8-phase gated workflow to autonomously port CUDA kernels to HIP/ROCm:

| Phase | Name | Gate |
|---|---|---|
| 0 | Setup | `original.cu` exists |
| 1 | Plan | `plan.md` with benchmark spec exists |
| 2 | Code | Build succeeds |
| 3 | Correctness | All small tests pass |
| 4 | Benchmark | Roofline metrics reported (50+ iterations) |
| 5 | Profile | Counter-derived + analytical AI returned |
| 6 | Optimize | Improvement over baseline |
| 7 | Review | PASS (no CRITICAL issues) |

Each phase must pass its gate before the next begins.

#### Agents

| Agent | Mode | Role |
|---|---|---|
| **potter** | primary (default) | Orchestrator. 8-phase gated workflow. Loads skills. Dispatches subagents. |
| rocm-coder | subagent | Implements specific coding tasks |
| rocm-planner | subagent | Analyzes CUDA kernel, writes plan.md |
| rocm-profiler | subagent | Profiles HIP kernel (50+ iterations, roofline counters) |
| rocm-reviewer | subagent | Reviews code (phase + final scope) |

#### Output

Ported kernels appear in `kernels/<name>/` with:
- `original.cu` — source CUDA kernel (never modified)
- `plan.md` — phased porting plan with benchmark specification
- `ported.hip` — ported HIP kernel
- `CMakeLists.txt` — build configuration (hipcc, gfx942)
- `test_harness.cpp` — dual-mode: `--correctness` + `--bench --iterations N`
- `profiling_results/` — profiler output (CSV, roofline data)

### rocm-potter-web

Web UI for monitoring and interacting with the potter agent. Built with React + TypeScript + Vite.

Features:
- Real-time agent session monitoring via SSE
- Code viewer with syntax highlighting
- Benchmark results and roofline charts
- Kernel submission interface

## Setup

1. `cd` into `rocm-potter/`
2. Run `opencode` — agents and skills are auto-discovered from `.opencode/`

For the web UI:
```bash
cd rocm-potter-web
npm install
npm run dev
```

## Test Harness

```
./test_harness                            # Correctness (small, quick)
./test_harness --bench                   # Benchmark (large, 50 iters, roofline)
./test_harness --bench --iterations 100  # Custom iterations
```

## Constraints

- Linux + MI300X only
- No third-party dependencies in ported kernels (only ROCm ecosystem)
- Original CUDA kernel is never modified
- Autonomous — no questions asked
- CMake for builds
- 50+ iterations for all profiling runs
- NERSC roofline format for all benchmark reports
