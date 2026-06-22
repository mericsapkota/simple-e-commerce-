import React, { useState, useRef, useEffect } from "react";
import { Upload, Music2, PlayIcon, Sparkles, RefreshCw, ExternalLink, ImageIcon } from "lucide-react";

/**
 * ============================================================================
 * CONFIG
 * ----------------------------------------------------------------------------
 * Point this at your running backend (see /songmatch-backend). In dev that's
 * typically http://localhost:4000.
 * ============================================================================
 */
const API_BASE = "http://localhost:4000/api";

export default function SongMatchApp() {
  const [source, setSource] = useState("spotify"); // "spotify" | "youtube"
  const [connected, setConnected] = useState({ spotify: false, youtube: false });
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksError, setTracksError] = useState(null);

  const [photo, setPhoto] = useState(null); // data URL for preview
  const [photoFile, setPhotoFile] = useState(null); // raw File for upload

  const [matches, setMatches] = useState(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState(null);

  const fileInputRef = useRef(null);

  // On load: check connection status for both sources, and pick up the
  // ?connected=spotify|youtube param the OAuth callback redirects back with.
  useEffect(() => {
    checkConnectionStatus();
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) {
      setSource(params.get("connected") === "youtube" ? "youtube" : "spotify");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Whenever the connected source changes (or becomes connected), load tracks.
  useEffect(() => {
    if (connected[source]) loadTracks(source);
  }, [source, connected.spotify, connected.youtube]);

  async function checkConnectionStatus() {
    try {
      const [sp, yt] = await Promise.all([
        fetch(`${API_BASE}/auth/spotify/status`, { credentials: "include" }).then((r) => r.json()),
        fetch(`${API_BASE}/auth/google/status`, { credentials: "include" }).then((r) => r.json()),
      ]);
      setConnected({ spotify: sp.connected, youtube: yt.connected });
    } catch (err) {
      console.error("Failed to check connection status", err);
    }
  }

  async function loadTracks(src) {
    setTracksLoading(true);
    setTracksError(null);
    setMatches(null);
    try {
      const res = await fetch(`${API_BASE}/tracks?source=${src}`, { credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load tracks");
      const data = await res.json();
      setTracks(data.topTracks || []);
    } catch (err) {
      setTracksError(err.message);
      setTracks([]);
    } finally {
      setTracksLoading(false);
    }
  }

  function handleConnect(src) {
    window.location.href = `${API_BASE}/auth/${src === "spotify" ? "spotify" : "google"}/login`;
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setMatches(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleMatch() {
    if (!photoFile || tracks.length === 0) return;
    setMatching(true);
    setMatchError(null);
    setMatches(null);
    try {
      const formData = new FormData();
      formData.append("image", photoFile);
      formData.append("tracks", JSON.stringify(tracks));

      const res = await fetch(`${API_BASE}/match`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).error || "Matching failed");
      const data = await res.json();
      setMatches(data.matches);
    } catch (err) {
      setMatchError(err.message);
    } finally {
      setMatching(false);
    }
  }

  const isConnected = connected[source];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#14F1B2] flex items-center justify-center">
            <Sparkles size={18} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">songmatch</h1>
        </div>
        <p className="text-white/50 text-sm mb-10 ml-12">
          upload a photo, get the best song from your own listening history to pair with it
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          {/* LEFT: Controls */}
          <div className="space-y-6">
            {/* Source picker + connect */}
            <div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">
                01 · connect your music
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setSource("spotify")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                    source === "spotify"
                      ? "border-[#7C5CFC] bg-[#7C5CFC]/15 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25"
                  }`}
                >
                  <Music2 size={16} /> Spotify
                </button>
                <button
                  onClick={() => setSource("youtube")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                    source === "youtube"
                      ? "border-[#7C5CFC] bg-[#7C5CFC]/15 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25"
                  }`}
                >
                  <PlayIcon size={16} /> YouTube
                </button>
              </div>

              {!isConnected ? (
                <button
                  onClick={() => handleConnect(source)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:opacity-90 transition-all"
                >
                  <ExternalLink size={15} />
                  Connect {source === "spotify" ? "Spotify" : "YouTube"}
                </button>
              ) : (
                <div className="text-xs text-[#14F1B2] flex items-center gap-1.5 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14F1B2] inline-block" />
                  {source === "spotify" ? "Spotify" : "YouTube"} connected
                </div>
              )}

              {source === "youtube" && isConnected && (
                <p className="text-[11px] text-white/30 mt-2 leading-relaxed">
                  Showing Liked videos — YouTube has no public "watch history" API. For stronger results, export your
                  history from Google Takeout and upload it (see backend README for the endpoint).
                </p>
              )}
            </div>

            {/* Track count / status */}
            {isConnected && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">02 · your tracks</div>
                {tracksLoading && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <RefreshCw size={14} className="animate-spin" /> loading your tracks…
                  </div>
                )}
                {tracksError && <div className="text-sm text-red-400">{tracksError}</div>}
                {!tracksLoading && !tracksError && (
                  <div className="text-sm text-white/60">
                    {tracks.length} tracks loaded
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
                      {tracks.slice(0, 8).map((t) => (
                        <div key={t.id} className="text-xs text-white/40 truncate">
                          {t.rank}. {t.title} — {t.artist}
                        </div>
                      ))}
                      {tracks.length > 8 && <div className="text-xs text-white/25">+{tracks.length - 8} more</div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Photo upload */}
            <div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">03 · your photo</div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-8 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white/90 transition-all text-sm"
              >
                <Upload size={16} />
                {photo ? "Change photo" : "Upload a photo"}
              </button>
            </div>

            {/* Match button */}
            <button
              onClick={handleMatch}
              disabled={!photo || !isConnected || tracks.length === 0 || matching}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#14F1B2] text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:opacity-90"
            >
              {matching ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> analyzing your photo…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> find the best song
                </>
              )}
            </button>
            {matchError && <p className="text-sm text-red-400">{matchError}</p>}
          </div>

          {/* RIGHT: Photo + Results */}
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">your photo</div>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] aspect-[4/5] flex items-center justify-center mb-8 max-w-sm">
              {photo ? (
                <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/25 text-sm">
                  <ImageIcon size={28} />
                  no photo yet
                </div>
              )}
            </div>

            {matches && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">
                  best matches, ranked
                </div>
                <div className="space-y-3">
                  {matches.map((m, i) => (
                    <div
                      key={m.trackId}
                      className={`p-4 rounded-xl border ${
                        i === 0 ? "border-[#14F1B2]/40 bg-[#14F1B2]/[0.06]" : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <div className="font-semibold text-sm">
                            {i === 0 && <span className="text-[#14F1B2] mr-1.5">★ best fit</span>}
                            {m.track.title}
                          </div>
                          <div className="text-xs text-white/40">{m.track.artist}</div>
                        </div>
                        <div className="text-xs font-mono text-white/50 flex-shrink-0">{m.matchScore}%</div>
                      </div>
                      <p className="text-sm text-white/70 italic mt-2">"{m.reason}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
