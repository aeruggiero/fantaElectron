import {expect, test, vi} from 'vitest';
import ReactiveHash from '../src/components/ReactiveHash.vue';

vi.mock('#preload', () => {
  return {
    sha256sum: vi.fn((s: string) => `${s}:HASHED`),
  };
});

test('ReactiveHash component', async () => {
  expect(ReactiveHash).toBeTruthy();
});
