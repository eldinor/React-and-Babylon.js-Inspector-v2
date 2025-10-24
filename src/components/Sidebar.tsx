import { SIDEBAR_WIDTH, COLORS } from "../constants/layout";

export function Sidebar() {
  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        backgroundColor: COLORS.sidebar,
        borderRight: `1px solid ${COLORS.border}`,
        padding: 16,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <h2
          style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.text,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Scene
        </h2>
        <div
          style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: "4px 0" }}>• Box</p>
          <p style={{ margin: "4px 0" }}>• Ground</p>
          <p style={{ margin: "4px 0" }}>• Alien Model</p>
        </div>
      </div>

      <div>
        <h2
          style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.text,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Properties
        </h2>
        <div
          style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: "4px 0" }}>Select an object to view properties</p>
        </div>
      </div>
    </aside>
  );
}

