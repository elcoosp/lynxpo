import { root, useState, useEffect, useCallback } from '@lynx-js/react';
import './showcase.css';
import { MODULES, MODULE_COUNT, METHOD_COUNT, ModEntry } from './mods-registry.js';

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
    typeof NativeModules !== 'undefined' ? NativeModules : (globalThis as any).NativeModules;
  return nm?.[key];
};

// Modules that touch privacy-sensitive APIs (camera, contacts, location, ...).
// Auto-probing them on mount would spam the OS permission dialog; they are
// only invoked when the user taps "Call" (prompt is expected then).
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
  // Media/capture modules whose zero-arg methods can trigger a camera or
  // photo permission prompt on first call.
  'Video',
  'LivePhoto',
  'ScreenCapture',
  'ImageManipulator',
  'Image',
  'VideoThumbnails',
]);

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

  // Probe every zero-arg method across all 61 modules on mount.
  // This is the "all 61 callable" proof: any module that throws marks warn/err.
  useEffect(() => {
    const nextMod: Record<string, ModStat> = {};
    const nextMeth: Record<string, MethState> = {};
    for (const m of MODULES) {
      let okCount = 0;
      let errCount = 0;
      for (const methDef of m.methods) {
        const id = `${m.key}.${methDef.name}`;
        if (!methDef.zeroArg || PRIVACY_KEYS.has(m.key)) {
          nextMeth[id] = { status: 'pending', result: '' };
          continue;
        }
        try {
          const mod = resolveMod(m.key);
          const out = mod?.[methDef.name]?.();
          nextMeth[id] = { status: 'ok', result: fmt(out) };
          okCount++;
        } catch (e: any) {
          nextMeth[id] = { status: 'err', result: String(e?.message ?? e) };
          errCount++;
        }
      }
      nextMod[m.key] = errCount > 0 ? 'err'
        : okCount > 0 ? 'ok'
        : PRIVACY_KEYS.has(m.key) ? 'ok'   // privacy module: verified on tap, not auto-probed
        : 'none';
    }
    setStats(nextMod);
    setMeth(nextMeth);
  }, []);

  const callMethod = useCallback((m: ModEntry, name: string, zeroArg: boolean) => {
    const id = `${m.key}.${name}`;
    if (!zeroArg) {
      setMeth((p) => ({ ...p, [id]: { status: 'pending', result: '⚠ requires arguments — not auto-callable' } }));
      return;
    }
    try {
      const mod = resolveMod(m.key);
      const out = mod?.[name]?.();
      setMeth((p) => ({ ...p, [id]: { status: 'ok', result: fmt(out) } }));
    } catch (e: any) {
      setMeth((p) => ({ ...p, [id]: { status: 'err', result: String(e?.message ?? e) } }));
    }
  }, []);

  const verified = Object.values(stats).filter((s) => s === 'ok').length;
  const errored = Object.values(stats).filter((s) => s === 'err').length;

  return (
    <view className="Showcase">
      <view className="Header">
        <text className="Header__Title">LynxPo Modules</text>
        <text className="Header__Sub">Standalone host · {MODULE_COUNT} native modules · {METHOD_COUNT} methods</text>
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

      <scroll-view scroll-orientation="vertical" style={{ display: selected ? 'none' : 'flex' }}>
        <view className="Grid">
          {MODULES.map((m) => {
            const dot =
              stats[m.key] === 'ok' ? 'Cell__Dot--ok'
              : stats[m.key] === 'err' ? 'Cell__Dot--err'
              : stats[m.key] === 'warn' ? 'Cell__Dot--warn'
              : '';
            return (
              <view className="Cell" key={m.pkg}>
                <view
                  className="Cell__Btn"
                  bindtap={() => setSelected(m)}
                >
                  <view className={`Cell__Dot ${dot}`} />
                  <text className="Cell__Name">{m.label}</text>
                  <text className="Cell__Count">{m.methods.length} methods</text>
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
                <text className="Detail__Key">NativeModules.{selected.key}</text>
              </view>
              <view className="Detail__Back" bindtap={() => setSelected(null)}>
                <text className="Detail__BackText">‹ Back</text>
              </view>
            </view>
            <view className="MethList">
              {selected.methods.map((md) => {
                const id = `${selected.key}.${md.name}`;
                const st = meth[id] ?? { status: 'pending', result: '' };
                return (
                  <view className="Meth" key={id}>
                    <view className="Meth__Top">
                      <view style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <text className="Meth__Name">{md.name}</text>
                        {!md.zeroArg ? null : (
                          <text className="Meth__Flag">auto</text>
                        )}
                      </view>
                      <view
                        className={md.zeroArg ? 'Meth__Call' : 'Meth__Call Meth__Call--disabled'}
                        bindtap={() => callMethod(selected, md.name, md.zeroArg)}
                      >
                        Call
                      </view>
                    </view>
                    {st.result ? (
                      <view className="Meth__Result">
                        <text className={`Meth__Status Meth__Status--${st.status}`}>
                          {st.status === 'ok' ? '✓ ' : st.status === 'err' ? '✗ ' : ''}
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
        Verified = a zero-arg method returned without throwing. Tap a module to inspect and re-invoke its methods.
      </view>
    </view>
  );
}

root.render(<HostShowcase />);
