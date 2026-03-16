import { createAtom, createComputed, useAtom, useAtomValue } from '../../src';

const stepAtom = createAtom(1, { name: 'wizardStep' });
const profileAtom = createAtom({ name: '', email: '' }, { name: 'wizardProfile' });
const isCompleteAtom = createComputed(
  [stepAtom, profileAtom],
  () => stepAtom.get() > 2 && profileAtom.get().name.length > 0 && profileAtom.get().email.length > 0,
);

export function FormWizardExample() {
  const [step, setStep] = useAtom(stepAtom);
  const [profile, setProfile] = useAtom(profileAtom);
  const isComplete = useAtomValue(isCompleteAtom);

  return (
    <section>
      <h1>Form Wizard</h1>
      <p>Step: {step}</p>
      <input
        value={profile.name}
        onChange={event => setProfile(prev => ({ ...prev, name: event.target.value }))}
        placeholder="Name"
      />
      <input
        value={profile.email}
        onChange={event => setProfile(prev => ({ ...prev, email: event.target.value }))}
        placeholder="Email"
      />
      <button onClick={() => setStep(prev => prev + 1)}>Next step</button>
      <p>{isComplete ? 'Ready to submit' : 'Complete all steps first'}</p>
    </section>
  );
}
