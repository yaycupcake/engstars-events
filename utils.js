export function addDays(date, days) {
  const newDate = moment(date).add(days, 'days')
  return newDate
}

export function addHours(date, hours) {
  const newDate = moment(date).add(hours, 'hours')
  return newDate
}

export function calcStartDate(dateText, timezone = 'UTC') {
  const startDate = moment(`${dateText} ${timezone}`)
  return startDate
}

export function calcEndDate(dateText, duration = [8, 10], timezone = 'UTC') {
  let startDate
  if (typeof dateText === 'string') {
    startDate = calcStartDate(dateText, timezone)
  } else {
    startDate = dateText
  }
  const adjustedDate = addDays(startDate, duration[0])
  const adjustedTime = addHours(adjustedDate, duration[1])
  return adjustedTime
}

export function calcNewEventDates(seedDate, newEvents) {
  let prevDate = seedDate
  for (const event in newEvents) {
    newEvents[event].startDate = prevDate
    newEvents[event].endDate = calcEndDate(newEvents[event].startDate)
    prevDate = addDays(prevDate, 14)
  }
}
