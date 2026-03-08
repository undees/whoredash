import { LitElement, html, css } from 'lit';
import { generateId, migrateList, emptyList, isListEmpty } from '../utils.js';
import './add-item.js';
import './grocery-list.js';
import './share-button.js';

const STORAGE_KEY = 'whoredash-list';

export class WhoreDash extends LitElement {
  static properties = {
    _list: { type: Object, state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 480px;
    }

    header {
      text-align: center;
      padding: 1.5rem 0 1rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--pink-600);
      letter-spacing: -0.02em;
    }

    .tagline {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: 0.25rem;
      font-style: italic;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .clear-btn {
      flex: none;
      background: var(--pink-100);
      color: var(--pink-700);
      border: 1px solid var(--pink-200);
      border-radius: var(--radius);
      padding: 0.6rem 1rem;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }

    .clear-btn:hover {
      background: var(--pink-200);
    }

    .empty {
      text-align: center;
      color: var(--text-muted);
      padding: 2.5rem 1rem;
      font-size: 0.95rem;
      line-height: 1.5;
    }
  `;

  constructor() {
    super();
    this._list = migrateList(localStorage.getItem(STORAGE_KEY));
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._list));
  }

  _addItem(e) {
    const name = e.detail.name.trim();
    if (!name) return;
    this._list = {
      ...this._list,
      floatingItems: [...this._list.floatingItems, { id: generateId(), name }],
    };
    this._save();
  }

  _removeItem(e) {
    const { id } = e.detail;
    this._list = {
      floatingItems: this._list.floatingItems.filter(item => item.id !== id),
      aisles: this._list.aisles.map(aisle => ({
        ...aisle,
        items: aisle.items.filter(item => item.id !== id),
      })),
    };
    this._save();
  }

  _clearList() {
    if (isListEmpty(this._list)) return;
    this._list = emptyList();
    this._save();
  }

  render() {
    return html`
      <header>
        <h1>WhoreDash</h1>
        <p class="tagline">Because love is a grocery run.</p>
      </header>

      <div class="actions">
        <add-item @add-item=${this._addItem}></add-item>
        <button class="clear-btn" @click=${this._clearList}>Forget Everything</button>
      </div>

      ${isListEmpty(this._list)
        ? html`<p class="empty">The list is empty.<br>Your whore is free… for now.</p>`
        : html`<grocery-list .listData=${this._list} @remove-item=${this._removeItem}></grocery-list>`
      }

      <share-button .items=${this._list}></share-button>
    `;
  }
}

customElements.define('whore-dash', WhoreDash);
