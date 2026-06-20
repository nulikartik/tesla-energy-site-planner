# Industrial Energy Site Layout Planner

[cite_start]An enterprise-grade orchestration tool designed to mockup the build of materials and physical site arrangements for Industrial Energy Battery sites[cite: 3]. Built with mechanical empathy for browser rendering pipelines, high data cohesion, and deterministic geometric layouts.

## 🏗️ Architectural Topology & System Layout

The application operates on a strict unidirectional data flow model to isolate heavy geometric math from UI re-render lifecycles:

                  ┌────────────────────────────────────────┐
                  │          [ User UI Controls ]          │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼ (Interactions / Delta Shifts)
                  ┌────────────────────────────────────────┐
                  │       useSiteBuilderState Hook         │ ◄─── [ URL Params Hydration ]
                  └─────────┬────────────────────┬─────────┘      (On Lifecycle Mount)
                            │                    │
 (Passes Unstable Object)   │                    │ (Dispatches Network Payloads)
       As Raw Quantities    │                    │  Via RESTful POST/PUT Fork
                            ▼                    ▼
        ┌───────────────────────┐    ┌───────────────────────┐
        │    layoutEngine.ts    │    │   sessionService.ts   │
        │                       │    │                       │
        │ • Pure Geometry Pass  │    │ • State Persistence   │
        │ • Clamps Rows to 100ft│    │ • Prevents Link Drift │
        └───────────┬───────────┘    └───────────────────────┘
                    │
                    ▼ (Emits Row Chunks / Node Arrays)
        ┌────────────────────────────────────────┐
        │            Canvas View Tree            │
        │                                        │
        │  • DOM Paint Pruning via React.memo    │
        │  • Tracking: JSON.stringify(quantities)│
        │  • Fluid Typography: Container Queries │
        └────────────────────────────────────────┘
        