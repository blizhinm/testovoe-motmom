import EventEmitter from '../../event-emitter';

const timeOptionsTemplate = require('../../templates/timeOptions.handlebars');

export default class TimeOptions extends EventEmitter {
  constructor() {
    super();

    // this.$sliderStart = undefined;
    // this.$sliderEnd = undefined;
    // this.$sliderPeriod = undefined;

    this.$sliders = {};

    this.$titleValues = {};

    this.timeVariables = { start: '08:00', end: '16:00', period: 30 };

    this.html = timeOptionsTemplate({ start: this.timeVariables.start.split(':')[0], end: this.timeVariables.end.split(':')[0], period: this.timeVariables.period });
  }

  initControls() {
    // this.$sliderStart = $('.time-options__title-value_start');
    // this.$sliderEnd = $('.time-options__title-value_end');
    // this.$sliderPeriod = $('.time-options__title-value_period');

    const controlsKeyWords = ['start', 'end', 'period'];
    controlsKeyWords.forEach((word) => {
      this.$sliders[word] = $(`#time-slider__${word}`);
      this.$titleValues[word] = $(`.time-options__title-value_${word}`);
    });

    this.initListeners();
  }

  initListeners() {
    // Start
    this.$sliders.start.on('input', (e) => {
      const time = e.target.value > 9 ? `${e.target.value}:00` : `0${e.target.value}:00`;
      this.$titleValues.start.html(time);
    });
    this.$sliders.start.on('change', (e) => {
      const time = e.target.value > 9 ? `${e.target.value}:00` : `0${e.target.value}:00`;
      this.timeVariables.start = time;
      this.emit('timeSliderChange', this.timeVariables);
    });

    // End
    this.$sliders.end.on('input', (e) => {
      const time = e.target.value > 9 ? `${e.target.value}:00` : `0${e.target.value}:00`;
      this.$titleValues.end.html(time);
    });
    this.$sliders.end.on('change', (e) => {
      const time = e.target.value > 9 ? `${e.target.value}:00` : `0${e.target.value}:00`;
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

  render() {
    $('.time-panel__options').append(this.html);

    this.initControls();
  }
}
