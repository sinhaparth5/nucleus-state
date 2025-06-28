# Nucleus State

> Lightweight React state management for UI components

[![npm version](https://img.shields.io/npm/v/nucleus-state)](https://www.npmjs.com/package/nucleus-state)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/nucleus-state)](https://bundlephobia.com/package/nucleus-state)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

**Nucleus State** is a tiny (~2KB), TypeScript-first state management solution for React that eliminates prop drilling for small UI states. Perfect for modals, tabs, themes, and other component-level state that needs to be shared across your application without the complexity of larger state management libraries.

## ✨ Why Nucleus State?

- 🪶 **Tiny Bundle**: Less than 2KB gzipped - smaller than most icon libraries
- 🔥 **Zero Config**: No providers, no boilerplate, no setup required
- ⚛️ **React 18 Ready**: Built with modern React patterns using `useSyncExternalStore`
- 🏷️ **TypeScript First**: Full type inference and excellent developer experience
- 🔧 **DevTools Friendly**: Built-in debugging support in development
- 💾 **Persistence**: Optional localStorage/sessionStorage integration
- 🎯 **Focused**: Designed specifically for UI state, not complex app data
- 🚀 **Performance**: Minimal re-renders with surgical updates

## 🚀 Quick Start

### Installation

```bash
npm install nucleus-state
# or
yarn add nucleus-state
# or
pnpm add nucleus-state
```

### Basic Usage

Create atoms for your state and use them anywhere in your component tree:

```tsx
import { createAtom, useAtom } from 'nucleus-state';

// Create an atom (do this outside your components)
const modalAtom = createAtom(false);

function OpenButton() {
  const [, setModalOpen] = useAtom(modalAtom);
  return <button onClick={() => setModalOpen(true)}>Open Modal</button>;
}

function Modal() {
  const [isOpen, setModalOpen] = useAtom(modalAtom);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Welcome!</h2>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </div>
    </div>
  );
}

// Use them in completely different parts of your app - no prop drilling!
function App() {
  return (
    <div>
      <header>
        <OpenButton />
      </header>
      <main>
        {/* Other content */}
      </main>
      <Modal />
    </div>
  );
}
```

## 📖 Core API

### `createAtom(initialValue, options?)`

Creates a new atom with an initial value. Atoms are the basic unit of state in Nucleus.

```tsx
// Simple values
const countAtom = createAtom(0);
const nameAtom = createAtom('');
const themeAtom = createAtom('light');

// Objects and arrays
const userAtom = createAtom({ name: 'John', email: 'john@example.com' });
const todosAtom = createAtom([]);

// With options
const persistedThemeAtom = createAtom('light', { 
  persist: 'app-theme' // Automatically saves to localStorage
});
```

### `useAtom(atom)`

The primary hook for reading and writing atom values. Returns a tuple similar to `useState`.

```tsx
const [value, setValue] = useAtom(countAtom);

// Set new value
setValue(42);

// Update based on previous value
setValue(prev => prev + 1);
```

### `useAtomValue(atom)` - Read Only

When you only need to read the value without updating it:

```tsx
const count = useAtomValue(countAtom);
```

### `useSetAtom(atom)` - Write Only

When you only need the setter function:

```tsx
const setCount = useSetAtom(countAtom);
```

## 🎯 Perfect Use Cases

### Modal Management

**The Problem**: Passing modal state through multiple component layers.

**The Solution**:
```tsx
const modalAtom = createAtom(false);

// Trigger from anywhere
function NavButton() {
  const setModalOpen = useSetAtom(modalAtom);
  return <button onClick={() => setModalOpen(true)}>Settings</button>;
}

// Render anywhere
function SettingsModal() {
  const [isOpen, setModalOpen] = useAtom(modalAtom);
  return isOpen ? <div>Settings content...</div> : null;
}
```

### Theme Switching

**Persistent theme that works across page reloads:**

```tsx
const themeAtom = createAtom('light', { persist: 'theme' });

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

function App() {
  const theme = useAtomValue(themeAtom);
  return <div data-theme={theme}>{/* Your app */}</div>;
}
```

### Tab Navigation

**Clean tab state management:**

```tsx
const activeTabAtom = createAtom('overview');

function TabButtons() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const tabs = ['overview', 'details', 'settings'];
  
  return (
    <div className="tab-buttons">
      {tabs.map(tab => (
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
  
  return (
    <div className="tab-content">
      {activeTab === 'overview' && <OverviewPanel />}
      {activeTab === 'details' && <DetailsPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </div>
  );
}
```

### Shopping Cart Counter

**Shared cart state across components:**

```tsx
const cartItemsAtom = createAtom([]);

function AddToCartButton({ product }) {
  const [items, setItems] = useAtom(cartItemsAtom);
  
  const addItem = () => {
    setItems(prev => [...prev, product]);
  };
  
  return <button onClick={addItem}>Add to Cart</button>;
}

function CartCounter() {
  const items = useAtomValue(cartItemsAtom);
  return <span className="cart-count">{items.length}</span>;
}
```

## 🔧 Advanced Features

### Persistence

Automatically save atom values to localStorage or sessionStorage:

```tsx
// Auto-saves to localStorage
const settingsAtom = createAtom(
  { notifications: true, language: 'en' }, 
  { persist: 'user-settings' }
);

// Custom storage (e.g., sessionStorage)
const tempDataAtom = createAtom(
  { temp: true }, 
  { 
    persist: 'temp-data',
    storage: {
      getItem: (key) => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value)
    }
  }
);
```

### Development Tools

In development mode, Nucleus State provides debugging utilities:

```tsx
// Name your atoms for easier debugging
const userAtom = createAtom(null, { name: 'currentUser' });

// Access debug info in browser console
console.log(window.__NUCLEUS_ATOMS__);
```

### TypeScript Support

Nucleus State provides excellent TypeScript support with full type inference:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Type is automatically inferred
const userAtom = createAtom<User | null>(null);

// Hooks maintain type safety
const [user, setUser] = useAtom(userAtom); // user: User | null
const userName = useAtomValue(userAtom)?.name; // string | undefined
```

## 🤔 When to Use Nucleus State

### ✅ Perfect For:

- **UI Component State**: Modals, dropdowns, tooltips, sidebars
- **Navigation State**: Active tabs, current page, breadcrumbs
- **User Preferences**: Theme, language, layout settings
- **Form State**: Current step in wizards, temporary form data
- **Shopping/Cart State**: Item counts, selected items
- **Temporary Flags**: Loading states, error messages, notifications

### ❌ Consider Alternatives For:

- **Server State**: Use React Query, SWR, or Apollo Client
- **Complex Business Logic**: Consider Zustand, Redux Toolkit, or Valtio
- **Large-Scale Applications**: Might benefit from more structured state management
- **Performance-Critical State**: Use React's built-in optimizations first

## 🏆 Comparison with Alternatives

| Solution | Bundle Size | Setup Required | TypeScript | Learning Curve | Best For |
|----------|-------------|----------------|------------|----------------|----------|
| **Nucleus State** | ~2KB | None | Excellent | Minimal | UI State |
| useState + Props | 0KB | None | Good | None | Local State |
| React Context | 0KB | Provider | Manual | Medium | App-wide State |
| Zustand | ~8KB | Store Creation | Good | Medium | App State |
| Jotai | ~13KB | Provider | Excellent | Medium | Atomic State |
| Redux Toolkit | ~50KB+ | Significant | Good | High | Enterprise Apps |

## 📋 Requirements

- **React**: 16.8+ (hooks support required)
- **TypeScript**: 4.1+ (recommended for best experience)
- **Node.js**: 14+ (for development)

## 🧪 Testing

Testing components that use Nucleus State is straightforward:

```tsx
import { createAtom, useAtom } from 'nucleus-state';
import { render, screen, fireEvent } from '@testing-library/react';

const testAtom = createAtom(0);

function Counter() {
  const [count, setCount] = useAtom(testAtom);
  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

test('counter increments correctly', () => {
  render(<Counter />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Increment'));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## 🚦 Getting Started Checklist

1. **Install** Nucleus State: `npm install nucleus-state`
2. **Create** your first atom outside a component
3. **Use** `useAtom()` in your components
4. **Replace** prop drilling with direct atom access
5. **Add** persistence for user preferences
6. **Enjoy** cleaner, more maintainable code!

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** via GitHub discussions
- 📖 **Improve documentation** with pull requests
- 🧪 **Add tests** for new features
- ⭐ **Star the repo** to show your support

[Contributing Guidelines](CONTRIBUTING.md) | [Code of Conduct](CODE_OF_CONDUCT.md)

## 📄 License

MIT © [Parth Sinha](https://github.com/sinhaparth5)

## 🙏 Acknowledgments

- Inspired by [Jotai](https://jotai.org/) and [Valtio](https://valtio.pmnd.rs/)
- Built with modern React patterns and TypeScript
- Thanks to the React team for `useSyncExternalStore`

---

**Made with ❤️ for developers who love clean, simple state management**

[Documentation](https://nucleus-state.dev) | [GitHub](https://github.com/sinhaparth5/nucleus-state) | [npm](https://www.npmjs.com/package/nucleus-state)