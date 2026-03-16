import { useState } from 'react';
import { BasicUsageExample } from '../../basic-usage/App';
import { FormWizardExample } from '../../form-wizard/App';
import { ModalManagementExample } from '../../modal-management/App';

const demos = [
  {
    id: 'counter',
    label: 'Counter',
    description: 'Basic shared state with a single atom.',
    component: <BasicUsageExample />,
  },
  {
    id: 'modal',
    label: 'Modal',
    description: 'Shared UI state without prop drilling.',
    component: <ModalManagementExample />,
  },
  {
    id: 'wizard',
    label: 'Wizard',
    description: 'Derived state with createComputed.',
    component: <FormWizardExample />,
  },
] as const;

export function PlaygroundApp() {
  const [activeDemo, setActiveDemo] = useState<(typeof demos)[number]['id']>(demos[0].id);
  const selectedDemo = demos.find(demo => demo.id === activeDemo) ?? demos[0];

  return (
    <main className="playground-shell">
      <section className="hero">
        <p className="eyebrow">Nucleus State Playground</p>
        <h1>Run the library in a real app and inspect the patterns side by side.</h1>
        <p className="hero-copy">
          This playground shows atoms, derived state, and shared UI behavior using the live code from
          the repository.
        </p>
      </section>

      <section className="demo-picker">
        {demos.map(demo => (
          <button
            key={demo.id}
            className={demo.id === activeDemo ? 'demo-tab active' : 'demo-tab'}
            onClick={() => setActiveDemo(demo.id)}
            type="button"
          >
            <span>{demo.label}</span>
            <small>{demo.description}</small>
          </button>
        ))}
      </section>

      <section className="demo-stage">
        <div className="demo-card">{selectedDemo.component}</div>
      </section>
    </main>
  );
}
