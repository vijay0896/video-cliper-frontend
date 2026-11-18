import React, { useState, useEffect, useMemo, useRef } from 'react';
import { groupCaptionsIntoBlocks, getActiveWordIndex } from '../remotion/lib/captions';

const RTL_CHARS = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

const POSITION_MAP = {
  top: 'top-[12%]',
  middle: 'top-[45%]',
  bottom: 'bottom-[18%]',
};

/**
 * Real-time dynamic viral caption overlay that renders directly over the video player.
 * Tracks video playback time with requestAnimationFrame for smooth, low-latency word highlighting.
 */
export default function VideoCaptionOverlay({
  videoRef,
  captions = [],
  config = null,
  enabled = true,
}) {
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const animFrameRef = useRef(null);

  // Group captions into short, punchy blocks (typical for TikTok/Shorts)
  const blocks = useMemo(() => {
    if (!captions || captions.length === 0) return [];
    const maxChars = config?.maxChars ?? 18;
    const maxDurationMs = config?.maxDurationMs ?? 1800;
    return groupCaptionsIntoBlocks(captions, maxChars, maxDurationMs);
  }, [captions, config?.maxChars, config?.maxDurationMs]);

  // Synchronize with video element
  useEffect(() => {
    const video = videoRef?.current;
    if (!video || !enabled || blocks.length === 0) return;

    let active = true;

    const onTimeUpdate = () => {
      if (active) setCurrentTimeMs(video.currentTime * 1000);
    };

    const loop = () => {
      if (active && video && !video.paused && !video.ended) {
        setCurrentTimeMs(video.currentTime * 1000);
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    const onPlay = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    const onPause = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setCurrentTimeMs(video.currentTime * 1000);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('seeking', onTimeUpdate);
    video.addEventListener('seeked', onTimeUpdate);

    // Initial check
    setCurrentTimeMs(video.currentTime * 1000);
    if (!video.paused) {
      animFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('seeking', onTimeUpdate);
      video.removeEventListener('seeked', onTimeUpdate);
    };
  }, [videoRef, enabled, blocks]);

  if (!enabled || blocks.length === 0) return null;

  // Find active block for current time
  const activeBlock = blocks.find(
    (b) => currentTimeMs >= b.startMs && currentTimeMs <= b.endMs + 100
  );

  if (!activeBlock) return null;

  const activeIndex = getActiveWordIndex(activeBlock.words, currentTimeMs);
  const positionClass = POSITION_MAP[config?.position] || POSITION_MAP.bottom;
  const isRtl = RTL_CHARS.test(activeBlock.text);

  const style = config?.style || {};
  const isUppercase = style.uppercase !== false;
  const highlightColor = style.highlightColor || '#FFE500';
  const fontColor = style.fontColor || '#FFFFFF';
  const baseOpacity = style.baseOpacity ?? 0.9;
  const hasBg = (style.bgOpacity || 0) > 0;
  const bgColor = style.bgColor || '#000000';

  const fontFamily =
    style.fontFamily === 'Montserrat' || style.fontFamily === 'Montserrat ExtraBold'
      ? "'Montserrat ExtraBold', Montserrat, sans-serif"
      : style.fontFamily === 'Impact'
      ? "Impact, 'Anton', sans-serif"
      : style.fontFamily === 'Verdana'
      ? 'Verdana, sans-serif'
      : "'Anton-Regular', Anton, Impact, sans-serif";

  return (
    <div
      className={`absolute left-0 right-0 ${positionClass} flex justify-center pointer-events-none select-none px-3 z-10 transition-all duration-75`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="text-center font-extrabold max-w-[92%] leading-tight tracking-wide"
        style={{
          fontFamily,
          textTransform: isUppercase ? 'uppercase' : 'none',
          backgroundColor: hasBg
            ? `${bgColor}${Math.round((style.bgOpacity || 0.6) * 255)
                .toString(16)
                .padStart(2, '0')}`
            : 'transparent',
          borderRadius: hasBg ? 8 : 0,
          padding: hasBg ? '4px 10px' : 0,
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
          {activeBlock.words.map((word, idx) => {
            const isActive = idx === activeIndex;
            return (
              <span
                key={idx}
                className="inline-block transition-transform duration-75"
                style={{
                  color: isActive ? highlightColor : fontColor,
                  opacity: isActive ? 1 : baseOpacity,
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  fontSize: 'clamp(14px, 4cqw, 20px)',
                  textShadow:
                    '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.85)',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(255,229,0,0.4))' : 'none',
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
