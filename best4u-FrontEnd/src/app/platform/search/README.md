# platform/search

Global search (Section 15): a registry that every feature module registers
its searchable tools/pages into, plus the search UI itself (used from
`layout/header`). Cross-cutting — not owned by any one feature, which is
why it lives in `platform/` rather than `features/`.

Starts simple (client-side keyword match against the registry); natural-
language/AI-powered search (Section 8, the AI module) is a later addition,
not a rebuild.
