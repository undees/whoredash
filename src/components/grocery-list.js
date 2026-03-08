import { LitElement, html, css } from 'lit';

export class GroceryList extends LitElement {
  static properties = {
    listData: { type: Object },
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

    .aisle-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin: 1.25rem 0 0.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--pink-600);
    }

    .aisle-header::before {
      content: '❧';
      font-size: 1rem;
      font-style: normal;
    }

    .aisle-section > ul {
      margin-top: 0;
    }
  `;

  constructor() {
    super();
    this.listData = { floatingItems: [], aisles: [] };
  }

  _remove(id, name) {
    this.dispatchEvent(new CustomEvent('remove-item', {
      detail: { id },
      bubbles: true,
      composed: true,
    }));
  }

  _renderItem(item) {
    return html`
      <li>
        <span class="item-name">${item.name}</span>
        <button class="remove-btn" @click=${() => this._remove(item.id)} aria-label="Remove ${item.name}">&times;</button>
      </li>
    `;
  }

  render() {
    const { floatingItems = [], aisles = [] } = this.listData;
    return html`
      ${floatingItems.length > 0 ? html`
        <ul>${floatingItems.map(item => this._renderItem(item))}</ul>
      ` : ''}

      ${aisles.map(aisle => html`
        <div class="aisle-section">
          <p class="aisle-header">${aisle.name}</p>
          <ul>${aisle.items.map(item => this._renderItem(item))}</ul>
        </div>
      `)}
    `;
  }
}

customElements.define('grocery-list', GroceryList);
