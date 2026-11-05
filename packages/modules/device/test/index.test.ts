import { beforeEach, describe, expect, it, vi } from 'vitest';

const native = {
  isDevice: vi.fn(() => true),
  brand: vi.fn(() => 'Apple'),
  manufacturer: vi.fn(() => 'Apple'),
  modelName: vi.fn(() => 'iPhone'),
  designName: vi.fn(() => 'iPhone'),
  productName: vi.fn(() => 'iPhone'),
  deviceYearClass: vi.fn(() => 2024),
  totalMemory: vi.fn(() => 8192),
  deviceType: vi.fn(() => 1),
  osName: vi.fn(() => 'iOS'),
  osVersion: vi.fn(() => '18.0'),
  osBuildId: vi.fn(() => '22A100'),
  osInternalBuildId: vi.fn(() => 'internal'),
  osBuildFingerprint: vi.fn(() => 'fingerprint'),
  platformApiLevel: vi.fn(() => 34),
  deviceName: vi.fn(() => 'testing'),
};

vi.mock('../src/generated/DeviceModule', () => ({
  DeviceModule: native,
  default: native,
}));

describe('@lynxpo/mods-device facade', () => {
  beforeEach(() => {
    for (const fn of Object.values(native)) fn.mockClear();
  });

  it('delegates every getter to the native module', async () => {
    const mod = await import('../src/index.ts');
    expect(mod.getIsDevice()).toBe(true);
    expect(mod.getBrand()).toBe('Apple');
    expect(mod.getManufacturer()).toBe('Apple');
    expect(mod.getModelName()).toBe('iPhone');
    expect(mod.getDesignName()).toBe('iPhone');
    expect(mod.getProductName()).toBe('iPhone');
    expect(mod.getDeviceYearClass()).toBe(2024);
    expect(mod.getTotalMemory()).toBe(8192);
    expect(mod.getDeviceType()).toBe(1);
    expect(mod.getOsName()).toBe('iOS');
    expect(mod.getOsVersion()).toBe('18.0');
    expect(mod.getOsBuildId()).toBe('22A100');
    expect(mod.getOsInternalBuildId()).toBe('internal');
    expect(mod.getOsBuildFingerprint()).toBe('fingerprint');
    expect(mod.getPlatformApiLevel()).toBe(34);
    expect(mod.getDeviceName()).toBe('testing');
    expect(native.brand).toHaveBeenCalledOnce();
  });

  it('documents unsupported array mapping as undefined', async () => {
    const mod = await import('../src/index.ts');
    expect(mod.getSupportedCpuArchitectures()).toBeUndefined();
  });
});
