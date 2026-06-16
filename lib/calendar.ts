export function generateGoogleCalendarLink(params: {
  title: string
  startDateUTC: string
  endDateUTC: string
  details: string
  location: string
}): string {
  const { title, startDateUTC, endDateUTC, details, location } = params
  const fmt = (d: string) =>
    d.replace(/[-:]/g, "").replace(/\.\d{3}/, "").replace("Z", "Z")
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(startDateUTC)}/${fmt(endDateUTC)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`
}

export function generateICSFile(params: {
  title: string
  startDateUTC: string
  endDateUTC: string
  details: string
  location: string
}): string {
  const { title, startDateUTC, endDateUTC, details, location } = params
  const fmt = (d: string) =>
    d.replace(/[-:]/g, "").replace(/\.\d{3}/, "").replace("Z", "Z")

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AfriTracker//CdM2026//FR",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(startDateUTC)}`,
    `DTEND:${fmt(endDateUTC)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
