interface ProfileSwitcherProps {
  activeProfile: string;
  onSwitch: () => void;
}

export default function ProfileSwitcher({ activeProfile, onSwitch }: ProfileSwitcherProps) {
  return (
    <button
      onClick={onSwitch}
      className="text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      style={{
        borderColor: "var(--border)",
        color: "var(--ink-muted)",
        backgroundColor: "var(--surface)",
      }}
    >
      {activeProfile} · Switch
    </button>
  );
}