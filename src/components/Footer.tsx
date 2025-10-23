import { COLORS } from "../constants/layout";

export function Footer() {
  return (
    <footer
      style={{
        height: 90,
        backgroundColor: COLORS.header,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 12,
        color: COLORS.textSecondary,
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div style={{ display: "flex", gap: 24 }}>
        <span>Ready</span>
      </div>
    </footer>
  );
}

