# Graph Report - client  (2026-05-04)

## Corpus Check
- 23 files · ~4,953 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 44 nodes · 27 edges · 4 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `uploadImageToCloudinary()` - 3 edges
2. `handleSubmit()` - 2 edges
3. `ProtectedRoute()` - 2 edges
4. `LoginForm()` - 2 edges
5. `Dashboard()` - 2 edges
6. `SignupForm()` - 2 edges
7. `setAuthToken()` - 2 edges
8. `ProductCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `uploadImageToCloudinary()` --calls--> `handleSubmit()`  [INFERRED]
  src/utils/fileUpload.ts → src/components/products/ProductForm.tsx

## Communities (18 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (4): ProtectedRoute(), Dashboard(), LoginForm(), SignupForm()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._