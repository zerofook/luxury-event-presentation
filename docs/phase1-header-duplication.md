# Phase 1 / Phase 2 site header duplication

The guest experience (`#/`) uses `src/components/GuestSiteHeader.tsx` with `src/styles/guest-header.css` (`g-header` classes).

The proposal page (`#/proposal`) uses `src/phase2/components/ProposalSiteHeader.tsx` with styles in `src/phase2/styles/proposal.css` (`p2-header` classes).

These two headers are **intentionally duplicated** while parallel branches touch Phase 1 and Phase 2 separately. After both lines of work merge to `main`, unify them into one shared component and stylesheet.
