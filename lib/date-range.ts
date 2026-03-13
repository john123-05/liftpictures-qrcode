type DayParts = {
  year: number;
  month: number;
  day: number;
};

function readDayParts(date: Date, timeZone: string): DayParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const readPart = (type: "year" | "month" | "day") => {
    const value = parts.find((part) => part.type === type)?.value;
    return Number.parseInt(value ?? "", 10);
  };

  return {
    year: readPart("year"),
    month: readPart("month"),
    day: readPart("day"),
  };
}

function addDays(parts: DayParts, amount: number): DayParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function parseTimeZoneOffsetMinutes(value: string) {
  const match = value.match(/(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?/i);

  if (!match) {
    return 0;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number.parseInt(match[2] ?? "0", 10);
  const minutes = Number.parseInt(match[3] ?? "0", 10);

  return sign * (hours * 60 + minutes);
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const value = formatter.formatToParts(date).find((part) => part.type === "timeZoneName")?.value;

  return parseTimeZoneOffsetMinutes(value ?? "UTC");
}

function toUtcIso(parts: DayParts, timeZone: string) {
  const approximateUtc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0));
  const offsetMinutes = getTimeZoneOffsetMinutes(approximateUtc, timeZone);

  return new Date(approximateUtc.getTime() - offsetMinutes * 60_000).toISOString();
}

export function getTodayRangeForTimeZone(timeZone: string, referenceDate = new Date()) {
  const today = readDayParts(referenceDate, timeZone);
  const tomorrow = addDays(today, 1);

  return {
    startIso: toUtcIso(today, timeZone),
    endIso: toUtcIso(tomorrow, timeZone),
  };
}
