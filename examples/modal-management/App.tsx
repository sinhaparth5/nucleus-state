import { createAtom, useAtom, useSetAtom } from '../../src';

const modalAtom = createAtom(false, { name: 'settingsModal' });

function OpenModalButton() {
  const setModalOpen = useSetAtom(modalAtom);

  return <button onClick={() => setModalOpen(true)}>Open modal</button>;
}

export function ModalManagementExample() {
  const [isOpen, setModalOpen] = useAtom(modalAtom);

  return (
    <section>
      <h1>Modal Management</h1>
      <OpenModalButton />
      {isOpen ? (
        <div>
          <p>Settings modal content</p>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
      ) : null}
    </section>
  );
}
