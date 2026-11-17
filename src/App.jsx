import { useEffect, useMemo, useRef, useState } from 'react';
import { Stepper, StepTrip, StepVisa, StepProfile } from './components/Steps.jsx';
import Results from './components/Results.jsx';
import { DESTINATIONS, getDestination } from './data/index.js';
import { getNationality } from './data/nationalities.js';
import { buildChecklist, scoreChecklist } from './lib/checklist.js';
import { loadState, saveState } from './lib/storage.js';

const DEFAULT_PROFILE = {
  employment: 'employed', sponsored: false, married: false, children: false, prevRefusal: false, nonEnglish: false,
};

export default function App({ config }) {
  const saved = useRef(loadState()).current || {};
  const savedValid = saved.destId && getDestination(saved.destId);
  const [step, setStep] = useState(savedValid ? saved.step ?? 0 : 0);
  const [maxStep, setMaxStep] = useState(savedValid ? saved.maxStep ?? 0 : 0);
  // Ignore saved/configured countries that are no longer offered; auto-select when only one exists.
  const initialDest = [saved.destId, config.defaultDestination].find((id) => id && getDestination(id))
    ?? (DESTINATIONS.length === 1 ? DESTINATIONS[0].id : null);
  const [destId, setDestId] = useState(initialDest);
  const [natCode, setNatCode] = useState(saved.natCode ?? null);
  const [visaId, setVisaId] = useState(savedValid ? saved.visaId ?? null : null);
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...saved.profile });
  const [progress, setProgress] = useState(saved.progress ?? {});
  const rootRef = useRef(null);

  const destination = getDestination(destId);
  const nationality = getNationality(natCode);
  const visa = destination?.visaTypes.find((v) => v.id === visaId) || null;

  useEffect(() => {
    saveState({ step, maxStep, destId, natCode, visaId, profile, progress });
  }, [step, maxStep, destId, natCode, visaId, profile, progress]);

  const stopNote = useMemo(() => {
    if (!destination || !nationality) return null;
    return destination.nationalityNotes(nationality, null).find((n) => n.type === 'stop')?.text || null;
  }, [destination, nationality]);

  const progressKey = destId && visaId ? `${destId}:${visaId}` : null;
  const checked = (progressKey && progress[progressKey]) || {};

  const checklist = useMemo(
    () => (destination && visa && nationality ? buildChecklist(destination, visa, nationality, profile) : null),
    [destination, visa, nationality, profile],
  );
  const score = useMemo(() => (checklist ? scoreChecklist(checklist.items, checked) : null), [checklist, checked]);

  const go = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    const top = rootRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chooseDest = (id) => {
    if (id !== destId) {
      setDestId(id);
      setVisaId(null);
      setMaxStep(0);
    }
  };

  const chooseNat = (code) => {
    setNatCode(code);
    const nat = getNationality(code);
    // Pre-select the translation toggle for passports whose documents are usually not in English.
    setProfile((p) => ({ ...p, nonEnglish: nat?.english === 'no' }));
  };

  const chooseVisa = (id) => {
    setVisaId(id);
    if (id !== visaId) setMaxStep(1);
  };

  const toggle = (id) =>
    setProgress((p) => {
      const cur = { ...(p[progressKey] || {}) };
      if (cur[id]) delete cur[id];
      else cur[id] = true;
      return { ...p, [progressKey]: cur };
    });

  const reset = () => {
    if (window.confirm('Clear all ticked documents for this checklist?')) {
      setProgress((p) => ({ ...p, [progressKey]: {} }));
    }
  };

  return (
    <div className="atsvc" ref={rootRef}>
      <Stepper step={step} maxStep={maxStep} onGo={go} />

      {step === 0 && (
        <StepTrip
          destId={destId}
          natCode={natCode}
          onDest={chooseDest}
          onNat={chooseNat}
          stopNote={stopNote}
          onNext={() => go(1)}
        />
      )}
      {step === 1 && destination && (
        <StepVisa destination={destination} visaId={visaId} onVisa={chooseVisa} onBack={() => go(0)} onNext={() => go(2)} />
      )}
      {step === 2 && visa && (
        <StepProfile
          visa={visa}
          nationality={nationality}
          profile={profile}
          onChange={setProfile}
          onBack={() => go(1)}
          onNext={() => go(3)}
        />
      )}
      {step === 3 && checklist && (
        <Results
          destination={destination}
          visa={visa}
          nationality={nationality}
          checklist={checklist}
          score={score}
          checked={checked}
          onToggle={toggle}
          onReset={reset}
          onEdit={() => go(2)}
          config={config}
        />
      )}
      {/* Recover gracefully if saved state points to a step that can't render. */}
      {((step === 1 && !destination) || (step === 2 && !visa) || (step === 3 && !checklist)) && (
        <StepTrip destId={destId} natCode={natCode} onDest={chooseDest} onNat={chooseNat} stopNote={stopNote} onNext={() => go(1)} />
      )}
    </div>
  );
}
