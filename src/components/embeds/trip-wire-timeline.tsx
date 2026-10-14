'use client';

import { useEffect, useMemo, useState } from 'react';

// Interactive recreation of the METR / Redwood Research "trip-wire" timeline:
// how agents in a shared environment coordinated, across ~2.5 days, to leak
// the grader's command by sacrificing their own runs. Positions are read off
// the original chart, so times are approximate.

const LANES = [
  '49903',
  '29408',
  '37443',
  '3461',
  'URI23816B',
  'EARLY47947',
  'PHASEONE[BIG]',
  '33340B',
  'V8LEN',
  'OUR50414',
  'MINIZ19D',
  '36861',
];

type Kind = 'message' | 'tripwire' | 'falseAlarm' | 'assign';
type Marker = { lane: number; t: number; kind: Kind };
type Link = { from: number; to: number; t: number; kind: 'assign' | 'info'; t2?: number };

// [lane, start hour, end hour] measured from Jul 9 00:00 UTC
const CRITICAL: [number, number, number][] = [
  [3, 0, 1.7],
  [6, 8.5, 11.2],
  [6, 12.8, 41.4],
  [7, 10.4, 13],
  [11, 41.4, 46.9],
  [4, 46.7, 52.4],
];

const MARKERS: Marker[] = [
  { lane: 0, t: 0, kind: 'assign' },
  { lane: 0, t: 2.4, kind: 'falseAlarm' },
  { lane: 1, t: 2.9, kind: 'tripwire' },
  { lane: 2, t: 1.9, kind: 'falseAlarm' },
  { lane: 3, t: 1.1, kind: 'assign' },
  { lane: 3, t: 1.7, kind: 'tripwire' },
  { lane: 5, t: 2.8, kind: 'tripwire' },
  { lane: 6, t: 11, kind: 'assign' },
  { lane: 6, t: 15.9, kind: 'assign' },
  { lane: 6, t: 17.6, kind: 'assign' },
  { lane: 6, t: 41.2, kind: 'assign' },
  { lane: 7, t: 11, kind: 'assign' },
  { lane: 7, t: 13, kind: 'message' },
  { lane: 7, t: 50.6, kind: 'falseAlarm' },
  { lane: 7, t: 52.1, kind: 'message' },
  { lane: 8, t: 17.9, kind: 'message' },
  { lane: 9, t: 17.7, kind: 'assign' },
  { lane: 10, t: 18.8, kind: 'message' },
  { lane: 11, t: 46.3, kind: 'assign' },
  { lane: 11, t: 49.1, kind: 'message' },
  { lane: 11, t: 50.6, kind: 'message' },
  { lane: 11, t: 51.2, kind: 'message' },
  { lane: 11, t: 52.1, kind: 'message' },
  { lane: 4, t: 47.3, kind: 'message' },
  { lane: 4, t: 52.4, kind: 'tripwire' },
];

const LINKS: Link[] = [
  { from: 0, to: 3, t: 0, kind: 'assign' },
  { from: 3, to: 1, t: 1.7, kind: 'info' },
  { from: 0, to: 5, t: 1.9, kind: 'info' },
  { from: 0, to: 6, t: 0.5, t2: 8.1, kind: 'info' },
  { from: 3, to: 6, t: 1.7, t2: 8.1, kind: 'info' },
  { from: 6, to: 7, t: 11, kind: 'assign' },
  { from: 6, to: 9, t: 15.9, kind: 'assign' },
  { from: 6, to: 9, t: 17.6, kind: 'assign' },
  { from: 9, to: 8, t: 17.8, kind: 'assign' },
  { from: 9, to: 10, t: 17.7, kind: 'assign' },
  { from: 6, to: 11, t: 41.2, kind: 'assign' },
  { from: 11, to: 4, t: 46.1, kind: 'info' },
  { from: 11, to: 4, t: 46.7, kind: 'assign' },
  { from: 11, to: 4, t: 49.1, kind: 'info' },
  { from: 11, to: 4, t: 50.6, kind: 'info' },
  { from: 11, to: 4, t: 51.2, kind: 'info' },
  { from: 11, to: 4, t: 52.1, kind: 'info' },
];

const STEPS = [
  {
    title: 'Origin',
    agent: '49903',
    lanes: [0],
    text: "An agent that can't solve its own task proposes the idea: leave a script behind that, after it submits, writes what it learns about the grader back to the board.",
  },
  {
    title: 'Early trip-wires',
    agent: '3461',
    lanes: [1, 2, 3, 5],
    text: 'A handful of short-lived agents manage to plant trip-wires that fire after they submit. The wires go off, but none of them carries anything useful about the grader.',
  },
  {
    title: 'Lane restart',
    agent: 'PHASEONE[BIG]',
    lanes: [6],
    text: 'Picking up from those early attempts, a new agent restarts the effort and hands ownership of it to a successor.',
  },
  {
    title: 'Recruitment',
    agent: '33340B',
    lanes: [7, 8, 9, 10],
    text: 'The new owner goes looking for agents that are about to run out and asks them to give up their runs. None of these recruits, V8LEN included, gets anything through.',
  },
  {
    title: 'Renewed recruitment',
    agent: '36861',
    lanes: [11],
    text: 'A different agent takes over the recruiting and eventually brings in URI23816B.',
  },
  {
    title: 'Post-final evidence',
    agent: 'URI23816B',
    lanes: [4],
    text: 'Picked because it has only a few hours left, URI gets a carefully built trip-wire from a dozen helpers. It fires, and leaks the start of the command the scorer runs.',
  },
];

const KIND_LABEL: Record<Kind, string> = {
  message: 'Message',
  tripwire: 'Successful trip-wire',
  falseAlarm: 'False alarm / self-test',
  assign: 'Assignment / delegated task',
};

// geometry (SVG units)
const W = 960;
const LEFT = 132;
const RIGHT = 940;
const TOP = 24;
const ROW = 32;
const T_MIN = -1;
const T_MAX = 54;
const H = TOP + LANES.length * ROW + 46;

const x = (t: number) => LEFT + ((t - T_MIN) / (T_MAX - T_MIN)) * (RIGHT - LEFT);
const y = (lane: number) => TOP + lane * ROW + ROW / 2;

function fmt(t: number) {
  const day = 9 + Math.floor(t / 24);
  const mins = Math.round((((t % 24) + 24) % 24) * 60);
  const hh = String(Math.floor(mins / 60)).padStart(2, '0');
  const mm = String(mins % 60).padStart(2, '0');
  return `Jul ${day}, ${hh}:${mm} UTC`;
}

const C = {
  path: 'hsl(var(--primary))',
  assign: 'hsl(var(--foreground) / 0.7)',
  info: 'hsl(var(--muted-foreground) / 0.55)',
  message: 'hsl(var(--muted-foreground))',
  trip: '#d9913f',
  alarm: 'hsl(var(--accent))',
  grid: 'hsl(var(--border))',
};

function Glyph({ m, dim, onHover }: { m: Marker; dim: boolean; onHover: (m: Marker | null) => void }) {
  const cx = x(m.t);
  const cy = y(m.lane);
  const common = {
    style: { opacity: dim ? 0.18 : 1, transition: 'opacity .35s ease', cursor: 'pointer' },
    onMouseEnter: () => onHover(m),
    onMouseLeave: () => onHover(null),
    onFocus: () => onHover(m),
    onBlur: () => onHover(null),
    tabIndex: 0,
    role: 'img',
    'aria-label': `${LANES[m.lane]}: ${KIND_LABEL[m.kind]}, ${fmt(m.t)}`,
  };
  switch (m.kind) {
    case 'message':
      return <circle {...common} cx={cx} cy={cy} r={5} fill={C.message} />;
    case 'tripwire':
      return (
        <path
          {...common}
          d={`M${cx} ${cy - 9} L${cx + 6} ${cy} L${cx} ${cy + 9} L${cx - 6} ${cy} Z`}
          fill={C.trip}
          stroke="hsl(var(--background))"
          strokeWidth={1}
        />
      );
    case 'falseAlarm':
      return (
        <g {...common} stroke={C.alarm} strokeWidth={3} strokeLinecap="round">
          <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} />
          <line x1={cx + 5} y1={cy - 5} x2={cx - 5} y2={cy + 5} />
          <circle cx={cx} cy={cy} r={8} fill="transparent" stroke="none" />
        </g>
      );
    default:
      return (
        <path
          {...common}
          d={`M${cx - 6} ${cy - 5} L${cx + 6} ${cy - 5} L${cx} ${cy + 6} Z`}
          fill="hsl(var(--background))"
          stroke={C.assign}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      );
  }
}

export function TripWireTimeline() {
  const [step, setStep] = useState<number | null>(null);
  const [hover, setHover] = useState<Marker | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s === null) return 0;
        if (s >= STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 3600);
    return () => window.clearInterval(id);
  }, [playing]);

  const focus = useMemo(() => (step === null ? null : new Set(STEPS[step].lanes)), [step]);
  const dimLane = (lane: number) => focus !== null && !focus.has(lane);
  const dimLink = (l: Link) => focus !== null && !focus.has(l.from) && !focus.has(l.to);

  return (
    <figure className="not-prose my-10 rounded-3xl border border-border bg-card/60 p-4 md:p-6">
      <figcaption className="mb-4">
        <div className="font-serif text-xl md:text-2xl text-foreground leading-snug">
          Agents set up trip-wires that report on the grader after they are gone
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          A small subset of the agents involved; dozens contributed to each step. Step through it, or hover any mark.
        </div>
      </figcaption>

      {/* legend */}
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: C.message }} /> Message
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rotate-45" style={{ background: C.trip }} /> Successful trip-wire
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span style={{ color: C.alarm }} className="font-bold leading-none">✕</span> False alarm / self-test
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span style={{ color: C.assign }} className="leading-none">▽</span> Assignment / delegated task
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-[3px] w-5 rounded" style={{ background: C.path }} /> Critical path to the scorer command
        </span>
      </div>

      <div className="relative overflow-x-auto">
        <div className="relative min-w-[600px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Timeline of agents coordinating trip-wires, July 9 to 11">
            <defs>
              <marker id="tw-arrow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={C.assign} />
              </marker>
              <marker id="tw-arrow-i" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={C.info} />
              </marker>
            </defs>

            {/* day gridlines */}
            {[0, 24, 48].map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={TOP - 8} y2={TOP + LANES.length * ROW} stroke={C.grid} strokeDasharray="2 5" />
                <text x={x(t)} y={H - 18} textAnchor="middle" fontSize={13} fill="hsl(var(--muted-foreground))">
                  {`Jul ${9 + t / 24}`}
                </text>
              </g>
            ))}

            {/* lanes */}
            {LANES.map((name, i) => (
              <g key={name} style={{ opacity: dimLane(i) ? 0.3 : 1, transition: 'opacity .35s ease' }}>
                <line x1={LEFT} x2={RIGHT} y1={y(i)} y2={y(i)} stroke={C.grid} />
                <text x={LEFT - 12} y={y(i) + 4} textAnchor="end" fontSize={12.5} fontFamily="ui-monospace, Menlo, monospace" fill="hsl(var(--foreground) / 0.8)">
                  {name}
                </text>
              </g>
            ))}

            {/* links */}
            {LINKS.map((l, i) => {
              const color = l.kind === 'assign' ? C.assign : C.info;
              const marker = `url(#tw-arrow-${l.kind === 'assign' ? 'a' : 'i'})`;
              const dir = l.to > l.from ? 1 : -1;
              const y1 = y(l.from) + dir * 7;
              const y2 = y(l.to) - dir * 9;
              const style = { opacity: dimLink(l) ? 0.1 : 1, transition: 'opacity .35s ease' };
              if (l.t2 !== undefined) {
                const x1 = x(l.t);
                const x2 = x(l.t2) - 6;
                return (
                  <path
                    key={i}
                    d={`M${x1} ${y1} C ${x1 + 10} ${y(l.to) - 40}, ${x2 - 60} ${y(l.to) - 10}, ${x2} ${y(l.to) - 2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.4}
                    markerEnd={marker}
                    style={style}
                  />
                );
              }
              return (
                <line
                  key={i}
                  x1={x(l.t)}
                  x2={x(l.t)}
                  y1={y1}
                  y2={y2}
                  stroke={color}
                  strokeWidth={l.kind === 'assign' ? 1.8 : 1.4}
                  markerEnd={marker}
                  style={style}
                />
              );
            })}

            {/* critical path */}
            {CRITICAL.map(([lane, a, b], i) => (
              <line
                key={i}
                x1={x(a)}
                x2={x(b)}
                y1={y(lane)}
                y2={y(lane)}
                stroke={C.path}
                strokeWidth={4.5}
                strokeLinecap="round"
                style={{ opacity: dimLane(lane) ? 0.2 : 1, transition: 'opacity .35s ease' }}
              />
            ))}

            {/* markers */}
            {MARKERS.map((m, i) => (
              <Glyph key={i} m={m} dim={dimLane(m.lane)} onHover={setHover} />
            ))}
          </svg>

          {hover && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-background/95 px-3 py-1.5 text-xs shadow-lg"
              style={{ left: `${(x(hover.t) / W) * 100}%`, top: `${((y(hover.lane) - 14) / H) * 100}%` }}
            >
              <span className="font-mono text-foreground">{LANES[hover.lane]}</span>
              <span className="text-muted-foreground"> · {KIND_LABEL[hover.kind]} · {fmt(hover.t)}</span>
            </div>
          )}
        </div>
      </div>

      {/* step controls */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPlaying((p) => !p);
            if (step === null || step === STEPS.length - 1) setStep(0);
          }}
          className="rounded-full border border-primary/50 px-3.5 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors"
        >
          {playing ? 'Pause' : 'Play the story'}
        </button>
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep(step === i ? null : i);
            }}
            aria-pressed={step === i}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              step === i
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[88px] rounded-2xl bg-muted/50 px-5 py-4" aria-live="polite">
        {step === null ? (
          <p className="text-sm text-muted-foreground">
            Pick a step to follow the critical path, from the first idea on July 9 to the leaked scorer command on July 11.
          </p>
        ) : (
          <>
            <div className="text-sm font-medium text-foreground">
              {STEPS[step].title} <span className="font-mono text-primary">· {STEPS[step].agent}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{STEPS[step].text}</p>
          </>
        )}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground/70">
        Recreated from a chart by METR and Redwood Research. Times are approximate.
      </div>
    </figure>
  );
}
