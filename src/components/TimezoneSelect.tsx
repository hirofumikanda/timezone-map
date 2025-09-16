import React from "react";

interface TimezoneSelectProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  timezoneOptions: string[];
}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  selectedTimezone,
  onTimezoneChange,
  timezoneOptions
}) => {
  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1000,
      background: "white",
      padding: "8px",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
    }}>
      <label 
        htmlFor="timezone-select" 
        style={{ 
          display: "block", 
          marginBottom: "4px", 
          fontSize: "14px", 
          fontWeight: "bold" 
        }}
      >
        Time Zone
      </label>
      <select
        id="timezone-select"
        value={selectedTimezone}
        onChange={(e) => onTimezoneChange(e.target.value)}
        style={{
          padding: "4px 8px",
          borderRadius: "2px",
          border: "1px solid #ccc",
          fontSize: "14px",
          minWidth: "120px"
        }}
      >
        <option value="">-- 選択してください --</option>
        {timezoneOptions.map(tz => (
          <option key={tz} value={tz}>
            UTC{tz}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneSelect;