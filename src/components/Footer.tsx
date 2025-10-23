import { COLORS } from "../constants/layout";

export function Footer() {
  return (
    <footer
      style={{
        height: 100,
        backgroundColor: COLORS.header,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 12,
        color: COLORS.textSecondary,
      }}
    >
      <div style={{ display: "flex", gap: 24 }}>
        <span>Ready</span>
        <span>FPS: 60</span>
        <span>Objects: 3</span>
      </div>
    </footer>
  );
}

