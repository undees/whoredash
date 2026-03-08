import { LitElement, html, css } from 'lit';

export class AddItem extends LitElement {
  static properties = {
    _value: { type: String, state: true },
  };

  static styles = css`
    :host {
      display: block;
      flex: 1;
    }

    form {
      display: flex;
      gap: 0;
    }

    input {
      flex: 1;
      min-width: 0;
      padding: 0.6rem 0.75rem;
      border: 2px solid var(--pink-200);
      border-right: none;
      border-radius: var(--radius) 0 0 var(--radius);
      font: inherit;
      font-size: 1rem;
      color: var(--text);
      background: var(--white);
      outline: none;
      transition: border-color 0.15s;
    }

    input::placeholder {
      color: var(--text-muted);
    }

    input:focus {
      border-color: var(--pink-400);
    }

    button {
      flex: none;
      padding: 0.6rem 1rem;
      background: var(--pink-500);
      color: var(--white);
      border: 2px solid var(--pink-500);
      border-radius: 0 var(--radius) var(--radius) 0;
      font: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }

    button:hover {
      background: var(--pink-600);
      border-color: var(--pink-600);
    }
  `;

  constructor() {
    super();
    this._value = '';
  }

  _onInput(e) {
    this._value = e.target.value;
  }

  _submit(e) {
    e.preventDefault();
    const name = this._value.trim();
    if (!name) return;
    this.dispatchEvent(new CustomEvent('add-item', {
      detail: { name },
      bubbles: true,
      composed: true,
    }));
    this._value = '';
  }

  render() {
    return html`
      <form @submit=${this._submit}>
        <input
          type="text"
          placeholder="Add something…"
          .value=${this._value}
          @input=${this._onInput}
        >
        <button type="submit">Add</button>
      </form>
    `;
  }
}

customElements.define('add-item', AddItem);
