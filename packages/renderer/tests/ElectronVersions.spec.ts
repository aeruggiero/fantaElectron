import {expect, test, vi} from 'vitest';
import ElectronVersions from '../src/components/ElectronVersions.vue';

vi.mock('#preload', () => {
  return {
    versions: {lib1: 1, lib2: 2},
  };
});

test('ElectronVersions component', async () => {
  expect(ElectronVersions).toBeTruthy();
});
