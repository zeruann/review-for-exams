import { useState } from "react";

interface ProfileGateProps {
  profiles: string[];
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function ProfileGate({ profiles, onSelect, onDelete }: ProfileGateProps) {
  const [name, setName] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onSelect(name.trim());
  }

  function handleDeleteClick(e: React.MouseEvent, profile: string) {
    e.stopPropagation();
    if (confirmingDelete === profile) {
      onDelete(profile);
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(profile);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h1 className="text-xl font-bold mb-1">Who's studying?</h1>
        <p className="text-sm mb-5" style={{ color: "var(--ink-muted)" }}>
          Each name keeps its own progress on this device.
        </p>

        {profiles.length > 0 && (
          <div className="space-y-2 mb-5">
            {profiles.map((p) => {
              const isConfirming = confirmingDelete === p;
              return (
                <div
                  key={p}
                  className="flex items-center gap-2 rounded-xl border transition"
                  style={{
                    borderColor: isConfirming ? "var(--low)" : "var(--border)",
                    backgroundColor: isConfirming ? "var(--low-soft)" : "transparent",
                  }}
                >
                  <button
                    onClick={() => onSelect(p)}
                    className="flex-1 text-left px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-l-xl"
                    style={{ color: "var(--ink)" }}
                  >
                    {p}
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, p)}
                    onBlur={() => setConfirmingDelete(null)}
                    aria-label={
                      isConfirming ? `Confirm delete ${p}` : `Delete ${p}`
                    }
                    className="px-3 py-3 text-sm font-medium rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    style={{
                      color: isConfirming ? "var(--low)" : "var(--ink-faint)",
                    }}
                  >
                    {isConfirming ? "Confirm?" : "Delete"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name…"
            aria-label="Your name"
            autoFocus
            className="flex-1 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2.5 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {profiles.length > 0 ? "New" : "Start"}
          </button>
        </form>
      </div>
    </div>
  );
}