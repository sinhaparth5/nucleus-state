# Nucleus State

Lightweight React state management for shared UI state.

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://react.dev/)

Nucleus State is a small TypeScript-first state library for React. It is designed for state that needs to be shared across components without adding providers, reducers, or heavy store setup.

It works well for:

- modals and drawers
- tabs and view state
- theme and preference state
- form steps and temporary UI data
- small derived values built from existing atoms

## Installation

```bash
npm install @sinhaparth5/nucleus-state
```

## Quick Start

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

## Why Nucleus State

- Provider-free API
- Small surface area
- TypeScript-first ergonomics
- Read/write hooks that feel like React state
- Built-in persistence helpers
- Derived state with computed atoms
- Development-time atom registry for debugging

## API

### `createAtom(initialValue, options?)`

Creates a mutable atom with `get()`, `set()`, `reset()`, and `subscribe()`.

```tsx
const countAtom = createAtom(0);
const themeAtom = createAtom('light', { persist: 'theme' });
```

Options:

- `name`: debug label for development tooling
- `persist`: storage key used for persistence
- `storage`: custom storage object with `getItem` and `setItem`

### `useAtom(atom)`

Returns the current value and setter.

```tsx
const [count, setCount] = useAtom(countAtom);

setCount(1);
setCount(prev => prev + 1);
```

### `useAtomValue(atom)`

Returns the current value only.

```tsx
const theme = useAtomValue(themeAtom);
```

### `useSetAtom(atom)`

Returns the setter only.

```tsx
const setTheme = useSetAtom(themeAtom);
```

### `atom.reset()`

Restores an atom to its original initial value.

```tsx
const countAtom = createAtom(0);

countAtom.set(5);
countAtom.reset();

countAtom.get(); // 0
```

### `createComputed(dependencies, compute)`

Creates a read-only derived atom that updates from other atoms.

```tsx
import {
  createAtom,
  createComputed,
  useAtomValue,
} from '@sinhaparth5/nucleus-state';

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
const timestampAtom = createComputed(() => Date.now());
```

That form computes once and does not subscribe to dependencies automatically.

## Persistence

Atoms can persist state in browser storage and safely fall back when storage is unavailable.

```tsx
const settingsAtom = createAtom(
  { notifications: true, language: 'en' },
  { persist: 'user-settings' },
);
```

For convenience, the package also exports:

```tsx
import {
  createPersistedAtom,
  createSessionAtom,
} from '@sinhaparth5/nucleus-state';

const themeAtom = createPersistedAtom('light', 'theme');
const wizardAtom = createSessionAtom({ step: 1 }, 'wizard');
```

Custom storage is supported:

```tsx
const draftAtom = createAtom(
  { value: '' },
  {
    persist: 'draft',
    storage: {
      getItem: key => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value),
    },
  },
);
```

## Devtools

In development, named atoms are exposed on `window.__NUCLEUS_ATOMS__`.

```tsx
const userAtom = createAtom(null, { name: 'currentUser' });

console.log(window.__NUCLEUS_ATOMS__?.list());
console.log(window.__NUCLEUS_ATOMS__?.get('currentUser'));
```

## TypeScript

The package is designed for strong type inference out of the box.

```tsx
interface User {
  id: number;
  name: string;
}

const userAtom = createAtom<User | null>(null);

const [user, setUser] = useAtom(userAtom);
const userName = useAtomValue(userAtom)?.name;
```

## Examples

Example source lives in:

- `examples/basic-usage/App.tsx`
- `examples/modal-management/App.tsx`
- `examples/form-wizard/App.tsx`

A runnable playground is available in `examples/playground`.

```bash
pnpm example:dev
```

## Share on Twitter/X

Use this post if you want to share the project:

```text
Built `nucleus-state` for lightweight shared React state without providers or store boilerplate.

- TypeScript-first
- atom-based API
- computed state
- persistence helpers

Repo: https://github.com/sinhaparth5/nucleus-state

#react #typescript #opensource #webdev
```

## Requirements

- React `^19.1.0`
- TypeScript `4.1+`

## License

BSD-2-Clause © [Parth Sinha](https://github.com/sinhaparth5)
