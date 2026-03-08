import { LitElement, html, css } from 'lit';
import './add-item.js';
import './grocery-list.js';
import './share-button.js';

const STORAGE_KEY = 'whoredash-list';

export class WhoreDash extends LitElement {
  static properties = {
    items: { type: Array, state: true },
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
    this.items = this._load();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  _addItem(e) {
    const name = e.detail.name.trim();
    if (!name) return;
    this.items = [...this.items, name];
    this._save();
  }

  _removeItem(e) {
    const idx = e.detail.index;
    this.items = this.items.filter((_, i) => i !== idx);
    this._save();
  }

  _clearList() {
    if (this.items.length === 0) return;
    this.items = [];
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

      ${this.items.length === 0
        ? html`<p class="empty">The list is empty.<br>Your whore is free… for now.</p>`
        : html`<grocery-list .items=${this.items} @remove-item=${this._removeItem}></grocery-list>`
      }

      <share-button .items=${this.items}></share-button>
    `;
  }
}

customElements.define('whore-dash', WhoreDash);
