import {createElement} from '../render';

const createOfferTemplate = (offers) =>

  offers.map(({id, title, price}) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');

export const createOfferContainerTemplate = (offers) =>
  `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${createOfferTemplate(offers)}
          </section>`;

export class OfferView {
  #element = null;

  constructor(offers){
    this.offers = offers;
  }

  get template() {
    return createOfferContainerTemplate(this.offers);
  }

  get element() {
    if (!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

