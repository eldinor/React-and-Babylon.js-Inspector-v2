import { COLORS } from "../constants/layout";
import { useServiceDefinitions } from "../context/ServiceDefinitionsContext";

export function Footer() {
  const { services, toggleService } = useServiceDefinitions();

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
        fontSize: 14,
        color: COLORS.textSecondary,
        boxSizing: "border-box",
        margin: 0,
        gap: 24,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span>Service Definitions:</span>
        {services.map((service) => (
          <label
            key={service.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={service.enabled}
              onChange={() => toggleService(service.name)}
              style={{ cursor: "pointer" }}
            />
            <span>{service.name}</span>
          </label>
        ))}
      </div>
    </footer>
  );
}
