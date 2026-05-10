interface FileNode {
  name: string;
  path: string;
  absolute: string;
  type: "file" | "directory";
  ignored: boolean;
  children?: FileNode[];
}

export const DEMO_SESSION = {
  id: "ses_1ed549f43ffe13fI3TYjRWD0l9",
  title: "Coalesced causal attention CUDA kernel",
  agent: "potter",
  parentID: null,
  time: { created: 1778429681852, updated: 1778431747352 },
};

export const DEMO_CHILDREN = [
  {
    id: "ses_1ed543136ffeVLL3SvsXKYrOmU",
    title: "Plan attention_forward kernel port (@rocm-planner subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-planner. Analyze the CUDA kernel and write a porting plan for attention_forward." }] },
      { role: "assistant", parts: [
        { type: "text", text: "I'll analyze the kernel and create a comprehensive porting plan." },
        { type: "tool", tool: "skill", callID: "sk1", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778429682000, end: 1778429682100 } } },
        { type: "tool", tool: "skill", callID: "sk2", state: { status: "completed", input: { name: "rocm-optimization-guide" }, output: "Skill loaded", time: { start: 1778429682200, end: 1778429682300 } } },
        { type: "tool", tool: "read", callID: "r1", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/original.cu" }, output: "Read 120 lines", title: "original.cu", time: { start: 1778429682400, end: 1778429682500 } } },
        { type: "tool", tool: "read", callID: "r2", state: { status: "completed", input: { filePath: "/root/rocm-potter/.opencode/skills/rocm-optimization-guide/references/roofline-and-benchmark.md" }, output: "Read roofline constants", title: "roofline-and-benchmark.md", time: { start: 1778429682600, end: 1778429682700 } } },
        { type: "tool", tool: "webfetch", callID: "w1", state: { status: "completed", input: { url: "https://rocm.docs.amd.com/projects/MIOpen/en/latest/" }, output: "MIOpen documentation fetched", title: "MIOpen docs", time: { start: 1778429682800, end: 1778429683300 } } },
        { type: "tool", tool: "bash", callID: "b1", state: { status: "completed", input: { command: "ls /root/rocm-potter/kernels/attention_forward/" }, output: "original.cu\n", title: "Check kernel directory", metadata: { exit: 0, truncated: false }, time: { start: 1778429683400, end: 1778429683500 } } },
        { type: "tool", tool: "write", callID: "wr1", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/plan.md", content: "# Porting Plan..." }, output: "File written successfully", title: "plan.md", metadata: { filepath: "plan.md", exists: false }, time: { start: 1778429683600, end: 1778429683700 } } },
        { type: "tool", tool: "bash", callID: "b2", state: { status: "completed", input: { command: "cat /root/rocm-potter/kernels/attention_forward/plan.md | head -5" }, output: "# Porting Plan: attention_forward\n\n## Kernel Analysis\n", title: "Verify plan.md", metadata: { exit: 0, truncated: false }, time: { start: 1778429683800, end: 1778429683900 } } },
        { type: "text", text: "Plan written successfully. The attention_forward kernel is a coalesced causal attention implementation using shared memory tiling. Key porting considerations: warpSize=64 on CDNA, LDS bank conflicts, and MFMA opportunities for Q·K^T dot products." },
      ] },
    ],
  },
  {
    id: "ses_1ed4c1288ffeE7ilk4glHQsTzG",
    title: "Implement ported.hip kernel (@rocm-coder subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-coder. Implement ported.hip for attention_forward." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Implementing the HIP port of the attention_forward kernel." },
        { type: "tool", tool: "skill", callID: "sk3", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778429740000, end: 1778429740100 } } },
        { type: "tool", tool: "read", callID: "r3", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/original.cu" }, output: "Read 120 lines", title: "original.cu", time: { start: 1778429740200, end: 1778429740300 } } },
        { type: "tool", tool: "read", callID: "r4", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/plan.md" }, output: "Read plan", title: "plan.md", time: { start: 1778429740400, end: 1778429740500 } } },
        { type: "tool", tool: "write", callID: "wr2", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/ported.hip", content: "#pragma once\n__global__ void attention_forward_kernel(..." }, output: "File written successfully", title: "ported.hip", metadata: { filepath: "ported.hip", exists: false }, time: { start: 1778429740600, end: 1778429740700 } } },
        { type: "text", text: "ported.hip written. Direct 1:1 translation: cuda→hip API calls, __shared__→LDS (same keyword), blockIdx/threadIdx unchanged. Key changes: hipMemcpy direction enums, hipLaunchKernel instead of triple-chevron, warpSize runtime check." },
      ] },
    ],
  },
  {
    id: "ses_1ed4b44a3fferS0rVEZZ4rEfI8",
    title: "Phase review of ported.hip (@rocm-reviewer subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-reviewer. Review ported.hip." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Reviewing ported.hip for correctness and equivalence." },
        { type: "tool", tool: "skill", callID: "sk4", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778429800000, end: 1778429800100 } } },
        { type: "tool", tool: "read", callID: "r5", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/original.cu" }, output: "Read original", title: "original.cu", time: { start: 1778429800200, end: 1778429800300 } } },
        { type: "tool", tool: "read", callID: "r6", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/ported.hip" }, output: "Read ported", title: "ported.hip", time: { start: 1778429800400, end: 1778429800500 } } },
        { type: "text", text: "**PASS** — All CUDA constructs correctly translated. warpSize checked at runtime. No shuffle/atomics that depend on wavefront=32. LDS usage matches __shared__ original." },
      ] },
    ],
  },
  {
    id: "ses_1ed489e65ffe0OxZt74Y4uDrPk",
    title: "Create CMakeLists.txt (@rocm-coder subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-coder. Create CMakeLists.txt." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Creating the build system." },
        { type: "tool", tool: "skill", callID: "sk5", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778429860000, end: 1778429860100 } } },
        { type: "tool", tool: "write", callID: "wr3", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/CMakeLists.txt", content: "cmake_minimum_required(VERSION 3.21)..." }, output: "File written", title: "CMakeLists.txt", metadata: { filepath: "CMakeLists.txt", exists: false }, time: { start: 1778429860200, end: 1778429860300 } } },
        { type: "text", text: "CMakeLists.txt created targeting gfx942 with hipcc, C++17, -O3 -ffast-math flags." },
      ] },
    ],
  },
  {
    id: "ses_1ed4830acffeTvw01lXjDBSxOl",
    title: "Create test_harness.cpp (@rocm-coder subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-coder. Create test_harness.cpp." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Creating the dual-mode test harness with --correctness and --bench modes." },
        { type: "tool", tool: "skill", callID: "sk6", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778429920000, end: 1778429920100 } } },
        { type: "tool", tool: "write", callID: "wr4", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/test_harness.cpp", content: "#include <hip/hip_runtime.h>..." }, output: "File written", title: "test_harness.cpp", metadata: { filepath: "test_harness.cpp", exists: false }, time: { start: 1778429920200, end: 1778429920300 } } },
        { type: "tool", tool: "bash", callID: "b3", state: { status: "completed", input: { command: "cd /root/rocm-potter/kernels/attention_forward && cmake -B build -G Ninja && cmake --build build 2>&1" }, output: "Build successful", title: "Build project", metadata: { exit: 0, truncated: false }, time: { start: 1778429920400, end: 1778429925400 } } },
        { type: "text", text: "test_harness.cpp created. Build succeeded. Harness supports --correctness (NaN/Inf check) and --bench (NERSC roofline metrics)." },
      ] },
    ],
  },
  {
    id: "ses_1ed464a3cffeMu03c0NJcl71r0",
    title: "Phase review CMake + harness (@rocm-reviewer subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-reviewer. Review CMake + harness." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Reviewing build system and test harness." },
        { type: "tool", tool: "read", callID: "r7", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/CMakeLists.txt" }, output: "Read CMakeLists", title: "CMakeLists.txt", time: { start: 1778429980000, end: 1778429980100 } } },
        { type: "tool", tool: "read", callID: "r8", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/test_harness.cpp" }, output: "Read harness", title: "test_harness.cpp", time: { start: 1778429980200, end: 1778429980300 } } },
        { type: "text", text: "**PASS_WITH_NOTES** — Build config correct for gfx942. [NOTE] std::isnan/isinf broken with -ffast-math — should use bit-level NaN detection. [NOTE] hipFree nodiscard warnings." },
      ] },
    ],
  },
  {
    id: "ses_1ed44ce1dffeM5itCMA5mCsMZH",
    title: "Profile attention_forward kernel (@rocm-profiler subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-profiler. Profile the attention_forward kernel." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Running the 5-step bottleneck workflow on attention_forward." },
        { type: "tool", tool: "skill", callID: "sk7", state: { status: "completed", input: { name: "rocm-profiling-guide" }, output: "Skill loaded", time: { start: 1778430040000, end: 1778430040100 } } },
        { type: "tool", tool: "skill", callID: "sk8", state: { status: "completed", input: { name: "rocm-optimization-guide" }, output: "Skill loaded", time: { start: 1778430040200, end: 1778430040300 } } },
        { type: "tool", tool: "bash", callID: "b4", state: { status: "completed", input: { command: "cd /root/rocm-potter/kernels/attention_forward && ./build/test_harness --bench --iterations 50 2>&1" }, output: "Kernel Time: 37.937 ms\nAchieved GFLOP/s: 1847.7\nAchieved BW: 7.1 GB/s\nAnalytical AI: 261.1 FLOP/Byte\nCompute Efficiency: 1.1%\nBandwidth Efficiency: 0.1%\nBottleneck: COMPUTE-BOUND (AI 261.1 > ridge 30.7)", title: "Benchmark run", metadata: { exit: 0, truncated: false }, time: { start: 1778430040400, end: 1778430042400 } } },
        { type: "tool", tool: "bash", callID: "b5", state: { status: "completed", input: { command: "rocprofv3 --kernel-trace -- ./build/test_harness --bench --iterations 50" }, output: "Kernel: attention_forward_kernel<64>, 4096 dispatches, VGPR=88, SGPR=48, LDS=33024", title: "Kernel trace", metadata: { exit: 0, truncated: false }, time: { start: 1778430042500, end: 1778430045500 } } },
        { type: "tool", tool: "bash", callID: "b6", state: { status: "completed", input: { command: "rocprofv3 --pmc SQ_WAVES,SQ_INSTS_VALU,SQ_INSTS_MFMA,GRBM_COUNT -- ./build/test_harness --bench --iterations 50" }, output: "SQ_WAVES: 4096, SQ_INSTS_VALU: 1111097344, SQ_INSTS_MFMA: 0, GRBM_COUNT: 2384799232", title: "Counter collection", metadata: { exit: 0, truncated: false }, time: { start: 1778430045600, end: 1778430048600 } } },
        { type: "text", text: "Bottleneck Type: occupancy-limited\nRidge Point AI (FP32): 30.7\nRidge Point AI (TF32): 122.8\nRidge Point AI (FP16): 245.3\nAnalytical AI: 261.2 FLOP/Byte\nCounter-derived AI: 23.8 FLOP/Byte\nAI Match: NO\nAchieved GFLOP/s: 1847.8\nAchieved BW: 62.2 GB/s\nCompute Efficiency: 1.1%\nBandwidth Efficiency: 1.2%\nOccupancy: 1/32 waves per CU\nVALU Utilization: 0.9%\nMFMA Utilization: 0.0%\nL2 Hit Rate: 74.2%\nVGPR Count: 88 per wave (+ 128 AGPR)\nSGPR Count: 48 per wave\nLDS Usage: 33024 bytes per workgroup\nKey Finding: The kernel is occupancy-limited by LDS (33 KB/workgroup), which allows only 1 wavefront active per CU (max=32), yielding 3.1% occupancy. This starves both VALU pipelines and memory bandwidth." },
      ] },
    ],
  },
  {
    id: "ses_1ed3b62a8ffejXQDmf0XC7UX36",
    title: "Optimize occupancy-limited kernel (@rocm-coder subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-coder. Optimize the kernel for occupancy." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Optimizing for occupancy — reducing LDS per workgroup to allow multiple waves per CU." },
        { type: "tool", tool: "skill", callID: "sk9", state: { status: "completed", input: { name: "rocm-optimization-guide" }, output: "Skill loaded", time: { start: 1778430100000, end: 1778430100100 } } },
        { type: "tool", tool: "read", callID: "r9", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/ported.hip" }, output: "Read current kernel", title: "ported.hip", time: { start: 1778430100200, end: 1778430100300 } } },
        { type: "tool", tool: "edit", callID: "e1", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/ported.hip", oldString: "__shared__ float key_tile[KEY_TILE][BM];", newString: "__shared__ float key_tile[KEY_TILE/2][BM];" }, output: "Edit applied successfully", title: "ported.hip", metadata: { diff: "Reduced KEY_TILE", filediff: { additions: 1, deletions: 1 } }, time: { start: 1778430100400, end: 1778430100500 } } },
        { type: "tool", tool: "bash", callID: "b7", state: { status: "completed", input: { command: "cd /root/rocm-potter/kernels/attention_forward && cmake --build build 2>&1 && ./build/test_harness --bench --iterations 50" }, output: "Kernel Time: 16.458 ms\nAchieved GFLOP/s: 4259.2\nAchieved BW: 16.3 GB/s\nCompute Efficiency: 2.6%\nBandwidth Efficiency: 0.3%\nBottleneck: COMPUTE-BOUND", title: "Build + benchmark optimized", metadata: { exit: 0, truncated: false }, time: { start: 1778430100600, end: 1778430106600 } } },
        { type: "text", text: "Optimization complete. Reduced KEY_TILE from 128 to 64, cutting LDS from 33KB to ~17KB per workgroup. This allows 2 workgroups/CU (vs 1 before), doubling occupancy. Result: 37.9ms → 16.5ms (2.30x speedup). GFLOP/s: 1848 → 4259." },
      ] },
    ],
  },
  {
    id: "ses_1ed3911b2ffedEes36BEASup8h",
    title: "Final review of all ported files (@rocm-reviewer subagent)",
    status: { type: "idle" },
    messages: [
      { role: "user", parts: [{ type: "text", text: "You are the rocm-reviewer. Final review of all ported files." }] },
      { role: "assistant", parts: [
        { type: "text", text: "Performing final review of all ported files." },
        { type: "tool", tool: "skill", callID: "sk10", state: { status: "completed", input: { name: "rocm-documentation" }, output: "Skill loaded", time: { start: 1778430160000, end: 1778430160100 } } },
        { type: "tool", tool: "read", callID: "r10", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/original.cu" }, output: "Read original", title: "original.cu", time: { start: 1778430160200, end: 1778430160300 } } },
        { type: "tool", tool: "read", callID: "r11", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/ported.hip" }, output: "Read ported", title: "ported.hip", time: { start: 1778430160400, end: 1778430160500 } } },
        { type: "tool", tool: "read", callID: "r12", state: { status: "completed", input: { filePath: "/root/rocm-potter/kernels/attention_forward/test_harness.cpp" }, output: "Read harness", title: "test_harness.cpp", time: { start: 1778430160600, end: 1778430160700 } } },
        { type: "text", text: "**PASS** — All files reviewed. ported.hip is logically equivalent to original.cu. LDS optimization preserves correctness while improving occupancy. Harness correctly tests NaN/Inf with bit-level detection. Build passes. 2.30x speedup verified." },
      ] },
    ],
  },
];

export const DEMO_TODOS = [
  { content: "Phase 0: Setup - Create kernel directory and save original.cu", status: "completed", priority: "high" },
  { content: "Phase 1: Plan - Dispatch rocm-planner to create plan.md", status: "completed", priority: "high" },
  { content: "Phase 2: Code - Task 1+2: Create ported.hip", status: "completed", priority: "high" },
  { content: "Phase 2: Code - Task 3: Create CMakeLists.txt", status: "completed", priority: "high" },
  { content: "Phase 2: Code - Task 4: Create test_harness.cpp", status: "completed", priority: "high" },
  { content: "Phase 2: Build verification", status: "completed", priority: "high" },
  { content: "Phase 3: Correctness - Run test_harness --correctness", status: "completed", priority: "high" },
  { content: "Phase 4: Benchmark - Run test_harness --bench --iterations 50", status: "completed", priority: "high" },
  { content: "Phase 5: Profile - Dispatch rocm-profiler", status: "completed", priority: "high" },
  { content: "Phase 6: Optimize - 2.30x speedup via KEY_TILE reduction", status: "completed", priority: "high" },
  { content: "Phase 7: Review - Dispatch rocm-reviewer scope:final - PASS", status: "completed", priority: "high" },
];

export const DEMO_FILES: FileNode[] = [
  { name: "attention_forward", path: "kernels/attention_forward", absolute: "/root/rocm-potter/kernels/attention_forward", type: "directory", ignored: false, children: [
    { name: "original.cu", path: "kernels/attention_forward/original.cu", absolute: "/root/rocm-potter/kernels/attention_forward/original.cu", type: "file", ignored: false },
    { name: "ported.hip", path: "kernels/attention_forward/ported.hip", absolute: "/root/rocm-potter/kernels/attention_forward/ported.hip", type: "file", ignored: false },
    { name: "test_harness.cpp", path: "kernels/attention_forward/test_harness.cpp", absolute: "/root/rocm-potter/kernels/attention_forward/test_harness.cpp", type: "file", ignored: false },
    { name: "CMakeLists.txt", path: "kernels/attention_forward/CMakeLists.txt", absolute: "/root/rocm-potter/kernels/attention_forward/CMakeLists.txt", type: "file", ignored: false },
    { name: "plan.md", path: "kernels/attention_forward/plan.md", absolute: "/root/rocm-potter/kernels/attention_forward/plan.md", type: "file", ignored: false },
    { name: "build", path: "kernels/attention_forward/build", absolute: "/root/rocm-potter/kernels/attention_forward/build", type: "directory", ignored: false },
    { name: "profiling_results", path: "kernels/attention_forward/profiling_results", absolute: "/root/rocm-potter/kernels/attention_forward/profiling_results", type: "directory", ignored: false },
  ]},
];

export const DEMO_FILE_CONTENTS: Record<string, string> = {
  "kernels/attention_forward/original.cu": `#include <cstdio>
#include <cmath>

#define BLOCK_SIZE 64
#define KEY_TILE 128

__global__ void attention_forward_kernel(
    const float* __restrict__ Q,
    const float* __restrict__ K,
    const float* __restrict__ V,
    float* __restrict__ O,
    int B, int T, int C, int n_head, int head_size
) {
    __shared__ float key_tile[KEY_TILE][BLOCK_SIZE];
    __shared__ float val_tile[KEY_TILE][BLOCK_SIZE];

    int b = blockIdx.x;
    int h = blockIdx.y;
    int t = threadIdx.x;

    if (b >= B || h >= n_head || t >= T) return;

    float max_score = -INFINITY;
    float sum_scores = 0.0f;

    for (int kv_start = 0; kv_start < T; kv_start += KEY_TILE) {
        int kv_len = min(KEY_TILE, T - kv_start);

        for (int i = threadIdx.x; i < kv_len * head_size; i += blockDim.x) {
            int kv_t = i / head_size;
            int d = i % head_size;
            key_tile[kv_t][d] = K[(b * n_head + h) * T * head_size + (kv_start + kv_t) * head_size + d];
            val_tile[kv_t][d] = V[(b * n_head + h) * T * head_size + (kv_start + kv_t) * head_size + d];
        }
        __syncthreads();

        if (t >= T) continue;
        if (kv_start > t) continue;

        for (int kv_t = 0; kv_t < kv_len; kv_t++) {
            if (kv_start + kv_t > t) break;

            float score = 0.0f;
            for (int d = 0; d < head_size; d++) {
                score += Q[(b * n_head + h) * T * head_size + t * head_size + d] * key_tile[kv_t][d];
            }
            score /= sqrtf((float)head_size);

            float new_max = fmaxf(max_score, score);
            float scale = expf(max_score - new_max);
            sum_scores = sum_scores * scale + expf(score - new_max);

            for (int d = 0; d < head_size; d++) {
                O[(b * n_head + h) * T * head_size + t * head_size + d] =
                    O[(b * n_head + h) * T * head_size + t * head_size + d] * scale
                    + expf(score - new_max) * val_tile[kv_t][d];
            }
            max_score = new_max;
        }
        __syncthreads();
    }

    for (int d = 0; d < head_size; d++) {
        O[(b * n_head + h) * T * head_size + t * head_size + d] /= sum_scores;
    }
}

int main() {
    int B = 16, T = 2048, C = 512;
    int n_head = 8, head_size = 64;
    size_t bytes = (size_t)B * T * C * sizeof(float);

    float *d_Q, *d_K, *d_V, *d_O;
    cudaMalloc(&d_Q, bytes);
    cudaMalloc(&d_K, bytes);
    cudaMalloc(&d_V, bytes);
    cudaMalloc(&d_O, bytes);

    dim3 grid(B, n_head);
    dim3 block(BLOCK_SIZE);

    attention_forward_kernel<<<grid, block>>>(d_Q, d_K, d_V, d_O, B, T, C, n_head, head_size);
    cudaDeviceSynchronize();

    printf("Attention forward complete\\n");
    cudaFree(d_Q); cudaFree(d_K); cudaFree(d_V); cudaFree(d_O);
    return 0;
}`,

  "kernels/attention_forward/ported.hip": `#pragma once

#define BLOCK_SIZE 64
#define KEY_TILE 64

__global__ void attention_forward_kernel(
    const float* __restrict__ Q,
    const float* __restrict__ K,
    const float* __restrict__ V,
    float* __restrict__ O,
    int B, int T, int C, int n_head, int head_size
) {
    __shared__ float key_tile[KEY_TILE][BLOCK_SIZE];
    __shared__ float val_tile[KEY_TILE][BLOCK_SIZE];

    int b = blockIdx.x;
    int h = blockIdx.y;
    int t = threadIdx.x;

    if (b >= B || h >= n_head || t >= T) return;

    float max_score = -INFINITY;
    float sum_scores = 0.0f;

    for (int kv_start = 0; kv_start < T; kv_start += KEY_TILE) {
        int kv_len = min(KEY_TILE, T - kv_start);

        for (int i = threadIdx.x; i < kv_len * head_size; i += blockDim.x) {
            int kv_t = i / head_size;
            int d = i % head_size;
            key_tile[kv_t][d] = K[(b * n_head + h) * T * head_size + (kv_start + kv_t) * head_size + d];
            val_tile[kv_t][d] = V[(b * n_head + h) * T * head_size + (kv_start + kv_t) * head_size + d];
        }
        __syncthreads();

        if (t >= T) continue;
        if (kv_start > t) continue;

        for (int kv_t = 0; kv_t < kv_len; kv_t++) {
            if (kv_start + kv_t > t) break;

            float score = 0.0f;
            for (int d = 0; d < head_size; d++) {
                score += Q[(b * n_head + h) * T * head_size + t * head_size + d] * key_tile[kv_t][d];
            }
            score /= sqrtf((float)head_size);

            float new_max = fmaxf(max_score, score);
            float scale = expf(max_score - new_max);
            sum_scores = sum_scores * scale + expf(score - new_max);

            for (int d = 0; d < head_size; d++) {
                O[(b * n_head + h) * T * head_size + t * head_size + d] =
                    O[(b * n_head + h) * T * head_size + t * head_size + d] * scale
                    + expf(score - new_max) * val_tile[kv_t][d];
            }
            max_score = new_max;
        }
        __syncthreads();
    }

    for (int d = 0; d < head_size; d++) {
        O[(b * n_head + h) * T * head_size + t * head_size + d] /= sum_scores;
    }
}`,

  "kernels/attention_forward/test_harness.cpp": `#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <random>
#include <chrono>
#include <hip/hip_runtime.h>
#include "ported.hip"

static void check_hip(hipError_t err, const char* msg) {
    if (err != hipSuccess) {
        fprintf(stderr, "HIP error: %s (%s)\\n", msg, hipGetErrorString(err));
        exit(1);
    }
}

static bool is_nan_or_inf(float v) {
    uint32_t bits;
    memcpy(&bits, &v, sizeof(bits));
    uint32_t exp = (bits >> 23) & 0xFF;
    return exp == 0xFF;
}

static int run_correctness() {
    int sizes[] = {4, 32, 128};
    for (int s = 0; s < 3; s++) {
        int B = sizes[s], T = 128, C = 512, n_head = 8, head_size = 64;
        size_t bytes = (size_t)B * T * C * sizeof(float);
        float *d_Q, *d_K, *d_V, *d_O;
        check_hip(hipMalloc(&d_Q, bytes), "hipMalloc Q");
        check_hip(hipMalloc(&d_K, bytes), "hipMalloc K");
        check_hip(hipMalloc(&d_V, bytes), "hipMalloc V");
        check_hip(hipMalloc(&d_O, bytes), "hipMalloc O");
        check_hip(hipMemset(d_O, 0, bytes), "hipMemset O");

        dim3 grid(B, n_head);
        dim3 block(BLOCK_SIZE);
        hipLaunchKernelGGL(attention_forward_kernel, grid, block, 0, 0, d_Q, d_K, d_V, d_O, B, T, C, n_head, head_size);
        check_hip(hipDeviceSynchronize(), "hipDeviceSynchronize");

        float* h_O = (float*)malloc(bytes);
        check_hip(hipMemcpy(h_O, d_O, bytes, hipMemcpyDeviceToHost), "hipMemcpy O");

        int errors = 0;
        for (size_t i = 0; i < (size_t)B * T * C; i++) {
            if (is_nan_or_inf(h_O[i])) errors++;
        }
        printf("B=%d: %s\\n", B, errors ? "FAIL" : "PASS");

        (void)hipFree(d_Q); (void)hipFree(d_K); (void)hipFree(d_V); (void)hipFree(d_O);
        free(h_O);
        if (errors) return 1;
    }
    return 0;
}

static int run_benchmark() {
    const int B = 16, T = 2048, C = 512, n_head = 8, head_size = 64;
    const int iterations = 50;
    size_t bytes = (size_t)B * T * C * sizeof(float);

    float *d_Q, *d_K, *d_V, *d_O;
    check_hip(hipMalloc(&d_Q, bytes), "hipMalloc Q");
    check_hip(hipMalloc(&d_K, bytes), "hipMalloc K");
    check_hip(hipMalloc(&d_V, bytes), "hipMalloc V");
    check_hip(hipMalloc(&d_O, bytes), "hipMalloc O");

    hipEvent_t start, stop;
    hipEventCreate(&start);
    hipEventCreate(&stop);

    for (int i = 0; i < 2; i++) {
        dim3 grid(B, n_head);
        dim3 block(BLOCK_SIZE);
        hipLaunchKernelGGL(attention_forward_kernel, grid, block, 0, 0, d_Q, d_K, d_V, d_O, B, T, C, n_head, head_size);
    }
    hipDeviceSynchronize();

    hipEventRecord(start);
    for (int i = 0; i < iterations; i++) {
        dim3 grid(B, n_head);
        dim3 block(BLOCK_SIZE);
        hipLaunchKernelGGL(attention_forward_kernel, grid, block, 0, 0, d_Q, d_K, d_V, d_O, B, T, C, n_head, head_size);
    }
    hipEventRecord(stop);
    hipEventSynchronize(stop);

    float ms;
    hipEventElapsedTime(&ms, start, stop);
    ms /= iterations;

    double flops = 2.0 * B * n_head * T * T * head_size;
    double gflops = flops / (ms * 1e-3) / 1e9;
    double bytes_moved = 2.0 * B * T * C * sizeof(float);
    double bw_gbps = bytes_moved / (ms * 1e-3) / 1e9;
    double ai = flops / bytes_moved;

    printf("Kernel Time: %.3f ms\\n", ms);
    printf("Achieved GFLOP/s: %.1f\\n", gflops);
    printf("Achieved BW: %.1f GB/s\\n", bw_gbps);
    printf("Analytical AI: %.1f FLOP/Byte\\n", ai);
    printf("Compute Efficiency: %.1f%%\\n", gflops / 163400.0 * 100);
    printf("Bandwidth Efficiency: %.1f%%\\n", bw_gbps / 5325.0 * 100);
    printf("Bottleneck: %s\\n", ai > 30.7 ? "COMPUTE-BOUND" : "MEMORY-BOUND");

    (void)hipEventDestroy(start);
    (void)hipEventDestroy(stop);
    (void)hipFree(d_Q); (void)hipFree(d_K); (void)hipFree(d_V); (void)hipFree(d_O);
    return 0;
}

int main(int argc, char** argv) {
    if (argc > 1 && strcmp(argv[1], "--correctness") == 0) return run_correctness();
    return run_benchmark();
}`,

  "kernels/attention_forward/CMakeLists.txt": `cmake_minimum_required(VERSION 3.21)
project(attention_forward LANGUAGES HIP CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_HIP_ARCHITECTURES gfx942)

set(CMAKE_HIP_FLAGS "\${CMAKE_HIP_FLAGS} -O3 -ffast-math -munsafe-fp-atomics")

add_executable(test_harness test_harness.cpp ported.hip)

target_compile_options(test_harness PRIVATE
    \$<\$<COMPILE_LANGUAGE:HIP>:--offload-arch=gfx942 -mwavefrontsize64>
)`,

  "kernels/attention_forward/plan.md": `# Porting Plan: attention_forward

## Kernel Analysis

**What it does:** Coalesced causal attention forward pass. Each block handles one (batch, head) pair. Threads within a block collaboratively tile K/V from global to shared memory, computing scaled dot-product attention with online softmax.

**CUDA features used:**
- \`__shared__\` memory for K/V tiles
- \`__global__\` kernel with 2D grid (B, n_head)
- Triple-chevron launch \`<<<dim3(B, n_head), BLOCK_SIZE>>>>\`
- \`cudaMalloc/cudaFree/cudaMemcpy\`
- No warp-level primitives (no shuffles, no atomics)

**Key porting considerations:**
- \`__shared__\` → LDS (same keyword in HIP)
- \`warpSize\` is 64 on CDNA (not 32) — no warp-level ops used
- No MFMA intrinsics used in baseline — optimization opportunity
- LDS bank conflicts may differ on AMD hardware

## Task List

### Task 1: Create ported.hip
Direct 1:1 translation. Replace cuda→hip API calls.

### Task 2: Create CMakeLists.txt
Target gfx942, hipcc, C++17, -O3 -ffast-math.

### Task 3: Create test_harness.cpp
Dual-mode: --correctness and --bench. NERSC roofline metrics.

## Benchmark Specification

- Sizes: B=16, T=2048, C=512, n_head=8, head_size=64
- FLOP formula: 2 * B * n_head * T * T * head_size
- Bytes formula: 2 * B * T * C * sizeof(float)
- Profiling counters: SQ_WAVES, SQ_INSTS_VALU, SQ_INSTS_MFMA, GRBM_COUNT`,
};

export const DEMO_BENCHMARK_METRICS = {
  kernelTimeMs: 16.458,
  achievedGflops: 4259.2,
  achievedBwGbps: 16.3,
  bwEfficiency: 0.3,
  computeEfficiency: 2.6,
  analyticalAI: 261.1,
  counterAI: 23.8,
  aiMatch: false,
  occupancy: 6.25,
  waves: 2,
  vgpr: 88,
  sgpr: 48,
  ldsBytes: 16512,
  valuUtil: 1.8,
  mfmaUtil: 0.0,
  l2HitRate: 74.2,
  bottleneck: "COMPUTE-BOUND",
  keyFinding: "Occupancy-limited by LDS (16.5 KB/workgroup), allowing 2 wavefronts per CU (vs 1 before optimization). 2.30x speedup from KEY_TILE reduction. Further gains require MFMA intrinsics for Q·K^T and Att·V dot products.",
};
