# Static Site Import

SkillPage will support users who build their own portfolio with ChatGPT, Claude, an IDE, or another tool and upload a ZIP.

## V1 supported input

- `index.html`
- CSS files
- browser-side JavaScript
- images and other approved static assets
- web fonts in approved formats
- JSON/data files used by the static site

No server-side code is executed.

## Processing pipeline

`ZIP upload -> size/file-count validation -> archive traversal validation -> file-type validation -> HTML validation -> asset normalization -> isolated publish -> smoke check -> publish`

The importer must reject path traversal, symbolic links, executable/server-side files, package manifests, lockfiles, hidden deployment configuration, and files that attempt to cross the SkillPage application boundary.

## Security boundary

Imported content must not execute in the authenticated dashboard origin. Published imported sites require a separate site origin or equivalent strong isolation boundary. They must not receive SkillPage authentication cookies or internal API credentials.

V1 should not run arbitrary build commands. There is no `npm install`, package execution, shell execution, server-side JavaScript, PHP, Python, or framework build during import.

## Future builds

React/Vite/Astro/static Next exports may be supported through a dedicated sandboxed build service. It must have explicit CPU, memory, time, package, filesystem and network limits and must emit static assets only.

## Versioning

Every imported site becomes a version of the user's portfolio site. Publishing a new ZIP must not mutate the previous published version until validation succeeds. Rollback should point the site at the previous known-good version.
