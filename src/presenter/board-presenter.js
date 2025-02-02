import {render} from '../render';
import {PointView} from '../view/point-view';
import {EditPointView} from '../view/edit-point-view';
import {EmptyListView} from '../view/empty-list-view';
import {SortView} from '../view/sort-view';
import {DestinationView} from '../view/destination-view';
import {PointContainerView} from '../view/point-container-view';
import {OfferView} from '../view/offer-view';
const siteMainElement = document.querySelector('.trip-events');

export class BoardPresenter {
  #renderContainer = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #pointContainerView = new PointContainerView();

  constructor({renderContainer, pointModel, offerModel, destinationModel}) {
    this.#renderContainer = renderContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    const points = Array.from(this.#pointModel.getPoint());

    if (points.length === 0) {
      render(new EmptyListView(),this.#renderContainer);
      return;
    }
    render(new SortView(), siteMainElement);

    for(const point of points) {
      const offerIds = point.offers;
      point.offers = this.#offerModel.getOfferById(offerIds);
      this.#renderPoint(point);

    }
  }

  #renderPoint(point) {
    const pointComponent = new PointView({point});
    const pointEditFormComponent = new EditPointView({point});
    const offers = point.offers;
    const destination = this.#destinationModel.getDestinationById(point.destination);
    point.destination = destination;

    render(this.#pointContainerView, this.#renderContainer);
    render(new OfferView(offers), pointEditFormComponent.element);
    render(new DestinationView({destination}), pointEditFormComponent.element);

    const showEditForm = () => {
      pointComponent.element.append(pointEditFormComponent.element);
    };

    const closeEditForm = () => {
      pointEditFormComponent.element.remove();
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeEditForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const closeOpenForm = () => {
      const openForms = document.querySelectorAll('.event--edit');
      if (openForms) {
        for (const form of openForms) {
          form.remove();
        }
      }
    };


    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      closeOpenForm();
      showEditForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      closeEditForm();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditFormComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      closeEditForm();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#pointContainerView.element);
  }
}
