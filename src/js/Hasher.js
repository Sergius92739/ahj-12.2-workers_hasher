import Worker from './web.worker';

export default class Hasher {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement')
    }
    this.container = container;
    this.file = null;

    this.onChange = this.onChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSelectedClick = this.onSelectedClick.bind(this);
    this.onListClick = this.onListClick.bind(this);
  }

  init() {
    this.container.innerHTML = Hasher.markUp;
    this.fileInput = this.container.querySelector('[data-id="file_input"]');
    this.listOfAlgorithms = this.container.querySelector('[data-id="algorithms"]');
    this.selectedAlgorithm = this.container.querySelector('[data-id="selected"]');
    this.hashValue = this.container.querySelector('[data-id="hash_value"]');
    this.label = this.container.querySelector('[data-id="label"]');
    this.selectedAlgorithm.textContent = this.listOfAlgorithms
      .querySelector('.block__menu-item.checked').textContent;

    this.fileInput.addEventListener('change', this.onChange);
    this.label.addEventListener('dragover', (evt) => evt.preventDefault());
    this.label.addEventListener('drop', this.onDrop);
    this.selectedAlgorithm.addEventListener('click', this.onSelectedClick)
    this.listOfAlgorithms.addEventListener('click', this.onListClick)
  }

  onSelectedClick() {
    this.listOfAlgorithms.classList.remove('d_none');
  }

  onListClick(evt) {
    if (evt.target.dataset.name === 'crypto') {
      [...this.listOfAlgorithms.children].forEach((elem) => {
        elem.classList.remove('checked');
      })
      evt.target.classList.add('checked');
      const value = evt.target.textContent;
      this.selectedAlgorithm.textContent = value;
      this.listOfAlgorithms.classList.add('d_none');
      if (this.file && this.hashValue.textContent) {
        this.getWorker();
      }
    }
  }

  getCryptoID() {
    return this.listOfAlgorithms
      .querySelector('.block__menu-item.checked').dataset.id;
  }

  onChange(evt) {
    [this.file] = Array.from(evt.currentTarget.files);
    this.getWorker();
    this.fileInput.value = '';
  }

  onDrop(evt) {
    evt.preventDefault();
    [this.file] = Array.from(evt.dataTransfer.files);
    this.getWorker();
  }

  getWorker() {
    const worker = new Worker();
    worker.addEventListener('message', ({ data: hash }) => {
      this.hashValue.textContent = hash;
      worker.terminate();
    });
    worker.postMessage({
      file: this.file,
      cryptoID: this.getCryptoID(),
    });
  }

  static get markUp() {
    return `<div class="container">
    <div class="block">
      <div class="block__wrapper">
        <h3 class="block__title">Hasher</h3>
        <form action="" class="block__form">
          <label class="block__form-label" data-id="label" for="input">
            Drop files here<br>or<br>Click to select
          </label>
          <input class="block__form-input visually_hidden" id="input" type="file" data-id="file_input">
        </form>
        <div class="block__menu">
          <label class="block__menu-title">
            Hash Algorithm:
            <span class="menu-title__value" data-id="selected"></span>
          </label>
          <ul class="block__menu-list d_none" data-id="algorithms">
            <li class="block__menu-item checked" data-name="crypto" data-id="md5">MD5</li>
            <li class="block__menu-item" data-name="crypto" data-id="sha1">SHA1</li>
            <li class="block__menu-item" data-name="crypto" data-id="sha256">SHA256</li>
            <li class="block__menu-item" data-name="crypto" data-id="sha512">SHA512</li>
          </ul>
        </div>
      </div>
      <div class="block__hash">
        <label>
          Calculated Hash:
          <div class="block__hash-value" data-id="hash_value"></div>
        </label>
      </div>
    </div>
  </div>`;
  }
}