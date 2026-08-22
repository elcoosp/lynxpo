import { root } from '@lynx-js/react';
import { useDeviceInfo } from './mods/deviceInfo.js';
import { useEnvInfo } from './mods/envInfo.js';

const s = (v: unknown): string => (v === null || v === undefined ? '—' : String(v));

export function HostSingle() {
  const { info: device } = useDeviceInfo();
  const { info: env } = useEnvInfo();
  const txt =
    'LynxPo host renders. ' +
    'Device: ' + s(device?.brand) + ' ' + s(device?.modelName) + ' ' +
    s(device?.osName) + ' ' + s(device?.osVersion) + ' | ' +
    'Env appId: ' + s(env?.appId);
  return (
    <view>
      <text>{txt}</text>
    </view>
  );
}

root.render(<HostSingle />);
