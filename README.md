# Nucleus State

> Lightweight React state management for UI components

[![npm version](https://badge.fury.io/js/nucleus-state.svg)](https://badge.fury.io/js/nucleus-state)
[![Build Status](https://github.com/YOUR_USERNAME/nucleus-state/workflows/CI/badge.svg)](https://github.com/sinhaparth5/nucleus-state/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/nucleus-state)](https://bundlephobia.com/package/nucleus-state)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**Nucleus State** is a tiny (~2KB), TypeScript-first state management solution for React that eliminates prop drilling for small UI states. Perfect for modals, tabs, themes, and other component-level state that needs to be shared.

## ✨ Features

- 🪶 **Tiny Bundle**: Less than 2KB gzipped
- 🔥 **Zero Config**: No providers, no boilerplate
- ⚛️ **React 18 Ready**: Built with `useSyncExternalStore`
- 🏷️ **TypeScript First**: Full type inference out of the box
- 🔧 **DevTools Friendly**: Debug atoms in development
- 💾 **Persistence**: Optional localStorage integration
- 🎯 **Focused**: Designed for UI state, not app-wide data

## 🚀 Quick Start

```bash
npm install nucleus-state
```

```tsx
import { createAtom, useAtom } from 'nucleus-state';

// Create an atom
const modalAtom = createAtom(false);

function OpenButton() {
  const [isOpen, setOpen] = useAtom(modalAtom);
  return <button onClick={() => setOpen(true)}>Open Modal</button>;
}

function Modal() {
  const [isOpen, setOpen] = useAtom(modalAtom);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <h2>Modal Content</h2>
      <button onClick={() => setOpen(false)}>Close</button>
    </div>
  );
}
```

## 🎯 Perfect For

- **Modal States**: Show/hide modals from anywhere
- **Tab Navigation**: Active tab state across components  
- **Theme Switching**: Dark/light mode that persists
- **Form Wizards**: Step state in multi-step forms
- **UI Toggles**: Sidebar collapse, dropdown states
- **Shopping Carts**: Item counts and mini cart states

## 📖 API Reference

### `createAtom(initialValue, options?)`

Creates a new atom with an initial value.

```tsx
const countAtom = createAtom(0);
const userAtom = createAtom({ name: 'John', age: 30 });
const themeAtom = createAtom('light', { name: 'theme' });
```

**Parameters:**
- `initialValue`: Any value to initialize the atom
- `options.name`: Optional name for debugging

### `useAtom(atom)`

Returns the current value and a setter function.

```tsx
const [count, setCount] = useAtom(countAtom);

// Update with new value
setCount(42);

// Update with function
setCount(prev => prev + 1);
```

### `useAtomValue(atom)`

Returns only the current value (read-only).

```tsx
const count = useAtomValue(countAtom);
```

### `useSetAtom(atom)`

Returns only the setter function.

```tsx
const setCount = useSetAtom(countAtom);
setCount(42);
```

### `createComputed(fn)`

Creates a computed atom that derives its value from other atoms.

```tsx
const firstNameAtom = createAtom('John');
const lastNameAtom = createAtom('Doe');

const fullNameAtom = createComputed(() => 
  `${firstNameAtom.get()} ${lastNameAtom.get()}`
);

const fullName = useAtomValue(fullNameAtom);
```

## 🏗️ Real-World Examples

### Modal Management

Instead of prop drilling modal state through multiple components:

```tsx
// ❌ Before: Prop drilling nightmare
function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <Layout>
      <Header onOpenModal={() => setModalOpen(true)} />
      <Content modalOpen={isModalOpen} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}

// ✅ After: Clean and simple
const modalAtom = createAtom(false);

function Header() {
  const setModalOpen = useSetAtom(modalAtom);
  return <button onClick={() => setModalOpen(true)}>Open Modal</button>;
}

function Modal() {
  const [isOpen, setOpen] = useAtom(modalAtom);
  return isOpen ? <div>Modal content</div> : null;
}
```

### Tab Navigation

```tsx
const activeTabAtom = createAtom('overview');

function TabHeader() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  
  return (
    <div className="tabs">
      {['overview', 'details', 'settings'].map(tab => (
        <button
          key={tab}
          className={activeTab === tab ? 'active' : ''}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function TabContent() {
  const activeTab = useAtomValue(activeTabAtom);
  
  switch (activeTab) {
    case 'overview': return <OverviewPanel />;
    case 'details': return <DetailsPanel />;
    case 'settings': return <SettingsPanel />;
  }
}
```

### Theme Persistence

```tsx
const themeAtom = createAtom('light', { persist: 'app-theme' });

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function App() {
  const theme = useAtomValue(themeAtom);
  
  return (
    <div className={`app ${theme}`}>
      <ThemeToggle />
      {/* rest of app */}
    </div>
  );
}
```

### Form Wizard

```tsx
const currentStepAtom = createAtom(1);
const formDataAtom = createAtom({});

function StepIndicator() {
  const currentStep = useAtomValue(currentStepAtom);
  
  return (
    <div className="steps">
      {[1, 2, 3].map(step => (
        <div key={step} className={step === currentStep ? 'active' : ''}>
          Step {step}
        </div>
      ))}
    </div>
  );
}

function NavigationButtons() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  
  return (
    <div>
      {currentStep > 1 && (
        <button onClick={() => setCurrentStep(prev => prev - 1)}>
          Previous
        </button>
      )}
      {currentStep < 3 && (
        <button onClick={() => setCurrentStep(prev => prev + 1)}>
          Next
        </button>
      )}
    </div>
  );
}
```

## 🛠️ Advanced Usage

### Development Tools

In development mode, atoms are automatically tracked for debugging:

```tsx
const modalAtom = createAtom(false, { name: 'modalOpen' });

// In browser console:
window.__NUCLEUS_ATOMS__.get('modalOpen'); // Get current value
window.__NUCLEUS_ATOMS__.list(); // List all atoms
```

### Custom Storage

```tsx
// Custom storage adapter
const sessionStorageAdapter = {
  getItem: (key: string) => sessionStorage.getItem(key),
  setItem: (key: string, value: string) => sessionStorage.setItem(key, value),
};

const tempDataAtom = createAtom(
  { temp: true }, 
  { persist: 'temp-data', storage: sessionStorageAdapter }
);
```

### TypeScript Tips

```tsx
// Explicit typing
interface User {
  id: number;
  name: string;
}

const userAtom = createAtom<User | null>(null);

// The hook automatically infers the type
const [user, setUser] = useAtom(userAtom); // user: User | null
```

## 🤔 When to Use Nucleus State

**✅ Great for:**
- Modal, dropdown, tooltip states
- Active tabs, accordions, carousels  
- Theme preferences, UI settings
- Simple form state (current step, validation)
- Shopping cart UI state
- Temporary UI flags and toggles

**❌ Consider alternatives for:**
- Complex business logic
- Server state management (use React Query, SWR)
- Large app-wide state (use Zustand, Redux)
- Performance-critical state (use React.memo, useMemo)

## 🏆 Comparison

| Feature | Nucleus State | useState | Context | Zustand | Jotai |
|---------|---------------|----------|---------|---------|-------|
| Bundle Size | ~2KB | 0KB | 0KB | ~8KB | ~13KB |
| Setup | None | None | Provider | Store | Provider |
| TypeScript | Excellent | Good | Manual | Good | Excellent |
| DevTools | Basic | React | React | Advanced | Advanced |
| Learning Curve | Minimal | None | Medium | Medium | Medium |
| Use Case | UI State | Local | App-wide | App-wide | Granular |

## 📋 Requirements

- React 16.8+ (hooks support)
- TypeScript 4.1+ (for best experience)

## 🧪 Testing

```tsx
import { createAtom } from 'nucleus-state';
import { renderHook, act } from '@testing-library/react';

test('atom updates correctly', () => {
  const atom = createAtom(0);
  const { result } = renderHook(() => useAtom(atom));

  act(() => {
    result.current[1](1);
  });

  expect(result.current[0]).toBe(1);
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Inspired by [Jotai](https://jotai.org/) and [Valtio](https://valtio.pmnd.rs/)
- Built with [tsup](https://tsup.egoist.sh/) and [Vitest](https://vitest.dev/)
- Uses React's `useSyncExternalStore` for optimal performance

---

**Made with ❤️ for the React community**