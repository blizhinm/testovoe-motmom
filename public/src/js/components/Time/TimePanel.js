import EventEmitter from '../../event-emitter';

import TimeOptions from './TimeOptions';
import TimeItemsList from './TimeItemsList';

const timePanelTemplate = require('../../templates/timePanel.handlebars');

export default class TimePanel extends EventEmitter {
  constructor() {
    super();

    this.timeOptions = new TimeOptions();
    this.timeItemsList = new TimeItemsList(this.timeOptions.timeVariables);

    this.initListeners();

    this.html = timePanelTemplate();
  }

  setActiveEvents(selection) {
    this.timeItemsList.activeSelection = selection;
  }

  timeHighlight(highlightInfo) {
    this.timeItemsList.timeHighlight(highlightInfo);
  }

  initListeners() {
    this.timeOptions.addListener('timeSliderChange', (data) => {
      this.timeItemsList.reRenderItems(data);
    });

    // ////////////
    this.timeItemsList.addListener('timeSelected', (time) => {
      this.emit('timeSelected', time);
    }); // ///////////

    this.timeItemsList.addListener('eventsTimeChange', (time) => {
      this.emit('eventsTimeChange', time);
    });
    this.timeItemsList.addListener('eventsSelectionRequest', (time) => {
      this.emit('eventsSelectionRequest', time);
    });
    this.timeItemsList.addListener('eventsActiveSelectionRequest', () => {
      this.emit('eventsActiveSelectionRequest');
    });
  }

  render() {
    $('.time-panel').html(this.html);
    this.timeItemsList.render();
    this.timeOptions.render();
  }
}
