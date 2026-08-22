import { root } from '@lynx-js/react';

export function HostMin() {
  return (
    <view>
      <text>LynxPo host renders.</text>
      <text>Autolink modules registered.</text>
    </view>
  );
}

root.render(<HostMin />);
