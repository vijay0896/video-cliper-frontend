import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, Copy, Check, FileText, TrendingUp, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config';
import { apiFetch } from '../lib/api';
import Modal from './ui/Modal';

function clipDurationSeconds(clip) {
    const segments = clip.recipe?.segments;
    if (segments?.length) {
        return segments.reduce((acc, s) => acc + (s.end - s.start), 0);
    }
    return clip.end && clip.start ? clip.end - clip.start : NaN;
}

function formatDuration(clip) {
    const secs = Math.floor(clipDurationSeconds(clip));
    if (!Number.isFinite(secs) || secs < 0) return null;
    return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
}

export default function ResultCard({
    clip,
    index,
    jobId,
    durable,
    onPlay,
    onPause,
}) {
    const whyRef = useRef(null);
    const [whyOpen, setWhyOpen] = useState(false);
    const [whyClamped, setWhyClamped] = useState(false);

    useEffect(() => {
        const el = whyRef.current;
        if (!el) return;
        const check = () => setWhyClamped(el.scrollHeight > el.clientHeight + 1);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [clip.why]);

    const [showDescModal, setShowDescModal] = useState(false);
    const videoRef = React.useRef(null);

    const [currentVideoUrl, setCurrentVideoUrl] = useState(getApiUrl(clip.video_url));
    const [durableSrc, setDurableSrc] = useState(null);
    const [durableFailed, setDurableFailed] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [videoErrored, setVideoErrored] = useState(false);
    const [resolution, setResolution] = useState(null);
    const [downloadPct, setDownloadPct] = useState(null);
    const [copied, setCopied] = useState(null);

    const [copyTitle, setCopyTitle] = useState(clip.video_title_for_youtube_short || clip.title || '');
    const [copyDescription, setCopyDescription] = useState(
        clip.video_description_for_tiktok || clip.video_description_for_instagram || clip.description || ''
    );
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

    useEffect(() => {
        if (clip.video_title_for_youtube_short || clip.title) {
            setCopyTitle((prev) => prev || clip.video_title_for_youtube_short || clip.title);
        }
        if (clip.video_description_for_tiktok || clip.video_description_for_instagram || clip.description) {
            setCopyDescription((prev) => prev || clip.video_description_for_tiktok || clip.video_description_for_instagram || clip.description);
        }
    }, [clip.video_title_for_youtube_short, clip.title, clip.video_description_for_tiktok, clip.video_description_for_instagram, clip.description]);

    const serverVideoFile = (clip.video_url || '').split('/').pop();

    useEffect(() => {
        if (durable?.url && durable.filename && durable.filename === serverVideoFile && !hasPlayed) {
            setDurableSrc((prev) => prev || durable.url);
        } else {
            setDurableSrc(null);
        }
    }, [durable?.url, durable?.filename, serverVideoFile, hasPlayed]);

    useEffect(() => {
        if (videoErrored && durable?.url && currentVideoUrl !== durable.url) {
            setCurrentVideoUrl(durable.url);
            setVideoErrored(false);
        }
    }, [videoErrored, durable, currentVideoUrl]);

    useEffect(() => {
        const serverUrl = getApiUrl(clip.video_url);
        if (serverUrl && serverUrl !== currentVideoUrl) {
            setCurrentVideoUrl(serverUrl);
            setDurableFailed(false);
            setHasPlayed(false);
            if (videoRef.current) videoRef.current.load();
        }
    }, [clip.video_url]);

    const handleCopy = async (field, text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(field);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    const handleGenerateCopy = async () => {
        setIsGeneratingCopy(true);
        try {
            const savedApiKey = localStorage.getItem('gemini_key') || '';
            const headers = { 'Content-Type': 'application/json' };
            if (savedApiKey) headers['X-Gemini-Key'] = savedApiKey;

            const res = await apiFetch('/api/clip/generate-copy', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    jobId,
                    clipIndex: index,
                    title: copyTitle || clip.title || clip.hook,
                    hook: clip.hook || clip.title,
                    context: clip.why || clip.reason,
                }),
            });

            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            const result = data.data || data;

            if (result.title) {
                setCopyTitle(result.title);
                clip.video_title_for_youtube_short = result.title;
                clip.title = result.title;
            }
            if (result.description) {
                setCopyDescription(result.description);
                clip.video_description_for_tiktok = result.description;
                clip.video_description_for_instagram = result.description;
                clip.description = result.description;
            }
        } catch (err) {
            console.error('Failed to generate copy:', err);
        } finally {
            setIsGeneratingCopy(false);
        }
    };

    const downloadClip = async () => {
        try {
            setDownloadPct(0);
            const response = await fetch(currentVideoUrl);
            if (!response.ok) throw new Error('Download failed');
            const total = Number(response.headers.get('content-length')) || 0;
            let blob;

            if (!response.body || !total) {
                blob = await response.blob();
            } else {
                const reader = response.body.getReader();
                const chunks = [];
                let received = 0;
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    received += value.length;
                    setDownloadPct(Math.min(99, Math.round((received / total) * 100)));
                }
                blob = new Blob(chunks, { type: 'video/mp4' });
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `clip-${index + 1}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download error:', err);
            window.open(currentVideoUrl, '_blank');
        } finally {
            setDownloadPct(null);
        }
    };

    const playbackUrl = (durableSrc && !durableFailed) ? durableSrc : currentVideoUrl;
    const durationReadout = formatDuration(clip);

    return (
        <div className="card overflow-hidden flex flex-col md:flex-row group hover:border-rule2 transition-colors animate-fade md:min-h-[420px]" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Left: Video Preview — 9:16 vertical column */}
            <div className="w-full max-w-[calc(64vh*0.5625)] md:max-w-none mx-auto md:mx-0 md:w-[270px] bg-black relative shrink-0 aspect-[9/16] group/video rounded-lg overflow-hidden flex items-center justify-center self-center md:self-start shadow-md">
                <video
                    ref={videoRef}
                    src={playbackUrl}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                    onLoadedMetadata={(e) => {
                        if (e.target.videoWidth) {
                            setResolution(`${e.target.videoWidth}×${e.target.videoHeight}`);
                        }
                    }}
                    onError={() => {
                        if (playbackUrl === durableSrc) {
                            setDurableFailed(true);
                            return;
                        }
                        if (durable?.url && currentVideoUrl !== durable.url) setCurrentVideoUrl(durable.url);
                        else setVideoErrored(true);
                    }}
                    onPlay={() => {
                        setHasPlayed(true);
                        const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
                        onPlay && onPlay(clip.start + currentTime);
                    }}
                    onPause={() => onPause && onPause()}
                    onEnded={() => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                        }
                    }}
                />

                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/70 text-ink font-mono text-micro uppercase px-2 py-1 rounded-full">
                        Clip {index + 1}
                    </span>
                    {Number.isFinite(clip.predicted_score) && (
                        <span
                            className="bg-black/70 font-mono text-micro uppercase px-2 py-1 rounded-full flex items-center gap-1"
                            title="openshorts' prediction of how well this clip will perform, from 0 to 100"
                        >
                            <TrendingUp size={11} className="shrink-0 text-muted" />
                            <span className="text-muted">viral</span>
                            <b className={
                                clip.predicted_score >= 80 ? 'text-ok'
                                    : clip.predicted_score >= 65 ? 'text-brass'
                                        : 'text-ink2'
                            }>
                                {clip.predicted_score}
                            </b>
                            <span className="text-muted">/100</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Content & Details */}
            <div className="flex-1 p-4 md:p-5 flex flex-col overflow-hidden min-w-0">
                <div className="mb-4">
                    <h3 className="text-base font-medium text-ink leading-tight line-clamp-2 mb-2 break-words" title={copyTitle || clip.video_title_for_youtube_short}>
                        {copyTitle || clip.video_title_for_youtube_short || "Viral Clip Generated"}
                    </h3>
                    {clip.why && (
                        <div
                            className="relative mb-2"
                            onMouseEnter={() => setWhyOpen(true)}
                            onMouseLeave={() => setWhyOpen(false)}
                        >
                            <p
                                ref={whyRef}
                                className={`text-xs text-muted leading-snug line-clamp-2 break-words ${whyClamped ? 'cursor-pointer' : ''}`}
                                onClick={() => whyClamped && setWhyOpen(v => !v)}
                                aria-label="why openshorts picked this moment"
                            >
                                {clip.why}
                            </p>
                            {whyClamped && whyOpen && (
                                <div
                                    role="tooltip"
                                    className="absolute left-0 right-0 top-full mt-1 z-20 bg-paper border border-rule rounded-input px-3 py-2 text-xs text-ink leading-snug shadow-lg"
                                >
                                    {clip.why}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                        {durationReadout && <span className="readout bg-paper3 px-2 py-0.5 rounded-full shrink-0">{durationReadout}</span>}
                        {resolution && <span className="readout bg-paper3 px-2 py-0.5 rounded-full shrink-0">{resolution}</span>}
                        <span className="readout bg-paper3 px-2 py-0.5 rounded-full shrink-0">#shorts</span>
                        <span className="readout bg-paper3 px-2 py-0.5 rounded-full shrink-0">#viral</span>
                    </div>
                </div>

                {/* Descriptions & AI Copy Generator */}
                <div className="flex-1 min-h-0 space-y-2 mb-4">
                    {/* Generate Title & Description Button */}
                    <button
                        type="button"
                        onClick={handleGenerateCopy}
                        disabled={isGeneratingCopy}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-input border border-brass/50 bg-brass/10 hover:bg-brass/20 active:scale-[0.99] text-xs font-semibold text-ink transition-all cursor-pointer shadow-sm disabled:opacity-50 group/gen"
                        title="Generate viral YouTube Shorts title and TikTok/Instagram description with hashtags"
                    >
                        {isGeneratingCopy ? (
                            <>
                                <Loader2 size={14} className="animate-spin text-brass" />
                                <span className="text-ink">Generating Title & Description…</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={14} className="text-brass transition-transform group-hover/gen:scale-110" />
                                <span>{copyTitle || copyDescription ? 'Regenerate Title & Description' : 'Generate Title & Description'}</span>
                            </>
                        )}
                    </button>

                    <div className="bg-paper rounded-input px-3 py-2 border border-rule flex items-center gap-2 min-w-0 overflow-hidden">
                        <span className="eyebrow shrink-0 text-muted">YOUTUBE</span>
                        <p className="text-xs text-ink truncate flex-1 min-w-0" title={copyTitle || "Viral Short Video"}>
                            {copyTitle || "Viral Short Video"}
                        </p>
                        <button
                            onClick={() => handleCopy('youtube', copyTitle || "Viral Short Video")}
                            aria-label="copy youtube title"
                            className="p-1 rounded-full text-muted hover:text-brass transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                            title="Copy YouTube Title"
                        >
                            {copied === 'youtube' ? (
                                <span className="text-[11px] text-ok font-mono flex items-center gap-1">
                                    <Check size={14} className="text-ok" /> Copied!
                                </span>
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>

                    <div className="bg-paper rounded-input px-3 py-2 border border-rule flex items-center gap-2 min-w-0 overflow-hidden">
                        <span className="eyebrow shrink-0 text-muted">TIKTOK · IG</span>
                        <p className="text-xs text-ink2 truncate flex-1 min-w-0" title={copyDescription}>
                            {copyDescription || "No description generated yet"}
                        </p>
                        <button
                            onClick={() => handleCopy('caption', copyDescription)}
                            disabled={!copyDescription}
                            aria-label="copy caption"
                            className="p-1 rounded-full text-muted hover:text-brass transition-colors shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-30"
                            title="Copy Description"
                        >
                            {copied === 'caption' ? (
                                <span className="text-[11px] text-ok font-mono flex items-center gap-1">
                                    <Check size={14} className="text-ok" /> Copied!
                                </span>
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={() => setShowDescModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-1.5 rounded-input border border-dashed border-rule text-xs lowercase text-muted hover:text-brass hover:border-rule2 transition-colors cursor-pointer"
                    >
                        <FileText size={14} /> view descriptions
                    </button>
                </div>

                {/* Download Only Action Button */}
                <div className="mt-auto pt-4 border-t border-rule">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            downloadClip();
                        }}
                        disabled={downloadPct !== null}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-input shadow-md hover:opacity-90 transition-all cursor-pointer"
                    >
                        {downloadPct !== null ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-paper" />
                                <span>Downloading {downloadPct}%...</span>
                            </>
                        ) : (
                            <>
                                <Download size={18} className="shrink-0" />
                                <span>Download Clip</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Descriptions Modal */}
            <Modal
                isOpen={showDescModal}
                onClose={() => setShowDescModal(false)}
                eyebrow="GENERATED COPY"
                title="descriptions"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <label className="eyebrow">YOUTUBE TITLE</label>
                            <button
                                onClick={() => handleCopy('youtube', copyTitle || "Viral Short Video")}
                                aria-label="copy youtube title"
                                className="p-1 rounded-full text-muted hover:text-brass transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                            >
                                {copied === 'youtube' ? (
                                    <span className="text-xs text-ok font-mono flex items-center gap-1"><Check size={14} /> Copied!</span>
                                ) : (
                                    <Copy size={14} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-ink select-all break-words bg-paper rounded-input p-3 border border-rule">
                            {copyTitle || "Viral Short Video"}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <label className="eyebrow">TIKTOK · IG CAPTION</label>
                            <button
                                onClick={() => handleCopy('caption', copyDescription)}
                                disabled={!copyDescription}
                                aria-label="copy caption"
                                className="p-1 rounded-full text-muted hover:text-brass transition-colors shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-30"
                            >
                                {copied === 'caption' ? (
                                    <span className="text-xs text-ok font-mono flex items-center gap-1"><Check size={14} /> Copied!</span>
                                ) : (
                                    <Copy size={14} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-ink2 select-all break-words bg-paper rounded-input p-3 border border-rule whitespace-pre-wrap">
                            {copyDescription || "No description generated yet. Click 'Generate Title & Description' to generate one."}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
