import { root } from '@lynx-js/react';
import { getBrand, getModelName, getOsName, getOsVersion, getDeviceType } from '@lynxpo/mods-device';

const s = (v: unknown): string => (v === null || v === undefined ? '—' : String(v));

export function HostSync() {
  // Synchronous native getters in the initial render — no re-render, so the
  // engine never re-applies struct props (frame/bounds) via the NSInvocation bridge.
  const txt =
    'LynxPo host renders. ' +
    'Device: ' + s(getBrand()) + ' ' + s(getModelName()) + ' ' + s(getDeviceType()) + ' ' +
    s(getOsName()) + ' ' + s(getOsVersion());
  return (
    <view>
      <text>{txt}</text>
    </view>
  );
}

root.render(<HostSync />);
