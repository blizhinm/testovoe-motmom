import API from '../../api/events';
import EventEmitter from '../../event-emitter';

import AddEventForm from './AddEventForm';
import EventItemsList from './EventItemsList';

const eventsPanelTemplate = require('../../templates/eventsPanel.handlebars');

export default class EventsPanel extends EventEmitter {
  constructor() {
    super();

    this.state = { list: true, inTransition: false, addForm: false };

    this.html = eventsPanelTemplate();

    $('.events-panel').html(this.html); // Render

    this.$layout = $('.events-panel');
    this.$addNewButton = this.$layout.find('.events-panel__add-new-button');
    this.$eventItemsList = this.$layout.find('.events-panel__events-form');
    this.$addEventForm = this.$layout.find('.events-panel__add-event-form');

    this.addEventForm = new AddEventForm();
    this.eventItemsList = new EventItemsList();

    this.initListeners();

    API.events.logEvents();
  }

  isActiveEventsExists() {
    return !!this.eventItemsList.activeElements.length;
  }

  changeStateTo(state) {
    this.state.list = false;
    this.state.addForm = false;
    this.state[state] = true;

    const animationOffset = (this.state.addForm
      ? this.$addEventForm.offset().left
      : this.$eventItemsList.offset().left) - this.$layout.offset().left;

    this.startTransition(
      this.$eventItemsList,
      this.$addEventForm,
      animationOffset,
    );

    this.state.inTransition = true;
  }

  getActiveEvents() {
    return this.eventItemsList.activeElements;
  }

  changeEventsTime(time) {
    const ids = this.eventItemsList.activeElements.map(el => el.eventInfo.id);
    API.events.updateEvents(ids, time).then(() => {
      this.eventItemsList.reRenderItems();
    });
  }

  selectEvents(time) {
    this.eventItemsList.selectItems(time);
  }

  // Change between EventsList and AddEventForm
  startTransition(el1, el2, val) {
    if (this.state.inTransition) {
      return;
    }

    $(el2).animate({ left: `-=${val}px` });
    $(el1).animate({ left: `-=${val}px` }, () => {
      this.state.inTransition = false;
    });
  }

  // Initialize Listeners
  initListeners() {
    // AddEventForm
    this.addEventForm.addListener('newEventSubmit', (event) => {
      API.events.addEvent(event).then(() => {
        this.eventItemsList.reRenderItems();
        this.changeStateTo('list');
      });
    });

    this.addEventForm.addListener('cancelButtonClick', () => {
      this.changeStateTo('list');
    });

    // EventItemsList
    this.eventItemsList.addListener('deleteEvent', (event) => {
      API.events.deleteEvent(event).then(() => {
        this.eventItemsList.reRenderItems();
        this.emit('eventItemSelected', this.getActiveEvents());
      });
    });

    this.eventItemsList.addListener('eventItemSelected', (activeEvents) => {
      this.emit('eventItemSelected', activeEvents);
    });

    // EventsPanel buttons
    this.$addNewButton.on('click', () => {
      this.changeStateTo('addForm');
    });
  }
}
