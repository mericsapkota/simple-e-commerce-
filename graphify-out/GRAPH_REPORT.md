# Graph Report - ../client  (2026-04-29)

## Corpus Check
- 22 files · ~4,190 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 35 nodes · 15 edges · 1 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `uploadImageToCloudinary()` - 2 edges
2. `handleSubmit()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `uploadImageToCloudinary()`  [INFERRED]
  src/components/products/ProductForm.tsx → src/utils/fileUpload.ts

## Communities

### Community 2 - "Community 2"
Cohesion: 0.67
Nodes (2): handleSubmit(), uploadImageToCloudinary()

## Knowledge Gaps
- **Thin community `Community 2`** (3 nodes): `handleSubmit()`, `ProductForm.tsx`, `uploadImageToCloudinary()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `uploadImageToCloudinary()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._