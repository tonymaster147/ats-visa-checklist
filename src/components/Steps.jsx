import Icon from './Icon.jsx';
import { DESTINATIONS } from '../data/index.js';
import { NATIONALITIES, flagEmoji } from '../data/nationalities.js';
import { EMPLOYMENT_OPTIONS, PROFILE_TOGGLES } from '../data/common.js';

const STEP_LABELS = ['Trip', 'Visa type', 'Your profile', 'Checklist'];

export function Stepper({ step, maxStep, onGo }) {
  return (
    <ol className="atsvc-stepper" aria-label="Progress">
      {STEP_LABELS.map((label, i) => {
        const state = i === step ? 'current' : i < step || i <= maxStep ? 'done' : 'todo';
        return (
          <li key={label} className={`atsvc-stepper__item is-${state}`}>
            <button type="button" disabled={i > maxStep} onClick={() => onGo(i)} aria-current={i === step ? 'step' : undefined}>
              <span className="atsvc-stepper__dot">{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
              <span className="atsvc-stepper__label">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export const Flag = ({ code, size = 32 }) => (
  <img
    className="atsvc-flag"
    src={`https://flagcdn.com/w80/${code}.png`}
    alt=""
    width={size}
    height={Math.round(size * 0.75)}
    loading="lazy"
  />
);

export function StepTrip({ destId, natCode, onDest, onNat, onNext, stopNote }) {
  return (
    <section className="atsvc-panel">
      <h2 className="atsvc-h2">{DESTINATIONS.length === 1 ? 'Your destination' : 'Where are you going?'}</h2>
      <p className="atsvc-muted">{DESTINATIONS.length === 1 ? 'We currently cover Australia.' : 'Choose your destination.'} More countries are coming soon.</p>
      <div className="atsvc-dest-grid" role="radiogroup" aria-label="Destination country">
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={destId === d.id}
            className={`atsvc-card atsvc-dest ${destId === d.id ? 'is-selected' : ''}`}
            onClick={() => onDest(d.id)}
          >
            <Flag code={d.flag} size={44} />
            <span className="atsvc-dest__name">{d.name}</span>
            <span className="atsvc-dest__meta">{d.visaTypes.length} visa types</span>
            <span className="atsvc-card__tick"><Icon name="check" size={14} /></span>
          </button>
        ))}
      </div>

      <label className="atsvc-label" htmlFor="atsvc-nat">Your nationality (passport)</label>
      <div className="atsvc-select">
        <select id="atsvc-nat" value={natCode || ''} onChange={(e) => onNat(e.target.value)}>
          <option value="" disabled>Select your nationality…</option>
          {NATIONALITIES.map((n) => (
            <option key={n.code} value={n.code}>{flagEmoji(n.code)}  {n.name}</option>
          ))}
        </select>
      </div>

      {stopNote && (
        <div className="atsvc-note is-stop" role="status"><Icon name="info" /> <span>{stopNote}</span></div>
      )}

      <div className="atsvc-actions">
        <span />
        <button type="button" className="atsvc-btn atsvc-btn--primary" disabled={!destId || !natCode || !!stopNote} onClick={onNext}>
          Continue <Icon name="chevron" size={18} />
        </button>
      </div>
    </section>
  );
}

export function StepVisa({ destination, visaId, onVisa, onBack, onNext }) {
  return (
    <section className="atsvc-panel">
      <h2 className="atsvc-h2">Which {destination.name} visa are you applying for?</h2>
      <p className="atsvc-muted">Your checklist depends on the visa type.</p>
      <div className="atsvc-visa-grid" role="radiogroup" aria-label="Visa type">
        {destination.visaTypes.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={visaId === v.id}
            className={`atsvc-card atsvc-visa ${visaId === v.id ? 'is-selected' : ''}`}
            onClick={() => onVisa(v.id)}
          >
            <span className="atsvc-visa__code">{v.code}</span>
            <span className="atsvc-visa__name">{v.name}</span>
            <span className="atsvc-visa__blurb">{v.blurb}</span>
            <span className="atsvc-card__tick"><Icon name="check" size={14} /></span>
          </button>
        ))}
      </div>
      <div className="atsvc-actions">
        <button type="button" className="atsvc-btn atsvc-btn--ghost" onClick={onBack}><Icon name="back" size={18} /> Back</button>
        <button type="button" className="atsvc-btn atsvc-btn--primary" disabled={!visaId} onClick={onNext}>
          Continue <Icon name="chevron" size={18} />
        </button>
      </div>
    </section>
  );
}

export function StepProfile({ visa, nationality, profile, onChange, onBack, onNext }) {
  const fields = visa.profile;
  const set = (k, v) => onChange({ ...profile, [k]: v });
  const englishHint =
    nationality?.english === 'partial'
      ? `Some documents from ${nationality.name} are issued in a local language. Turn this on if any of yours aren’t in English.`
      : null;

  return (
    <section className="atsvc-panel">
      <h2 className="atsvc-h2">Tell us a little about you</h2>
      <p className="atsvc-muted">We only show documents that apply to you. Nothing you enter leaves your browser.</p>

      {fields.includes('employment') && (
        <fieldset className="atsvc-fieldset">
          <legend className="atsvc-label">Your current situation</legend>
          <div className="atsvc-chips">
            {EMPLOYMENT_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={profile.employment === o.id}
                className={`atsvc-chip ${profile.employment === o.id ? 'is-on' : ''}`}
                onClick={() => set('employment', o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="atsvc-toggles">
        {Object.entries(PROFILE_TOGGLES)
          .filter(([k]) => fields.includes(k))
          .map(([k, t]) => (
            <label key={k} className={`atsvc-toggle ${profile[k] ? 'is-on' : ''}`}>
              <input type="checkbox" checked={!!profile[k]} onChange={(e) => set(k, e.target.checked)} />
              <span className="atsvc-switch" aria-hidden="true" />
              <span>
                <span className="atsvc-toggle__label">{visa.toggleLabels?.[k] || t.label}</span>
                <span className="atsvc-toggle__hint">{k === 'nonEnglish' && englishHint ? englishHint : t.hint}</span>
              </span>
            </label>
          ))}
      </div>

      <div className="atsvc-actions">
        <button type="button" className="atsvc-btn atsvc-btn--ghost" onClick={onBack}><Icon name="back" size={18} /> Back</button>
        <button type="button" className="atsvc-btn atsvc-btn--primary" onClick={onNext}>
          Generate my checklist <Icon name="chevron" size={18} />
        </button>
      </div>
    </section>
  );
}
