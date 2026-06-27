"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Live in-app camera. Requires a secure context (HTTPS or localhost) — over plain
// http on a LAN IP getUserMedia is unavailable and we report "unavailable" so the
// caller can fall back to the gallery picker.
export type CameraStatus = "starting" | "live" | "unavailable";

const MAX_EDGE = 1024;

export interface Camera {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  /** Grab the current frame as a downscaled JPEG File, or null if not live. */
  capture: () => Promise<File | null>;
}

export function useCamera(): Camera {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("starting");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("live");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const capture = useCallback(async (): Promise<File | null> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const scale = Math.min(1, MAX_EDGE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return null;
    return new File([blob], "capture.jpg", { type: "image/jpeg" });
  }, []);

  return { videoRef, status, capture };
}
