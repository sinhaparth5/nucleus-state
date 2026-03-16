# Nucleus State

Lightweight React state management for UI components.

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1+-61DAFB.svg)](https://react.dev/)

Nucleus State is a small TypeScript-first state library for React. It is focused on simple shared UI state like modals, tabs, theme toggles, counters, form steps, and temporary client-side preferences.

## Installation

```bash
npm install @sinhaparth5/nucleus-state
# or
pnpm add @sinhaparth5/nucleus-state
# or
yarn add @sinhaparth5/nucleus-state
```

## Basic Usage

```tsx
import { createAtom, useAtom } from '@sinhaparth5/nucleus-state';

const modalAtom = createAtom(false, { name: 'modal' });

function OpenButton() {
  const [, setModalOpen] = useAtom(modalAtom);
  return <button onClick={() => setModalOpen(true)}>Open modal</button>;
}

function Modal() {
  const [isOpen, setModalOpen] = useAtom(modalAtom);

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <p>Settings</p>
      <button onClick={() => setModalOpen(false)}>Close</button>
    </div>
  );
}
```

## API

### `createAtom(initialValue, options?)`

Creates an atom with `get`, `set`, and `subscribe`.

```tsx
const countAtom = createAtom(0);
const themeAtom = createAtom('light', { persist: 'theme' });
```

Options:

- `name`: debug label used in development
- `persist`: storage key for persistence
- `storage`: custom storage object with `getItem` and `setItem`

### `useAtom(atom)`

Returns the current value and setter.

```tsx
const [count, setCount] = useAtom(countAtom);
setCount(1);
setCount(prev => prev + 1);
```

### `useAtomValue(atom)`

Reads the current value without returning a setter.

```tsx
const theme = useAtomValue(themeAtom);
```

### `useSetAtom(atom)`

Returns only the setter.

```tsx
const setTheme = useSetAtom(themeAtom);
```

### `createComputed(dependencies, compute)`

Creates a read-only derived atom that recomputes when one of its dependencies changes.

```tsx
import { createAtom, createComputed, useAtomValue } from '@sinhaparth5/nucleus-state';

const firstNameAtom = createAtom('Parth');
const lastNameAtom = createAtom('Sinha');

const fullNameAtom = createComputed(
  [firstNameAtom, lastNameAtom],
  () => `${firstNameAtom.get()} ${lastNameAtom.get()}`,
);

function ProfileName() {
  const fullName = useAtomValue(fullNameAtom);
  return <h1>{fullName}</h1>;
}
```

You can also use the simple form:

```tsx
const nowAtom = createComputed(() => Date.now());
```

That form computes once and does not subscribe to other atoms automatically.

## Persistence

Persistence works in the browser and safely falls back when storage is unavailable, such as during SSR or Node-based execution.

```tsx
const settingsAtom = createAtom(
  { notifications: true, language: 'en' },
  { persist: 'user-settings' },
);
```

Custom storage is supported:

```tsx
const tempDataAtom = createAtom(
  { temp: true },
  {
    persist: 'temp-data',
    storage: {
      getItem: key => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value),
    },
  },
);
```

Helper APIs are also exported:

```tsx
import { createPersistedAtom, createSessionAtom } from '@sinhaparth5/nucleus-state';

const themeAtom = createPersistedAtom('light', 'theme');
const wizardAtom = createSessionAtom({ step: 1 }, 'wizard');
```

## Devtools

In development builds, named atoms are exposed on `window.__NUCLEUS_ATOMS__`.

```tsx
const userAtom = createAtom(null, { name: 'currentUser' });

console.log(window.__NUCLEUS_ATOMS__?.list());
console.log(window.__NUCLEUS_ATOMS__?.get('currentUser'));
```

## Types

The package exports its atom and persistence types:

- `Atom<T>`
- `ReadonlyAtom<T>`
- `AtomSetter<T>`
- `AtomListener<T>`
- `AtomGetter<T>`
- `PersistStorage`

## Examples

Working example source files live in:

- `examples/basic-usage/App.tsx`
- `examples/modal-management/App.tsx`
- `examples/form-wizard/App.tsx`

A runnable playground app also lives in `examples/playground`.

Run it with:

```bash
pnpm example:dev
```

## Requirements

- React `^19.1.0`
- TypeScript `4.1+`
- Node.js `18+` for local development and CI

## Testing

```bash
pnpm test --run
pnpm lint
pnpm type-check
pnpm build
```

## Release

GitHub Packages release happens only when you push a tag that matches the version in `package.json`.

Before you tag a release, run:

```bash
pnpm release:prepare
```

That command:

- refreshes `CHANGELOG.md`
- runs lint, tests, type-check, library build, and playground build
- validates that the current package version is ready for a matching `v<version>` tag

Example:

```bash
git tag v1.0.3
git push origin v1.0.3
```

That tag push runs the GitHub Actions release workflow, publishes to GitHub Packages, and creates the GitHub release.

For npm registry publishing from your local CLI, use normal npm publish flow:

```bash
npm publish
```

If this is the first public publish for the scoped package on npm, you may need:

```bash
npm publish --access public
```

## Next Steps

Recommended next work for the project:

1. Add more edge-case tests for SSR, storage failures, computed unsubscribe behavior, and devtools exposure in development only.
2. Make `createComputed` more robust by supporting dependency cleanup and clearer derived-state lifecycle behavior.
3. Add a small runnable example app, not just example source files, so users can try the package quickly.
4. Add a versioning workflow with changelog generation before wider public releases.
5. Consider the next feature set only after the API is stable. Best candidates are `atom.reset()`, atom families, and serializer/deserializer support for persistence.

## Contributing

[Contributing Guidelines](CONTRIBUTING.md)

## License

BSD-2-Clause © [Parth Sinha](https://github.com/sinhaparth5)
