import { useState } from 'react';
import Icon from './Icon.jsx';
import { Flag } from './Steps.jsx';
import { flagEmoji } from '../data/nationalities.js';
import { LAST_REVIEWED } from '../data/index.js';

const NOTE_ICON = { info: 'info', warn: 'alert', tip: 'bulb', stop: 'info' };

function ScoreRing({ pct, bandKey }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className={`atsvc-ring is-${bandKey}`} role="img" aria-label={`Readiness score ${pct} percent`}>
      <svg viewBox="0 0 120 120" width="132" height="132">
        <circle cx="60" cy="60" r={r} className="atsvc-ring__track" />
        <circle
          cx="60" cy="60" r={r}
          className="atsvc-ring__bar"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="atsvc-ring__value"><strong>{pct}</strong><span>%</span></div>
    </div>
  );
}

function Bar({ label, done, total }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div className="atsvc-bar">
      <div className="atsvc-bar__row"><span>{label}</span><span>{done} / {total}</span></div>
      <div className="atsvc-bar__track"><div className="atsvc-bar__fill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function Item({ item, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <li id={`atsvc-item-${item.id}`} className={`atsvc-item ${checked ? 'is-checked' : ''}`}>
      <label className="atsvc-item__main">
        <input type="checkbox" checked={checked} onChange={() => onToggle(item.id)} />
        <span className="atsvc-checkbox" aria-hidden="true"><Icon name="check" size={14} /></span>
        <span className="atsvc-item__title">{item.title}</span>
      </label>
      <div className="atsvc-item__meta">
        <span className={`atsvc-badge is-${item.level}`}>{item.level === 'required' ? 'Required' : 'Recommended'}</span>
        {item.needsTranslation && (
          <span className="atsvc-badge is-translate"><Icon name="translate" size={12} /> Certified translation</span>
        )}
        <button type="button" className="atsvc-link" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Hide details' : 'Details'}
        </button>
      </div>
      <p className={`atsvc-item__desc ${open ? 'is-open' : ''}`}>{item.desc}</p>
    </li>
  );
}

export default function Results({
  destination, visa, nationality, checklist, score, checked, onToggle, onReset, onEdit, config,
}) {
  const { groups, notes, items } = checklist;
  const toTranslate = items.filter((i) => i.needsTranslation);
  const pendingTranslate = toTranslate.filter((i) => !checked[i.id]).length;
  const jump = (id) => {
    const el = document.getElementById(`atsvc-item-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('is-flash');
      setTimeout(() => el.classList.remove('is-flash'), 1400);
    }
  };

  return (
    <div className="atsvc-results">
      <div className="atsvc-summary">
        <Flag code={destination.flag} size={36} />
        <div className="atsvc-summary__text">
          <strong>{visa.name} <span className="atsvc-summary__code">({visa.code})</span></strong>
          <span>{destination.name} · {flagEmoji(nationality.code)} {nationality.name} passport</span>
        </div>
        <button type="button" className="atsvc-btn atsvc-btn--ghost atsvc-btn--sm atsvc-noprint" onClick={onEdit}>
          <Icon name="edit" size={16} /> Change answers
        </button>
      </div>

      <div className="atsvc-layout">
        <div className="atsvc-main">
          {notes.length > 0 && (
            <div className="atsvc-notes">
              {notes.map((n, i) => (
                <div key={i} className={`atsvc-note is-${n.type}`}>
                  <Icon name={NOTE_ICON[n.type]} />
                  <span>
                    {n.text}
                    {n.link && (
                      <> <a href={n.link} target="_blank" rel="noopener noreferrer">Official info <Icon name="external" size={12} /></a></>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {groups.map((g) => {
            const done = g.items.filter((i) => checked[i.id]).length;
            return (
              <section key={g.key} className="atsvc-group">
                <header className="atsvc-group__head">
                  <span className="atsvc-group__icon"><Icon name={g.icon} /></span>
                  <h3>{g.label}</h3>
                  <span className={`atsvc-group__count ${done === g.items.length ? 'is-complete' : ''}`}>
                    {done}/{g.items.length}
                  </span>
                </header>
                <ul className="atsvc-items">
                  {g.items.map((item) => (
                    <Item key={item.id} item={item} checked={!!checked[item.id]} onToggle={onToggle} />
                  ))}
                </ul>
              </section>
            );
          })}

          <p className="atsvc-disclaimer">
            <strong>Last reviewed: {LAST_REVIEWED}.</strong> This checklist is general guidance, not legal or migration advice.
            Requirements change and can vary by applicant. Always confirm with the {destination.authority} before you apply.
            A high score shows your documents are ready. It doesn’t predict whether your visa will be granted.
          </p>
        </div>

        <aside className="atsvc-side">
          <div className="atsvc-card atsvc-score">
            <h3 className="atsvc-side__title">Document readiness</h3>
            <ScoreRing pct={score.pct} bandKey={score.band.key} />
            <p className={`atsvc-score__band is-${score.band.key}`}>{score.band.label}</p>
            <p className="atsvc-score__text">{score.band.text}</p>
            <Bar label="Required" done={score.counts.required[0]} total={score.counts.required[1]} />
            <Bar label="Recommended" done={score.counts.recommended[0]} total={score.counts.recommended[1]} />

            {score.missingRequired.length > 0 && (
              <div className="atsvc-missing atsvc-noprint">
                <p className="atsvc-missing__title">Still missing (required)</p>
                <ul>
                  {score.missingRequired.slice(0, 5).map((i) => (
                    <li key={i.id}><button type="button" className="atsvc-link" onClick={() => jump(i.id)}>{i.title}</button></li>
                  ))}
                  {score.missingRequired.length > 5 && <li className="atsvc-muted">+ {score.missingRequired.length - 5} more</li>}
                </ul>
              </div>
            )}

            <div className="atsvc-side__actions atsvc-noprint">
              <button type="button" className="atsvc-btn atsvc-btn--outline atsvc-btn--sm" onClick={() => window.print()}>
                <Icon name="printer" size={16} /> Print / Save PDF
              </button>
              <button type="button" className="atsvc-btn atsvc-btn--ghost atsvc-btn--sm" onClick={onReset}>
                <Icon name="reset" size={16} /> Clear ticks
              </button>
            </div>
          </div>

          <div className={`atsvc-card atsvc-cta atsvc-noprint ${toTranslate.length ? 'is-active' : ''}`}>
            <span className="atsvc-cta__icon"><Icon name="translate" size={22} /></span>
            {toTranslate.length ? (
              <>
                <h3>{pendingTranslate || toTranslate.length} document{(pendingTranslate || toTranslate.length) > 1 ? 's' : ''} may need certified translation</h3>
                <p>{destination.translationRule}</p>
              </>
            ) : (
              <>
                <h3>Documents not in English?</h3>
                <p>Every document that isn’t in English needs a certified translation for your application. Turn on “Some of my documents are not in English” to see which ones.</p>
              </>
            )}
            <a className="atsvc-btn atsvc-btn--accent" href={config.quoteUrl} target="_blank" rel="noopener noreferrer">
              Get a free translation quote
            </a>
            <p className="atsvc-cta__small">NAATI-certified translators · 150+ languages · {config.brand}</p>
          </div>

          <div className="atsvc-card atsvc-links">
            <h3 className="atsvc-side__title">Official sources</h3>
            <ul>
              {visa.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} <Icon name="external" size={12} /></a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
