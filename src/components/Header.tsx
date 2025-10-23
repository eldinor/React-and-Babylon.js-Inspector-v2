import { HEADER_HEIGHT, COLORS } from "../constants/layout";

export function Header() {
  return (
    <header
      style={{
        height: HEADER_HEIGHT,
        backgroundColor: COLORS.header,
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: COLORS.text,
        }}
      >
        React 18 Inspector
      </h1>
    </header>
  );
}

