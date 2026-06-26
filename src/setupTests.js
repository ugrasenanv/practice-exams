import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';

const createStorageMock = () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
});

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
  configurable: true,
  value: sessionStorageMock
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

const mockDateNow = vi.spyOn(Date, 'now');

beforeEach(() => {
  mockDateNow.mockReturnValue(1609459200000);
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
  localStorageMock.clear.mockReset();
  localStorageMock.key.mockReset();
  sessionStorageMock.getItem.mockReset();
  sessionStorageMock.setItem.mockReset();
  sessionStorageMock.removeItem.mockReset();
  sessionStorageMock.clear.mockReset();
  sessionStorageMock.key.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});