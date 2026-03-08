import { LitElement, html, css } from 'lit';
import { generateId, migrateList, emptyList, isListEmpty, moveItemToAisle } from '../utils.js';
import { defaults as aisleDefaults } from '../aisle-defaults.js';

function findAisleLabel(name) {
  const n = name.toLowerCase();
  let bestAisle = null;
  let bestLen = 0;
  for (const [key, aisle] of aisleDefaults) {
    if (key instanceof RegExp) {
      const m = n.match(key);
      if (m && m[0].length > bestLen) { bestLen = m[0].length; bestAisle = aisle; }
    } else if (n.includes(key) && key.length > bestLen) {
      bestLen = key.length; bestAisle = aisle;
    }
  }
  return bestAisle;
}
import './add-item.js';
import './grocery-list.js';
import './share-button.js';

const STORAGE_KEY = 'whoredash-list';
const HISTORY_KEY = 'whoredash-history';
const BURN_IT_ALL_DOWN = 'BURN IT ALL DOWN';

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
      margin-top: 1.25rem;
    }

    .empty {
      text-align: center;
      color: var(--text-muted);
      padding: 2.5rem 1rem;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .forget-btn {
      display: block;
      width: 100%;
      background: none;
      border: none;
      color: var(--text-muted);
      font: inherit;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      text-align: center;
      cursor: pointer;
      padding: 0.75rem 0;
      margin-top: 0.5rem;
      transition: color 0.15s;
    }

    .forget-btn:hover {
      color: var(--pink-600);
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

    const aisleLabel = findAisleLabel(name);
    const existingAisle = aisleLabel && this._list.aisles.find(
      a => a.name.toLowerCase() === aisleLabel.toLowerCase()
    );

    if (existingAisle) {
      this._list = {
        ...this._list,
        aisles: this._list.aisles.map(a =>
          a.id === existingAisle.id
            ? { ...a, items: [...a.items, { id: generateId(), name }] }
            : a
        ),
      };
    } else if (aisleLabel) {
      const newAisle = { id: generateId(), name: aisleLabel, items: [{ id: generateId(), name }] };
      this._list = {
        ...this._list,
        aisles: [...this._list.aisles, newAisle],
      };
    } else {
      this._list = {
        ...this._list,
        floatingItems: [...this._list.floatingItems, { id: generateId(), name }],
      };
    }
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

  _addAisle(e) {
    const name = e.detail.name.trim();
    if (!name) return;

    if (name === BURN_IT_ALL_DOWN) {
      localStorage.removeItem(HISTORY_KEY);
      return;
    }

    this._list = {
      ...this._list,
      aisles: [...this._list.aisles, { id: generateId(), name, items: [] }],
    };
    this._save();
  }

  _renameAisle(e) {
    const { id, name } = e.detail;
    this._list = {
      ...this._list,
      aisles: this._list.aisles.map(aisle =>
        aisle.id === id ? { ...aisle, name } : aisle
      ),
    };
    this._save();
  }

  _deleteAisle(e) {
    const { id } = e.detail;
    const aisle = this._list.aisles.find(a => a.id === id);
    if (!aisle) return;
    this._list = {
      floatingItems: [...this._list.floatingItems, ...aisle.items],
      aisles: this._list.aisles.filter(a => a.id !== id),
    };
    this._save();
  }

  _renameItem(e) {
    const { id, name } = e.detail;
    this._list = {
      floatingItems: this._list.floatingItems.map(item =>
        item.id === id ? { ...item, name } : item
      ),
      aisles: this._list.aisles.map(aisle => ({
        ...aisle,
        items: aisle.items.map(item =>
          item.id === id ? { ...item, name } : item
        ),
      })),
    };
    this._save();
  }

  _moveItem(e) {
    this._list = moveItemToAisle(this._list, e.detail.id, e.detail.aisleId);
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
        <add-item @add-item=${this._addItem} @add-aisle=${this._addAisle}></add-item>
      </div>

      ${isListEmpty(this._list)
        ? html`<p class="empty">The list is empty.<br>Your whore is free… for now.</p>`
        : html`<grocery-list
            .listData=${this._list}
            @remove-item=${this._removeItem}
            @rename-item=${this._renameItem}
            @rename-aisle=${this._renameAisle}
            @delete-aisle=${this._deleteAisle}
            @move-item=${this._moveItem}
          ></grocery-list>`
      }

      <share-button .items=${this._list}></share-button>

      <button class="forget-btn" @click=${this._clearList}>Forget Everything</button>
    `;
  }
}

customElements.define('whore-dash', WhoreDash);
