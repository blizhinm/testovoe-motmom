import API from '../../api/events';
import EventEmitter from '../../event-emitter';

import AddEventForm from './AddEventForm';
import EventItemsList from './EventItemsList';

const eventsPanelTemplate = require('../../templates/eventsPanel.handlebars');

export default class EventsPanel extends EventEmitter {
  constructor() {
    super();

    this.addEventForm = new AddEventForm();

    this.eventItemsList = new EventItemsList();

    this.state = { list: true, inTransision: false, addForm: false };

    this.html = eventsPanelTemplate();

    this.render();

    this.$addNewButton = $('.events-panel__add-new-button');
    this.$eventItemsList = $('.events-panel__events-form');
    this.$addEventForm = $('.events-panel__add-event-form');

    this.initListeners();

    API.events.logEvents();
  }

  changeStateTo(state) {
    this.state.list = false;
    this.state.addForm = false;
    this.state[state] = true;

    if (this.state.addForm) {
      this.startTransition(this.$eventItemsList, this.$addEventForm, this.$addEventForm.offset().left - $('.events-panel').offset().left);
    } else if (this.state.list) {
      this.startTransition(this.$eventItemsList, this.$addEventForm, this.$eventItemsList.offset().left - $('.events-panel').offset().left);
    }
    this.state.inTransision = true;
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
    if (!this.state.inTransision) {
      $(el2).animate({ left: `-=${val}px` });
      $(el1).animate({ left: `-=${val}px` }, () => {
        this.state.inTransision = false;
      });
    }
  }

  // Initialize Listeners
  initListeners() {
    // AddEventForm
    this.addEventForm.addListener('newEventSubmit', (event) => {
      API.events.addEvent(event).then(() => {
        this.eventItemsList.reRenderItems();
      });
      this.changeStateTo('list');
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
    $(this.$addNewButton).on('click', () => {
      this.changeStateTo('addForm');
    });
  }

  // Render
  render() {
    $('.events-panel').html(this.html);

    this.addEventForm.render();
    this.eventItemsList.render();
  }
}
