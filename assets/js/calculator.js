/**
 * DJ John - Interactive Event Customizer & WhatsApp Booking Request Generator
 * Prepares clean, mobile-tested booking inquiries directly for DJ John's WhatsApp.
 */

(function () {
  'use strict';

  /**
   * Updates slider display values in the form
   */
  function updateSliderDisplays() {
    const hoursInput = document.getElementById('hoursInput');
    const guestsInput = document.getElementById('guestsInput');

    const hours = hoursInput ? hoursInput.value : '4';
    const guests = guestsInput ? guestsInput.value : '150';

    const hoursDisp = document.getElementById('hoursDisplay');
    if (hoursDisp) hoursDisp.textContent = `${hours} Hours`;

    const guestsDisp = document.getElementById('guestsDisplay');
    if (guestsDisp) guestsDisp.textContent = `${guests} Guests`;
  }

  /**
   * Prefills the event customizer from the Services cards and scrolls smoothly
   */
  function prefillBooking(serviceName) {
    const selector = `input[name="eventType"][value*="${serviceName.split(' ')[0]}"]`;
    const radio = document.querySelector(selector);
    if (radio) {
      radio.checked = true;
    }
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Generates a 100% clean, error-free WhatsApp inquiry message
   */
  function sendQuoteWhatsApp() {
    const eventTypeEl = document.querySelector('input[name="eventType"]:checked');
    const eventType = eventTypeEl ? eventTypeEl.value : 'Wedding Reception';

    const hours = document.getElementById('hoursInput') ? document.getElementById('hoursInput').value : '4';
    const guests = document.getElementById('guestsInput') ? document.getElementById('guestsInput').value : '150';

    const clientNameInput = document.getElementById('clientName');
    const clientName = (clientNameInput && clientNameInput.value.trim()) || 'Not specified';

    const eventDateInput = document.getElementById('eventDate');
    const eventDate = (eventDateInput && eventDateInput.value) || 'To be finalized';

    const eventCityInput = document.getElementById('eventCity');
    const eventCity = (eventCityInput && eventCityInput.value.trim()) || 'Local Area';

    const clientPhoneInput = document.getElementById('clientPhone');
    const clientPhone = (clientPhoneInput && clientPhoneInput.value.trim()) || 'Not specified';

    // Equipment checkboxes
    const addSound = document.getElementById('addSound') ? document.getElementById('addSound').checked : true;
    const addLights = document.getElementById('addLights') ? document.getElementById('addLights').checked : true;
    const addSmoke = document.getElementById('addSmoke') ? document.getElementById('addSmoke').checked : false;
    const addMics = document.getElementById('addMics') ? document.getElementById('addMics').checked : true;

    const gearList = [];
    if (addSound) gearList.push('Full Sound System');
    if (addLights) gearList.push('Club Moving Lights');
    if (addSmoke) gearList.push('Haze & Smoke FX');
    if (addMics) gearList.push('Dual Cordless Mics');
    const gear = gearList.length > 0 ? gearList.join(' + ') : 'DJ Console Only';

    // Build plain-text message with clean formatting for WhatsApp
    const messageLines = [
      `*DJ JOHN | LIVE & LOCAL*`,
      `*EVENT BOOKING INQUIRY*`,
      `---------------------------------------`,
      `*Name:* ${clientName}`,
      `*Contact:* ${clientPhone}`,
      `*Occasion:* ${eventType}`,
      `*Date:* ${eventDate}`,
      `*Venue/City:* ${eventCity}`,
      `*Duration:* ${hours} Hours`,
      `*Crowd Size:* ${guests} Guests`,
      `*Equipment Needed:* ${gear}`,
      `---------------------------------------`,
      `Hi DJ John, please let me know your availability and package details for this event!`
    ];

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/917358830098?text=${encodeURIComponent(fullMessage)}`;

    window.open(waUrl, '_blank');
  }

  // Global bindings
  window.calculateEstimate = updateSliderDisplays;
  window.updateSliderDisplays = updateSliderDisplays;
  window.updateEventSummary = updateSliderDisplays;
  window.prefillBooking = prefillBooking;
  window.sendQuoteWhatsApp = sendQuoteWhatsApp;

  document.addEventListener('DOMContentLoaded', () => {
    updateSliderDisplays();
  });
})();
