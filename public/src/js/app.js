import EventsPanel from './components/Events/EventsPanel';
import TimePanel from './components/Time/TimePanel';

class App {
  constructor() {
    this.eventsPanel = null;
    this.timePanel = null;
  }

  init() {
    this.eventsPanel = new EventsPanel();
    this.timePanel = new TimePanel();

    this.timePanel.render();

    this.initListeners();
  }

  initListeners() {
    this.eventsPanel.addListener('eventItemSelected', (activeEvents) => {
      const time = activeEvents.length ? activeEvents[0].eventInfo.time : null;
      let isTimeEqual = true;

      for (let i = 1; i < activeEvents.length; i += 1) {
        if (activeEvents[i].eventInfo.time !== time) {
          isTimeEqual = false;
          break;
        }
      }

      if (activeEvents.length && isTimeEqual) {
        this.timePanel.timeHighlight({ time, highlight: true });
      } else {
        this.timePanel.timeHighlight({ time, highlight: false });
      }
    });

    this.timePanel.addListener('timeSelected', (time) => {
      const activeEvents = this.eventsPanel.getActiveEvents();

      if (activeEvents.length) {
        this.eventsPanel.changeEventsTime(time);
      } else {
        this.eventsPanel.selectEvents(time);
      }
    });
  }
}

const app = new App();
app.init();
