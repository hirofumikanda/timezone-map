export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          display: "inline-block",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: color,
          border: "1.5px solid #888",
          marginRight: 6,
        }}
      />
      <span>{label}</span>
    </div>
  );
}