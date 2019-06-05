import EventEmitter from '../../event-emitter';

import TimeOptions from './TimeOptions';
import TimeItemsList from './TimeItemsList';

const timePanelTemplate = require('../../templates/timePanel.handlebars');

export default class TimePanel extends EventEmitter {
  constructor() {
    super();

    this.html = timePanelTemplate();

    // Render
    $('.time-panel').html(this.html);

    this.timeOptions = new TimeOptions();
    this.timeItemsList = new TimeItemsList(this.timeOptions.timeVariables);

    this.initListeners();
  }

  timeHighlight(highlightInfo) {
    this.timeItemsList.timeHighlight(highlightInfo);
  }

  initListeners() {
    this.timeOptions.addListener('timeSliderChange', (data) => {
      this.timeItemsList.reRenderItems(data);
    });

    this.timeItemsList.addListener('timeSelected', (time) => {
      this.emit('timeSelected', time);
    });
  }
}
