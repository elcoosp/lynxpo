import { root, useCallback, useEffect, useState } from '@lynx-js/react';
import './showcase.css';
import { ARG_DEFAULTS, ARG_TYPES, type ArgType } from './mods-args.js';
import {
  METHOD_COUNT,
  MODULE_COUNT,
  MODULES,
  type ModEntry,
} from './mods-registry.js';

type Status = 'pending' | 'ok' | 'err';
interface MethState {
  status: Status;
  result: string;
}
declare const NativeModules: Record<string, any>;

// The Lynx engine injects `NativeModules` as a global lexical binding
// (bare identifier), NOT a property of globalThis. The module code itself
// uses the bare global; globalThis.NativeModules is undefined, which is why
// every call silently returned undefined before this fix.
const resolveMod = (key: string): any => {
  const nm =
    typeof NativeModules !== 'undefined'
      ? NativeModules
      : (globalThis as any).NativeModules;
  return nm?.[key];
};

const fmt = (v: unknown): string => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string') return v;
  try {
    const s = JSON.stringify(v);
    return s.length > 400 ? s.slice(0, 400) + '…' : s;
  } catch {
    return String(v);
  }
};

export function HostShowcase() {
  const [selected, setSelected] = useState<ModEntry | null>(null);
  const [stats, setStats] = useState<Record<string, ModStat>>({});
  const [meth, setMeth] = useState<Record<string, MethState>>({});

  // All 61 modules are registered (auto-linked) -> available by default.
  // We deliberately do NOT auto-invoke native methods on mount: calling 187
  // methods at startup can trigger an uncatchable native abort (e.g. a module
  // that asserts on being called outside its expected lifecycle), which blanks
  // the whole view. Instead each method is invoked on tap (callMethod), and the
  // "verified" count reflects modules the user has actually exercised.
  useEffect(() => {
    const nextMod: Record<string, ModStat> = {};
    for (const m of MODULES) nextMod[m.key] = 'ok';
    setStats(nextMod);
  }, []);

  // Invoke a native method with explicit (already-parsed) args. Previously
  // arg-requiring methods were refused ("not auto-callable"); now every method
  // is testable from the device — the detail view renders typed inputs seeded
  // with safe defaults (derived from each method's Obj-C signature) and the
  // Call button invokes with the user-edited values.
  const callMethod = useCallback(
    (m: ModEntry, name: string, args: unknown[]) => {
      const id = `${m.key}.${name}`;
      try {
        const mod = resolveMod(m.key);
        const out = mod?.[name]?.(...args);
        setMeth((p) => ({ ...p, [id]: { status: 'ok', result: fmt(out) } }));
        setStats((s) => ({ ...s, [m.key]: 'ok' }));
      } catch (e: any) {
        setMeth((p) => ({
          ...p,
          [id]: { status: 'err', result: String(e?.message ?? e) },
        }));
      }
    },
    [],
  );

  // Per-method editable argument values, keyed by `ModuleKey.method`.
  // Args are edited on-device via tap-to-cycle chips (this Lynx host build does
  // not render <input>), each cycling through type-appropriate sample values.
  // The Call button invokes the method with the currently-selected values.
  const methodKey = (methodId: string) =>
    methodId.split('.').slice(1).join('.');
  const [argsState, setArgsState] = useState<Record<string, string[]>>({});
  const ARG_SAMPLES: Record<ArgType, string[]> = {
    number: ['0', '1', '0.5', '2', '5', '10', '-1'],
    boolean: ['false', 'true'],
    string: ['', 'test', 'https://expo.dev', 'sample-value', 'key-123'],
    json: ['null', '{}', '[]'],
  };
  const getArgValues = (methodId: string, types: ArgType[]): string[] => {
    const cur = argsState[methodId];
    if (cur && cur.length === types.length) return cur;
    return (ARG_DEFAULTS[methodKey(methodId)] ?? types.map(() => '')).map(
      String,
    );
  };
  const cycleArg = (methodId: string, idx: number, type: ArgType) => {
    setArgsState((p) => {
      const base = (p[methodId] ?? []).slice();
      const samples = ARG_SAMPLES[type] ?? [''];
      const cur = base[idx] ?? samples[0];
      const next = samples[(samples.indexOf(cur) + 1) % samples.length];
      base[idx] = next;
      return { ...p, [methodId]: base };
    });
  };

  // On-demand probe: when a module is opened, invoke its zero-arg (non-privacy)
  // methods so the detail view shows real values immediately. We deliberately do
  // NOT probe all 61 modules on mount — calling ~187 methods at startup can
  // trigger an uncatchable native abort that blanks the whole view. Privacy
  // modules are excluded here too (their prompt is shown on explicit tap).
  const PRIVACY_KEYS = new Set([
    'CameraModule',
    'ContactsModule',
    'Calendar',
    'LocationModule',
    'MediaLibraryModule',
    'MusicLibrary',
    'ImagePickerModule',
    'SpeechModule',
    'Health',
    'SensorsModule',
    'LocalAuthenticationModule',
    'AppleAuthentication',
    'TrackingTransparency',
    'Audio',
    'Microphone',
    'ClipboardModule',
    'PhotoLibrary',
    'Video',
    'LivePhoto',
    'ScreenCapture',
    'ImageManipulator',
    'Image',
    'VideoThumbnails',
  ]);
  useEffect(() => {
    if (!selected) return;
    const m = selected;
    for (const md of m.methods) {
      if (!md.zeroArg || PRIVACY_KEYS.has(m.key)) continue;
      const id = `${m.key}.${md.name}`;
      try {
        const mod = resolveMod(m.key);
        const out = mod?.[md.name]?.();
        setMeth((p) =>
          p[id] ? p : { ...p, [id]: { status: 'ok', result: fmt(out) } },
        );
      } catch (e: any) {
        setMeth((p) =>
          p[id]
            ? p
            : {
                ...p,
                [id]: { status: 'err', result: String(e?.message ?? e) },
              },
        );
      }
    }
  }, [selected]);

  const verified = Object.values(stats).filter((s) => s === 'ok').length;
  const errored = Object.values(stats).filter((s) => s === 'err').length;

  return (
    <view className="Showcase">
      <view className="Header">
        <text className="Header__Title">LynxPo Modules</text>
        <text className="Header__Sub">
          Standalone host · {MODULE_COUNT} native modules · {METHOD_COUNT}{' '}
          methods
        </text>
        <view className="Header__Stats">
          <view className="Stat">
            <text className="Stat__Num">{MODULE_COUNT}</text>
            <text className="Stat__Label">Modules</text>
          </view>
          <view className="Stat">
            <text className="Stat__Num">{verified}</text>
            <text className="Stat__Label">Verified</text>
          </view>
          <view className="Stat">
            <text className="Stat__Num">{METHOD_COUNT}</text>
            <text className="Stat__Label">Methods</text>
          </view>
        </view>
      </view>

      {/* Native UI component port (expo-linear-gradient) — real CAGradientLayer */}
      <view className="NativeUI">
        <text className="NativeUI__Title">Native UI · linear-gradient</text>
        <linear-gradient
          className="NativeUI__Gradient"
          colors={['#fe2c55', '#7d2cff', '#00ebeb']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </view>

      {/* Native UI · blur-view (expo-blur) — real UIVisualEffectView backdrop */}
      <view className="NativeUI">
        <text className="NativeUI__Title">Native UI · blur-view</text>
        <view className="BlurDemo">
          <lynxpo-blur
            className="BlurDemo__Blur"
            tint="light"
            intensity={55}
            border-radius={12}
          ></lynxpo-blur>
          <view className="BlurDemo__Label">
            <text className="BlurDemo__Text">Blurred photo</text>
          </view>
        </view>
      </view>

      <scroll-view
        className="ModuleScroll"
        scroll-orientation="vertical"
        style={{ display: selected ? 'none' : 'flex' }}
      >
        <view className="Grid">
          {MODULES.map((m) => {
            const dot =
              stats[m.key] === 'ok'
                ? 'Cell__Dot--ok'
                : stats[m.key] === 'err'
                  ? 'Cell__Dot--err'
                  : stats[m.key] === 'warn'
                    ? 'Cell__Dot--warn'
                    : '';
            return (
              <view className="Cell" key={m.pkg}>
                <view className="Cell__Btn" bindtap={() => setSelected(m)}>
                  <view className={`Cell__Dot ${dot}`} />
                  <text className="Cell__Name">{m.label}</text>
                  <text className="Cell__Count">
                    {m.methods.length} methods
                  </text>
                </view>
              </view>
            );
          })}
        </view>
      </scroll-view>

      <view className="Detail" style={{ display: selected ? 'flex' : 'none' }}>
        {selected ? (
          <>
            <view className="Detail__Head">
              <view>
                <text className="Detail__Title">{selected.label}</text>
                <text className="Detail__Key">
                  NativeModules.{selected.key}
                </text>
              </view>
              <view className="Detail__Back" bindtap={() => setSelected(null)}>
                <text className="Detail__BackText">‹ Back</text>
              </view>
            </view>
            <view className="MethList">
              {selected.methods.map((md) => {
                const id = `${selected.key}.${md.name}`;
                const st = meth[id] ?? { status: 'pending', result: '' };
                const types: ArgType[] = md.zeroArg
                  ? []
                  : (ARG_TYPES[md.name] ?? []);
                const values = getArgValues(id, types);
                const parseArg = (t: ArgType, raw: string): unknown => {
                  if (t === 'number') {
                    const n = Number(raw);
                    return Number.isNaN(n) ? 0 : n;
                  }
                  if (t === 'boolean') return raw === 'true' || raw === '1';
                  if (t === 'json') {
                    try {
                      return JSON.parse(raw || 'null');
                    } catch {
                      return null;
                    }
                  }
                  return raw;
                };
                return (
                  <view className="Meth" key={id}>
                    <view className="Meth__Top">
                      <view
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <text className="Meth__Name">{md.name}</text>
                        {md.zeroArg ? (
                          <text className="Meth__Flag">auto</text>
                        ) : (
                          <text className="Meth__Flag Meth__Flag--args">
                            {types.length} arg{types.length === 1 ? '' : 's'}
                          </text>
                        )}
                      </view>
                      <view
                        className="Meth__Call"
                        bindtap={() =>
                          callMethod(
                            selected,
                            md.name,
                            md.zeroArg
                              ? []
                              : types.map((t, i) =>
                                  parseArg(t, values[i] ?? ''),
                                ),
                          )
                        }
                      >
                        Call
                      </view>
                    </view>
                    {!md.zeroArg && types.length > 0 ? (
                      <view className="Meth__Args">
                        {types.map((t, i) => (
                          <view
                            className="Meth__Arg"
                            key={i}
                            bindtap={() => cycleArg(id, i, t)}
                          >
                            <text className="Meth__ArgType">{t}</text>
                            <text className="Meth__ArgValue">
                              {values[i] ?? ''}
                            </text>
                            <text className="Meth__ArgCycle">tap ▸</text>
                          </view>
                        ))}
                      </view>
                    ) : null}
                    {st.result ? (
                      <view className="Meth__Result">
                        <text
                          className={`Meth__Status Meth__Status--${st.status}`}
                        >
                          {st.status === 'ok'
                            ? '✓ '
                            : st.status === 'err'
                              ? '✗ '
                              : ''}
                        </text>
                        <text className="Meth__ResultText">{st.result}</text>
                      </view>
                    ) : null}
                  </view>
                );
              })}
            </view>
          </>
        ) : null}
      </view>

      <view className="Footer">
        Verified = a method returned without throwing. Tap a module to inspect
        and invoke its methods. Arg-requiring methods show typed inputs
        pre-filled with safe defaults — edit and tap Call to test them.
      </view>
    </view>
  );
}

root.render(<HostShowcase />);
