import { LitElement, html, css, svg } from 'lit';

const undoArrow = svg`<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
</svg>`;

export class GroceryList extends LitElement {
  static properties = {
    listData: { type: Object },
    _editingId: { type: String, state: true },
    _editingName: { type: String, state: true },
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
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      font-size: 1rem;
      color: var(--text);
      text-align: left;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-name:hover {
      color: var(--pink-600);
    }

    .edit-input {
      flex: 1;
      min-width: 0;
      padding: 0.1rem 0.3rem;
      border: 2px solid var(--pink-400);
      border-radius: calc(var(--radius) / 2);
      font: inherit;
      font-size: 1rem;
      color: var(--text);
      background: var(--white);
      outline: none;
    }

    .cancel-edit-btn {
      flex: none;
      background: none;
      border: none;
      color: var(--text-muted);
      font: inherit;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.2rem 0.4rem;
      margin-left: 0.25rem;
      border-radius: calc(var(--radius) / 2);
      transition: color 0.15s;
    }

    .cancel-edit-btn:hover {
      color: var(--pink-600);
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
    this._editingId = null;
    this._editingName = '';
  }

  updated(changedProps) {
    if (changedProps.has('_editingId') && this._editingId) {
      const input = this.shadowRoot.querySelector('.edit-input');
      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  _startEdit(item) {
    this._editingId = item.id;
    this._editingName = item.name;
  }

  _saveEdit() {
    if (!this._editingId) return;
    const name = this._editingName.trim();
    if (name) {
      this.dispatchEvent(new CustomEvent('rename-item', {
        detail: { id: this._editingId, name },
        bubbles: true,
        composed: true,
      }));
    }
    this._editingId = null;
    this._editingName = '';
  }

  _cancelEdit() {
    this._editingId = null;
    this._editingName = '';
  }

  _onEditKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._saveEdit();
    } else if (e.key === 'Escape') {
      this._cancelEdit();
    }
  }

  _remove(id) {
    this.dispatchEvent(new CustomEvent('remove-item', {
      detail: { id },
      bubbles: true,
      composed: true,
    }));
  }

  _renderItem(item) {
    if (this._editingId === item.id) {
      return html`
        <li>
          <input
            class="edit-input"
            .value=${this._editingName}
            @input=${e => { this._editingName = e.target.value; }}
            @keydown=${this._onEditKeydown}
            @blur=${this._saveEdit}
            aria-label="Edit ${item.name}"
          >
          <button
            class="cancel-edit-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${this._cancelEdit}
            aria-label="Cancel edit"
          >${undoArrow}</button>
          <button
            class="remove-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${() => { this._cancelEdit(); this._remove(item.id); }}
            aria-label="Remove ${item.name}"
          >&times;</button>
        </li>
      `;
    }
    return html`
      <li>
        <button class="item-name" @click=${() => this._startEdit(item)} aria-label="Edit ${item.name}">${item.name}</button>
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
