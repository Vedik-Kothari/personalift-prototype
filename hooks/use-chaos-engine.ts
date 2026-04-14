"use client";

import { useEffect, useMemo } from "react";
import { useChaosStore } from "@/store/chaos-store";

export type ChaosController = {
  interactionCount: number;
  chaosLevel: 1 | 2 | 3 | 4;
  popups: ReturnType<typeof useChaosStore.getState>["popups"];
  activeOverlays: ReturnType<typeof useChaosStore.getState>["activeOverlays"];
  toasts: ReturnType<typeof useChaosStore.getState>["toasts"];
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
  closeCaptcha: () => void;
  failCaptcha: () => void;
  mutateTyping: (value: string) => string;
};

function useAudioEngine() {
  return useMemo(() => {
    let audioContext: AudioContext | null = null;

    const getContext = () => {
      if (typeof window === "undefined") return null;
      if (!audioContext) {
        const AudioCtx = window.AudioContext || (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;
        if (!AudioCtx) return null;
        audioContext = new AudioCtx();
      }
      return audioContext;
    };

    const pulse = (frequency: number, duration: number, type: OscillatorType, gain = 0.08) => {
      const context = getContext();
      if (!context) return;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      envelope.gain.setValueAtTime(gain, context.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(envelope);
      envelope.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    };

    return {
      play(name: string) {
        if (name === "vine-boom") pulse(62, 0.5, "triangle", 0.16);
        if (name === "bruh") pulse(92, 0.3, "square", 0.11);
        if (name === "windows-error") {
          pulse(420, 0.12, "triangle", 0.05);
          setTimeout(() => pulse(320, 0.18, "triangle", 0.05), 120);
        }
        if (name === "discord-ping") pulse(880, 0.14, "sine", 0.04);
        if (name === "goofy-ahh") {
          pulse(510, 0.09, "sawtooth", 0.04);
          setTimeout(() => pulse(300, 0.24, "triangle", 0.04), 90);
        }
      }
    };
  }, []);
}

export function useChaosEngine() {
  const store = useChaosStore();
  const audio = useAudioEngine();

  useEffect(() => {
    if (!store.lastSound) return;
    audio.play(store.lastSound);
  }, [audio, store.lastSound]);

  useEffect(() => {
    if (!store.showCrashScreen) return;
    const timeout = window.setTimeout(() => store.recoverFromCrash(), 2200);
    return () => window.clearTimeout(timeout);
  }, [store, store.showCrashScreen]);

  useEffect(() => {
    if (!store.cursorChaos) return;
    const reset = window.setTimeout(() => store.disableCursorChaos(), 1400);
    return () => window.clearTimeout(reset);
  }, [store, store.cursorChaos]);

  useEffect(() => {
    if (store.toasts.length === 0) return;
    const latestToast = store.toasts[store.toasts.length - 1];
    const timeout = window.setTimeout(() => store.dismissToast(latestToast.id), 2600);
    return () => window.clearTimeout(timeout);
  }, [store, store.toasts]);

  return {
    ...store,
    triggerChaos: store.triggerChaos,
    fakeLogin: store.fakeLogin,
    dismissPopup: store.dismissPopup,
    dismissToast: store.dismissToast,
    closeCaptcha: store.closeCaptcha,
    failCaptcha: store.failCaptcha,
    mutateTyping: store.mutateTyping
  };
}
