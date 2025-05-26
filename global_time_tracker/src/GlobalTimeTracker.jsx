import React, { useState, useEffect } from "react";
import { DateTime, Info } from "luxon";

// Color scheme from requirements
const COLORS = {
  primary: "#2C3E50",
  secondary: "#3498DB",
  accent: "#27AE60",
  background: "#20252a",
  text: "#ececec"
};

const TIMEZONES = [
  { label: "Local", value: DateTime.local().zoneName },
  { label: "UTC", value: "UTC" },
  { label: "New York", value: "America/New_York" },
  { label: "London", value: "Europe/London" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Sydney", value: "Australia/Sydney" }
];

// PUBLIC_INTERFACE
function GlobalTimeTracker() {
  // Clock state
  const [now, setNow] = useState(DateTime.local());

  // Alarms: list of {id, label, hour, minute, second, zone, triggered (bool), isReminder}
  const [alarms, setAlarms] = useState([]);
  const [alarmForm, setAlarmForm] = useState({
    label: "",
    zone: DateTime.local().zoneName,
    hour: "",
    minute: "",
    isReminder: false
  });
  const [alarmMessage, setAlarmMessage] = useState("");

  // Converter state
  const [convert, setConvert] = useState({
    fromZone: DateTime.local().zoneName,
    toZone: "UTC",
    time: now.toFormat("HH:mm")
  });
  const [converted, setConverted] = useState("");

  // Update now every second
  useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.local()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for due alarms
  useEffect(() => {
    alarms.forEach((alarm, idx) => {
      if (!alarm.triggered) {
        const alarmTime = DateTime.now().setZone(alarm.zone)
          .set({ hour: alarm.hour, minute: alarm.minute, second: 0, millisecond: 0 });
        const nowTz = DateTime.now().setZone(alarm.zone);
        if (
          nowTz.hour === alarmTime.hour &&
          nowTz.minute === alarmTime.minute &&
          nowTz.second === 0
        ) {
          setAlarmMessage(
            `${alarm.isReminder ? "Reminder" : "Alarm"}: ${alarm.label || "No label"} for ${alarmTime.toFormat("HH:mm")}`
          );
          // Mark alarm as triggered
          setAlarms(a =>
            a.map((alrm, i) =>
              i === idx ? { ...alrm, triggered: true } : alrm
            )
          );
        }
      }
    });
  }, [now, alarms]);

  // PUBLIC_INTERFACE
  function handleAlarmFormChange(e) {
    const { name, value, type, checked } = e.target;
    setAlarmForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  // PUBLIC_INTERFACE
  function handleAlarmSubmit(e) {
    e.preventDefault();
    if (
      alarmForm.hour === "" ||
      alarmForm.minute === "" ||
      !alarmForm.zone ||
      isNaN(parseInt(alarmForm.hour)) ||
      isNaN(parseInt(alarmForm.minute))
    ) {
      setAlarmMessage("Please provide valid alarm time.");
      return;
    }
    setAlarms([
      ...alarms,
      {
        id: Date.now(),
        label: alarmForm.label,
        hour: parseInt(alarmForm.hour, 10),
        minute: parseInt(alarmForm.minute, 10),
        zone: alarmForm.zone,
        triggered: false,
        isReminder: alarmForm.isReminder
      }
    ]);
    setAlarmForm({
      label: "",
      zone: DateTime.local().zoneName,
      hour: "",
      minute: "",
      isReminder: false
    });
    setAlarmMessage("");
  }

  // PUBLIC_INTERFACE
  function removeAlarm(id) {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  }

  // PUBLIC_INTERFACE
  function handleConvertChange(e) {
    const { name, value } = e.target;
    setConvert(a => ({
      ...a,
      [name]: value
    }));
  }

  // PUBLIC_INTERFACE
  function handleConvertSubmit(e) {
    e.preventDefault();
    const [h, m] = convert.time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) {
      setConverted("Invalid time.");
      return;
    }
    const fromDt = DateTime.now()
      .setZone(convert.fromZone)
      .set({ hour: h, minute: m, second: 0, millisecond: 0 });
    const toDt = fromDt.setZone(convert.toZone);
    setConverted(
      `Time in ${convert.toZone}: ${toDt.toFormat("HH:mm")}`
    );
  }

  // Styling
  const styles = {
    page: {
      background: COLORS.primary,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem 0"
    },
    clockMain: {
      fontSize: "3.8rem",
      fontWeight: 700,
      padding: "0.4em 1.1em",
      background: COLORS.background,
      color: COLORS.secondary,
      borderRadius: "22px",
      letterSpacing: "0.07em",
      marginBottom: "0.7em"
    },
    clockDate: {
      fontSize: "1.2rem", color: COLORS.text, marginBottom: "2em"
    },
    worldClocksBox: {
      display: "flex", gap: "2.2em", marginBottom: "2.3em"
    },
    tzCard: {
      background: "#232b32",
      padding: "0.7em 2em",
      borderRadius: "14px",
      minWidth: "180px",
      textAlign: "center",
      color: COLORS.text,
      boxShadow: "0 1px 4px 0 #0003"
    },
    tzLabel: { color: COLORS.accent, fontSize: 17, fontWeight: 600 },
    tzTime: { fontSize: 27, color: COLORS.secondary, fontWeight: 600 },
    converterBox: {
      background: "#22282e",
      padding: "1.2em 2em",
      borderRadius: "13px",
      marginBottom: "2.2em",
      minWidth: 280
    },
    sectionTitle: {
      margin: "0 0 0.45em 0",
      fontSize: 18,
      color: COLORS.accent,
      textAlign: "left",
      fontWeight: 600,
      letterSpacing: "0.05em"
    },
    formInput: {
      padding: "0.47em",
      margin: "0 0.5em 1em 0",
      borderRadius: "7px",
      border: "1px solid #323942",
      fontSize: "1em",
      outline: "none",
      background: "#222930",
      color: COLORS.text
    },
    formButton: {
      padding: "0.6em 1.3em",
      borderRadius: "8px",
      border: "none",
      background: COLORS.secondary,
      color: "#fff",
      fontWeight: 500,
      cursor: "pointer",
      fontSize: "1em",
      marginRight: "1em"
    },
    alarmBox: {
      background: "#232a33",
      padding: "1.2em 2em",
      borderRadius: "13px",
      minWidth: 280
    },
    alarmList: {
      margin: "1em 0 0 0",
      listStyle: "none", padding: 0
    },
    alarmItem: {
      color: COLORS.secondary,
      fontSize: 16,
      padding: "0.22em 0",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    },
    alarmRemoveBtn: {
      background: COLORS.primary, border: "none", color: COLORS.accent,
      borderRadius: 6, fontSize: 18, cursor: "pointer", marginLeft: 10
    },
    alarmMsg: {
      color: COLORS.accent, margin: "9px 0", fontWeight: 600, minHeight: 26
    },
    hr: { border: 0, height: 1, background: "#333945", margin: "2.1em 0" }
  };

  return (
    <div style={styles.page}>
      {/* Main digital clock */}
      <div style={styles.clockMain} data-testid="main-digital-clock">
        {now.toFormat("HH:mm:ss")}
      </div>
      <div style={styles.clockDate}>
        {now.toFormat("cccc, LLLL dd, yyyy")}
      </div>

      {/* World clocks */}
      <div style={styles.worldClocksBox}>
        {TIMEZONES.map((tz) => (
          <div style={styles.tzCard} key={tz.value}>
            <div style={styles.tzLabel}>{tz.label}</div>
            <div style={styles.tzTime}>
              {DateTime.now().setZone(tz.value).toFormat("HH:mm:ss")}
            </div>
            <div style={{ fontSize: 13, color: "#a9bad7" }}>
              {DateTime.now().setZone(tz.value).toFormat("cccc")}
            </div>
            <div style={{ fontSize: 10, color: "#82a4c1" }}>{tz.value}</div>
          </div>
        ))}
      </div>

      {/* Time zone converter */}
      <div style={styles.converterBox}>
        <div style={styles.sectionTitle}>Time Zone Converter</div>
        <form
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          onSubmit={handleConvertSubmit}
        >
          <input
            type="time"
            required
            name="time"
            value={convert.time}
            onChange={handleConvertChange}
            style={styles.formInput}
          />
          <select
            name="fromZone"
            value={convert.fromZone}
            onChange={handleConvertChange}
            style={styles.formInput}
          >
            {TIMEZONES.map((tz) => (
              <option value={tz.value} key={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <span style={{ margin: "0 6px", color: COLORS.text }}>→</span>
          <select
            name="toZone"
            value={convert.toZone}
            onChange={handleConvertChange}
            style={styles.formInput}
          >
            {TIMEZONES.map((tz) => (
              <option value={tz.value} key={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.formButton}>
            Convert
          </button>
        </form>
        {converted && (
          <div style={{ color: COLORS.accent, fontSize: 17, marginTop: 6 }}>
            {converted}
          </div>
        )}
      </div>

      <hr style={styles.hr} />

      {/* Alarm & Reminder setting */}
      <div style={styles.alarmBox}>
        <div style={styles.sectionTitle}>Set Alarm / Reminder</div>
        <form
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          onSubmit={handleAlarmSubmit}
        >
          <input
            name="label"
            placeholder="Label"
            onChange={handleAlarmFormChange}
            value={alarmForm.label}
            style={styles.formInput}
          />
          <input
            type="number"
            name="hour"
            placeholder="HH"
            min={0}
            max={23}
            value={alarmForm.hour}
            onChange={handleAlarmFormChange}
            style={{ ...styles.formInput, width: 70 }}
            required
          />
          <span>:</span>
          <input
            type="number"
            name="minute"
            placeholder="MM"
            min={0}
            max={59}
            value={alarmForm.minute}
            onChange={handleAlarmFormChange}
            style={{ ...styles.formInput, width: 70 }}
            required
          />
          <select
            name="zone"
            value={alarmForm.zone}
            onChange={handleAlarmFormChange}
            style={styles.formInput}
          >
            {TIMEZONES.map((tz) => (
              <option value={tz.value} key={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <label style={{ color: "#99a" }}>
            <input
              type="checkbox"
              name="isReminder"
              checked={alarmForm.isReminder}
              onChange={handleAlarmFormChange}
              style={{ margin: "0 6px" }}
            />
            Reminder
          </label>
          <button type="submit" style={styles.formButton}>
            Add
          </button>
        </form>
        <div style={styles.alarmMsg}>{alarmMessage}</div>
        <ul style={styles.alarmList}>
          {alarms.map((alarm) => (
            <li style={styles.alarmItem} key={alarm.id}>
              <span>
                [{TIMEZONES.find(tz => tz.value === alarm.zone)?.label || alarm.zone}]{" "}
                {alarm.hour.toString().padStart(2, "0")}:
                {alarm.minute.toString().padStart(2, "0")}{" "}
                {alarm.label ? `— ${alarm.label}` : ""}
                {alarm.isReminder ? " (Reminder)" : ""}
                {alarm.triggered && (
                  <span style={{ color: "#e74c3c", marginLeft: 8 }}>
                    ● Triggered
                  </span>
                )}
              </span>
              <button
                style={styles.alarmRemoveBtn}
                onClick={() => removeAlarm(alarm.id)}
                aria-label="Delete alarm"
                type="button"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GlobalTimeTracker;
