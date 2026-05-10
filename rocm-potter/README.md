# rocm-potter

Autonomous CUDA→ROCm kernel porting system for AMD Instinct MI300X.

## Setup

1. Install [OpenCode](https://opencode.ai)
2. `cd` into this directory
3. Run `opencode` — agents and skills are auto-discovered from `.opencode/`

## Usage

Port a CUDA kernel by invoking the **`potter`** agent (default) with the kernel source. Potter enforces an 8-phase gated workflow:

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

## Agents

| Agent | Mode | Role |
|---|---|---|
| **potter** | primary (default) | Orchestrator. 8-phase gated workflow. Loads skills. Dispatches subagents. Never writes code. |
| rocm-coder | subagent | Implements specific coding tasks |
| rocm-planner | subagent | Analyzes CUDA kernel, writes plan.md |
| rocm-profiler | subagent | Profiles HIP kernel (50+ iterations, roofline counters) |
| rocm-reviewer | subagent | Reviews code (phase + final scope) |

## Output

Ported kernels appear in `kernels/<name>/` with:
- `original.cu` — source CUDA kernel (never modified)
- `plan.md` — phased porting plan with benchmark specification
- `ported.hip` — ported HIP kernel
- `CMakeLists.txt` — build configuration (hipcc, gfx942)
- `test_harness.cpp` — dual-mode: `--correctness` + `--bench --iterations N`
- `profiling_results/` — profiler output (CSV, roofline data)

## Test Harness

```
./test_harness                            # Correctness (small, quick)
./test_harness --bench                   # Benchmark (large, 50 iters, roofline)
./test_harness --bench --iterations 100  # Custom iterations
```

Benchmark mode reports NERSC roofline metrics: Arithmetic Intensity, achieved GFLOP/s, bandwidth efficiency, compute efficiency, ridge point comparison, bottleneck classification.

## Skills

| Skill | Purpose |
|---|---|
| `rocm-knowledge` | ROCm doc URL reference table |
| `rocm-documentation` | CUDA→HIP API mapping + coding patterns |
| `rocm-optimization-guide` | MI300X optimization + benchmark sizing |
| `rocm-profiling-guide` | Profiling workflow + roofline counter collection |

## Constraints

- Linux + MI300X only
- No third-party dependencies in ported kernels (only ROCm ecosystem)
- Original CUDA kernel is never modified
- Autonomous — no questions asked
- CMake for builds
- Benchmark inputs exceed MI300X L2 (32 MiB), ideally exceed LLC (256 MiB)
- 50+ iterations for all profiling runs
- NERSC roofline format for all benchmark reports
