import { createAtom, useAtom } from '../../src';

const counterAtom = createAtom(0, { name: 'counter' });

export function BasicUsageExample() {
  const [count, setCount] = useAtom(counterAtom);

  return (
    <section>
      <h1>Basic Usage</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    </section>
  );
}
