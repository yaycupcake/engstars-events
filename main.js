import dataAdder from './dataAdder.js'
import { calcStartDate, calcEndDate, calcNewEventDates } from './utils.js'
import { getNewEventList } from './newEventList.js'

const timezone = 'UTC'

moment.tz.setDefault(timezone)

const oldEvents = new Object()

oldEvents.bigBang = new Object({ id: 1 })
oldEvents.aToZ = new Object({ id: 2 })
oldEvents.motorShow = new Object({ id: 3 })

oldEvents.bigBang.startDateString = '2022/06/23 17:00'
oldEvents.aToZ.startDateString = '2022/07/08 17:00'
oldEvents.motorShow.startDateString = '2022/07/23 17:00'

for (const event in oldEvents) {
  oldEvents[event].startDate = calcStartDate(oldEvents[event].startDateString)
  oldEvents[event].endDate = calcEndDate(oldEvents[event].startDateString)
  delete oldEvents[event].startDateString
}

const newEvents = new Object()

const newEventList = getNewEventList()

newEventList.forEach((event, index) => {
  newEvents[event] = new Object({
    id: index + Object.keys(oldEvents).length + 1,
  })
})

const seedDate = moment(Date.UTC(2022, 7, 6, 17, 0, 0)) // 7 = August because 0-indexing

calcNewEventDates(seedDate, newEvents)

const events = { ...oldEvents, ...newEvents }

dataAdder(events)

// console.log(events)

// * DOM manip starts below

const d = document // because I can't be bothered to write out `document` don't hurt me

const body = d.body

const dateFormat = 'MMM DD (ddd) hA yyyy'
const locale = 'America/New_York'

const localeDisplay = d.createElement('h2')
localeDisplay.classList.add('locale')
localeDisplay.textContent = `Locale: ${locale}`
body.appendChild(localeDisplay)
const eventsContainer = d.createElement('section')
eventsContainer.classList.add('eventsContainer')
body.appendChild(eventsContainer)

for (const event in events) {
  const eventContainerParent = eventsContainer

  const eventContainer = d.createElement('div')
  eventContainer.classList.add('eventContainer', `eventContainer__${event}`)

  const eventNameDisplay = d.createElement('h3')
  eventNameDisplay.classList.add('eventName')
  eventNameDisplay.textContent = events[event].nameEN
    ? events[event].nameEN
    : events[event].nameJP
  eventContainer.appendChild(eventNameDisplay)

  const eventBannerDisplay = d.createElement('img')
  eventBannerDisplay.setAttribute('src', events[event].imgPath)
  eventContainer.appendChild(eventBannerDisplay)

  const startDateDisplay = d.createElement('span')
  startDateDisplay.classList.add('startDate')
  startDateDisplay.textContent = `Start: ${moment
    .tz(events[event].startDate, locale)
    .format(dateFormat)}`
  eventContainer.appendChild(startDateDisplay)

  const endDateDisplay = d.createElement('span')
  endDateDisplay.classList.add('endDate')
  endDateDisplay.textContent = `End: ${moment
    .tz(events[event].endDate, locale)
    .format(dateFormat)}`
  eventContainer.appendChild(endDateDisplay)

  eventContainerParent.appendChild(eventContainer)
}
