import { LitElement, html, css } from 'lit';

export class GroceryList extends LitElement {
  static properties = {
    items: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
    }

    ul {
      list-style: none;
      margin: 1rem 0 0;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.75rem;
      background: var(--white);
      border: 1px solid var(--pink-200);
      border-radius: var(--radius);
      margin-bottom: 0.5rem;
      box-shadow: var(--shadow);
      font-size: 1rem;
    }

    .item-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .remove-btn {
      flex: none;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pink-100);
      color: var(--pink-600);
      border: none;
      border-radius: 50%;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
      margin-left: 0.5rem;
      transition: background 0.15s, color 0.15s;
    }

    .remove-btn:hover {
      background: var(--pink-400);
      color: var(--white);
    }
  `;

  constructor() {
    super();
    this.items = [];
  }

  _remove(index) {
    this.dispatchEvent(new CustomEvent('remove-item', {
      detail: { index },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <ul>
        ${this.items.map((item, i) => html`
          <li>
            <span class="item-name">${item}</span>
            <button class="remove-btn" @click=${() => this._remove(i)} aria-label="Remove ${item}">&times;</button>
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('grocery-list', GroceryList);
