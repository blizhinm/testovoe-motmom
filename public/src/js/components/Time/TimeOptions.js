import EventEmitter from '../../event-emitter';

const timeOptionsTemplate = require('../../templates/timeOptions.handlebars');

const CONTROLS_KEY_WORDS = ['start', 'end', 'period'];

function formatHours(hours) {
  return hours > 9 ? `${hours}:00` : `0${hours}:00`;
}

export default class TimeOptions extends EventEmitter {
  constructor() {
    super();

    this.$sliders = {};

    this.$titleValues = {};

    this.timeVariables = {
      start: '08:00',
      end: '16:00',
      period: 30,
    };

    this.html = timeOptionsTemplate({
      start: this.timeVariables.start.split(':')[0],
      end: this.timeVariables.end.split(':')[0],
      period: this.timeVariables.period,
    });

    this.$layout = $('.time-panel__options');

    this.$layout.append(this.html); // Render

    this.initControls();
  }

  initControls() {
    CONTROLS_KEY_WORDS.forEach((word) => {
      this.$sliders[word] = this.$layout.find(`#time-slider__${word}`);
      this.$titleValues[word] = this.$layout.find(`.time-options__title-value_${word}`);
    });

    this.initListeners();
  }

  initListeners() {
    // Start
    this.$sliders.start.on('input', (e) => {
      const time = formatHours(e.target.value);
      this.$titleValues.start.html(time);
    });
    this.$sliders.start.on('change', (e) => {
      const time = formatHours(e.target.value);
      this.timeVariables.start = time;
      this.emit('timeSliderChange', this.timeVariables);
    });

    // End
    this.$sliders.end.on('input', (e) => {
      const time = formatHours(e.target.value);
      this.$titleValues.end.html(time);
    });
    this.$sliders.end.on('change', (e) => {
      const time = formatHours(e.target.value);
      this.timeVariables.end = time;
      this.emit('timeSliderChange', this.timeVariables);
    });

    // Period
    this.$sliders.period.on('input', (e) => {
      this.$titleValues.period.html(e.target.value);
    });
    this.$sliders.period.on('change', (e) => {
      this.timeVariables.period = parseInt(e.target.value, 10);
      this.emit('timeSliderChange', this.timeVariables);
    });
  }
}
