"use client";

import { create } from "zustand";
import {
  captchaPrompts,
  overlays,
  popupTemplates,
  soundEffects,
  toastTemplates,
  typingMutations
} from "@/lib/meme-data";

type Popup = {
  id: string;
  title: string;
  body: string;
  caption: string;
  x: string;
  y: string;
};

type Overlay = {
  id: string;
  title: string;
  description: string;
  format: string;
  badge: string;
  position: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
    width: string;
  };
};

type Toast = {
  id: string;
  message: string;
  tone: "info" | "warning" | "danger";
};

type ChaosState = {
  interactionCount: number;
  chaosLevel: 1 | 2 | 3 | 4;
  popups: Popup[];
  activeOverlays: Overlay[];
  toasts: Toast[];
  screenShake: boolean;
  glitchText: boolean;
  invertScreen: boolean;
  showCrashScreen: boolean;
  showCaptcha: boolean;
  captchaPrompt: string;
  cursorChaos: boolean;
  lastSound: string | null;
  triggerChaos: (source?: string) => void;
  fakeLogin: () => void;
  dismissPopup: (id: string) => void;
  dismissToast: (id: string) => void;
  recoverFromCrash: () => void;
  disableCursorChaos: () => void;
  closeCaptcha: () => void;
  failCaptcha: () => void;
  mutateTyping: (value: string) => string;
};

const maxPopups = 5;
const maxOverlays = 3;
const maxToasts = 6;

export const useChaosStore = create<ChaosState>((set, get) => ({
  interactionCount: 0,
  chaosLevel: 1,
  popups: [],
  activeOverlays: [],
  toasts: [],
  screenShake: false,
  glitchText: false,
  invertScreen: false,
  showCrashScreen: false,
  showCaptcha: false,
  captchaPrompt: captchaPrompts[0],
  cursorChaos: false,
  lastSound: null,
  triggerChaos: (source = "interaction") => {
    const state = get();
    const nextCount = state.interactionCount + 1;
    const chaosLevel = Math.min(4, 1 + Math.floor(nextCount / 5)) as 1 | 2 | 3 | 4;
    const seed = nextCount + source.length;
    const effectCount = 1 + (seed % 3);
    const nextPopups = [...state.popups];
    const nextOverlays = [...state.activeOverlays];
    const nextToasts = [...state.toasts];

    for (let index = 0; index < effectCount; index += 1) {
      if ((seed + index) % 2 === 0 && nextPopups.length < maxPopups) {
        const template = popupTemplates[(seed + index) % popupTemplates.length];
        nextPopups.push({
          id: `${nextCount}-${index}-popup`,
          title: template.title,
          body: template.body,
          caption: template.caption,
          x: `${8 + ((seed + index * 13) % 62)}vw`,
          y: `${12 + ((seed + index * 11) % 58)}vh`
        });
      }

      if (chaosLevel >= 3 && (seed + index) % 3 === 0 && nextOverlays.length < maxOverlays) {
        const template = overlays[(seed + index) % overlays.length];
        nextOverlays.push({
          id: `${nextCount}-${index}-overlay`,
          ...template
        });
      }

      if ((seed + index) % 2 === 1 && nextToasts.length < maxToasts) {
        nextToasts.push({
          id: `${nextCount}-${index}-toast`,
          message: toastTemplates[(seed + index) % toastTemplates.length],
          tone:
            (seed + index) % 3 === 0
              ? "danger"
              : (seed + index) % 3 === 1
                ? "warning"
                : "info"
        });
      }
    }

    const sound = soundEffects[seed % soundEffects.length];

    set({
      interactionCount: nextCount,
      chaosLevel,
      popups: nextPopups.slice(-maxPopups),
      activeOverlays: nextOverlays.slice(-maxOverlays),
      toasts: nextToasts.slice(-maxToasts),
      screenShake: chaosLevel >= 2 && seed % 2 === 0,
      glitchText: chaosLevel >= 2 && seed % 3 !== 0,
      invertScreen: chaosLevel >= 3 && seed % 5 === 0,
      showCrashScreen: chaosLevel >= 4 && seed % 7 === 0,
      showCaptcha: chaosLevel >= 2 && seed % 6 === 0 ? true : state.showCaptcha,
      captchaPrompt: captchaPrompts[seed % captchaPrompts.length],
      cursorChaos: chaosLevel >= 2 && source !== "type",
      lastSound: sound
    });

    window.setTimeout(
      () =>
        set({
          screenShake: false,
          glitchText: chaosLevel >= 4,
          invertScreen: false
        }),
      420
    );
  },
  fakeLogin: () => {
    get().triggerChaos("login");
    set((state) => ({
      popups: [
        ...state.popups,
        {
          id: `login-${state.interactionCount}`,
          title: "Nice try 😂",
          body: "Credentials captured by the Ministry of Skill Issues. Please try being less trusting.",
          caption: "FAFO energy detected in your login attempt.",
          x: "54vw",
          y: "16vh"
        }
      ].slice(-maxPopups)
    }));
  },
  dismissPopup: (id) => {
    set((state) => ({
      popups: state.popups.filter((popup) => popup.id !== id)
    }));
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },
  recoverFromCrash: () => {
    set({
      showCrashScreen: false,
      invertScreen: false
    });
  },
  disableCursorChaos: () => {
    set({ cursorChaos: false });
  },
  closeCaptcha: () => {
    set({ showCaptcha: false });
  },
  failCaptcha: () => {
    get().triggerChaos("captcha");
    set((state) => ({
      showCaptcha: false,
      popups: [
        ...state.popups,
        {
          id: `captcha-${state.interactionCount}`,
          title: "Verification failed",
          body: "The system has concluded that you are, unfortunately, not him.",
          caption: "Please contact support, vibes, and destiny.",
          x: "18vw",
          y: "20vh"
        }
      ].slice(-maxPopups)
    }));
  },
  mutateTyping: (value) => {
    const state = get();
    if (state.chaosLevel < 3 || value.length < 4) return value;
    const mutation = typingMutations[(value.length + state.interactionCount) % typingMutations.length];
    if (state.interactionCount % 3 !== 0) return value;
    return `${value.slice(0, Math.max(1, value.length - 2))}${mutation}`;
  }
}));
