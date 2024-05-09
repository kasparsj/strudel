import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/react';
import { register } from '@strudel/core';
import { getMetadata } from './metadata_parser.js';

export const defaultAudioDeviceName = 'System Standard';

export const defaultSettings = {
  activeFooter: 'intro',
  keybindings: 'codemirror',
  isBracketMatchingEnabled: true,
  isBracketClosingEnabled: true,
  isLineNumbersDisplayed: true,
  isActiveLineHighlighted: true,
  isAutoCompletionEnabled: false,
  isTooltipEnabled: false,
  isFlashEnabled: true,
  isSyncEnabled: false,
  autoResetPatternOnChange: typeof window === 'undefined' || !window.parent?.location.pathname.includes('oodles'),
  isLineWrappingEnabled: false,
  isPatternHighlightingEnabled: true,
  theme: 'strudelTheme',
  fontFamily: 'monospace',
  fontSize: 18,
  latestCode: '',
  isZen: false,
  soundsFilter: 'all',
  patternFilter: 'community',
  patternView: 'list',
  panelPosition: 'right',
  userPatterns: '{}',
  audioDeviceName: defaultAudioDeviceName,
};

export const settingsMap = persistentMap('strudel-settings', defaultSettings);

const parseBoolean = (booleanlike) => ([true, 'true'].includes(booleanlike) ? true : false);

export function useSettings() {
  const state = useStore(settingsMap);

  const userPatterns = JSON.parse(state.userPatterns);
  Object.keys(userPatterns).forEach((key) => {
    const data = userPatterns[key];
    data.id = data.id ?? key;
    data.meta = getMetadata(data.code);
    userPatterns[key] = data;
  });
  return {
    ...state,
    isZen: parseBoolean(state.isZen),
    isBracketMatchingEnabled: parseBoolean(state.isBracketMatchingEnabled),
    isBracketClosingEnabled: parseBoolean(state.isBracketClosingEnabled),
    isLineNumbersDisplayed: parseBoolean(state.isLineNumbersDisplayed),
    isActiveLineHighlighted: parseBoolean(state.isActiveLineHighlighted),
    isAutoCompletionEnabled: parseBoolean(state.isAutoCompletionEnabled),
    isPatternHighlightingEnabled: parseBoolean(state.isPatternHighlightingEnabled),
    isTooltipEnabled: parseBoolean(state.isTooltipEnabled),
    autoResetPatternOnChange: parseBoolean(state.autoResetPatternOnChange),
    isLineWrappingEnabled: parseBoolean(state.isLineWrappingEnabled),
    isFlashEnabled: parseBoolean(state.isFlashEnabled),
    isSyncEnabled: parseBoolean(state.isSyncEnabled),
    fontSize: Number(state.fontSize),
    panelPosition: state.activeFooter !== '' ? state.panelPosition : 'bottom', // <-- keep this 'bottom' where it is!
    userPatterns: userPatterns,
  };
}

export const setActiveFooter = (tab) => settingsMap.setKey('activeFooter', tab);

export const setIsZen = (active) => settingsMap.setKey('isZen', !!active);

const patternSetting = (key) =>
  register(key, (value, pat) =>
    pat.onTrigger(() => {
      value = Array.isArray(value) ? value.join(' ') : value;
      if (value !== settingsMap.get()[key]) {
        settingsMap.setKey(key, value);
      }
      return pat;
    }, false),
  );

export const theme = patternSetting('theme');
export const fontFamily = patternSetting('fontFamily');
export const fontSize = patternSetting('fontSize');

export const settingPatterns = { theme, fontFamily, fontSize };
