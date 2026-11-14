import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// react-router v7 relies on these Web APIs, which jsdom (Jest 27) does not provide.
global.TextEncoder ??= TextEncoder;
global.TextDecoder ??= TextDecoder;

// MUI's useMediaQuery needs matchMedia.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

window.scrollTo = () => {};

beforeEach(() => {
  window.localStorage.clear();
});
