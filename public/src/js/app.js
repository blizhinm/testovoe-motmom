import EventsPanel from './components/Events/EventsPanel';
import TimePanel from './components/Time/TimePanel';


function isEventsWithEqualTime(events) {
  if (!events.length) {
    return false;
  }

  return events.every(({ eventInfo }) => eventInfo.time === events[0].eventInfo.time);
}

class App {
  constructor() {
    this.eventsPanel = new EventsPanel();
    this.timePanel = new TimePanel();

    this.initListeners();
  }

  initListeners() {
    this.eventsPanel.addListener('eventItemSelected', (activeEvents) => {
      const time = activeEvents.length && activeEvents[0].eventInfo.time;

      this.timePanel.timeHighlight({
        time,
        highlight: isEventsWithEqualTime(activeEvents),
      });
    });

    this.timePanel.addListener('timeSelected', (time) => {
      if (this.eventsPanel.isActiveEventsExists()) {
        this.eventsPanel.changeEventsTime(time);
      } else {
        this.eventsPanel.selectEvents(time);
      }
    });
  }
}

const app = new App();
