import { LitElement, html, css, svg } from 'lit';

const undoArrow = svg`<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
</svg>`;

export class GroceryList extends LitElement {
  static properties = {
    listData: { type: Object },
    _editingItemId: { type: String, state: true },
    _editingItemName: { type: String, state: true },
    _editingAisleId: { type: String, state: true },
    _editingAisleName: { type: String, state: true },
    _movingItemId: { type: String, state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    ul {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
    }

    li {
      display: flex;
      flex-wrap: wrap;
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
    }

    .aisle-header::before {
      content: '❧';
      font-size: 1rem;
      color: var(--pink-400);
      flex: none;
    }

    .aisle-name-btn {
      flex: 1;
      min-width: 0;
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--pink-600);
      text-align: left;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.15s;
    }

    .aisle-name-btn:hover {
      color: var(--pink-800);
    }

    .aisle-edit-input {
      flex: 1;
      min-width: 0;
      padding: 0.1rem 0.3rem;
      border: 2px solid var(--pink-400);
      border-radius: calc(var(--radius) / 2);
      font: inherit;
      font-size: 0.85rem;
      color: var(--text);
      background: var(--white);
      outline: none;
    }

    .aisle-action-btn {
      flex: none;
      background: none;
      border: none;
      color: var(--text-muted);
      font: inherit;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.1rem 0.3rem;
      border-radius: calc(var(--radius) / 2);
      transition: color 0.15s;
      line-height: 1;
    }

    .aisle-action-btn:hover {
      color: var(--pink-600);
    }

    .aisle-section > ul {
      margin-top: 0;
    }

    .move-btn {
      flex: none;
      background: none;
      border: none;
      color: var(--text-muted);
      font: inherit;
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      padding: 0.2rem 0.4rem 0.2rem 0;
      border-radius: calc(var(--radius) / 2);
      transition: color 0.15s;
      margin-right: 0.1rem;
    }

    .move-btn:hover,
    .move-btn[aria-expanded="true"] {
      color: var(--pink-600);
    }

    .aisle-picker {
      flex-basis: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding: 0.5rem 0 0.1rem;
      border-top: 1px solid var(--pink-100);
      margin-top: 0.4rem;
    }

    .aisle-option {
      background: none;
      border: 1px solid var(--pink-200);
      border-radius: 999px;
      color: var(--pink-600);
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.2rem 0.75rem;
      transition: background 0.15s, border-color 0.15s;
    }

    .aisle-option:hover {
      background: var(--pink-100);
      border-color: var(--pink-400);
    }

    .aisle-option--none {
      color: var(--text-muted);
      border-style: dashed;
    }

    .aisle-option--none:hover {
      color: var(--text);
    }
  `;

  constructor() {
    super();
    this.listData = { floatingItems: [], aisles: [] };
    this._editingItemId = null;
    this._editingItemName = '';
    this._editingAisleId = null;
    this._editingAisleName = '';
    this._movingItemId = null;
  }

  updated(changedProps) {
    if (changedProps.has('_editingItemId') && this._editingItemId) {
      const input = this.shadowRoot.querySelector('.edit-input');
      if (input) { input.focus(); input.select(); }
    }
    if (changedProps.has('_editingAisleId') && this._editingAisleId) {
      const input = this.shadowRoot.querySelector('.aisle-edit-input');
      if (input) { input.focus(); input.select(); }
    }
  }

  _toggleMove(item) {
    this._movingItemId = this._movingItemId === item.id ? null : item.id;
  }

  _selectAisle(itemId, aisleId) {
    this._movingItemId = null;
    this.dispatchEvent(new CustomEvent('move-item', {
      detail: { id: itemId, aisleId },
      bubbles: true,
      composed: true,
    }));
  }

  _startItemEdit(item) {
    this._editingAisleId = null;
    this._movingItemId = null;
    this._editingItemId = item.id;
    this._editingItemName = item.name;
  }

  _saveItemEdit() {
    if (!this._editingItemId) return;
    const name = this._editingItemName.trim();
    if (name) {
      this.dispatchEvent(new CustomEvent('rename-item', {
        detail: { id: this._editingItemId, name },
        bubbles: true,
        composed: true,
      }));
    }
    this._editingItemId = null;
    this._editingItemName = '';
  }

  _cancelItemEdit() {
    this._editingItemId = null;
    this._editingItemName = '';
  }

  _onItemEditKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); this._saveItemEdit(); }
    else if (e.key === 'Escape') { this._cancelItemEdit(); }
  }

  _startAisleEdit(aisle) {
    this._editingItemId = null;
    this._editingAisleId = aisle.id;
    this._editingAisleName = aisle.name;
  }

  _saveAisleEdit() {
    if (!this._editingAisleId) return;
    const name = this._editingAisleName.trim();
    if (name) {
      this.dispatchEvent(new CustomEvent('rename-aisle', {
        detail: { id: this._editingAisleId, name },
        bubbles: true,
        composed: true,
      }));
    }
    this._editingAisleId = null;
    this._editingAisleName = '';
  }

  _cancelAisleEdit() {
    this._editingAisleId = null;
    this._editingAisleName = '';
  }

  _onAisleEditKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); this._saveAisleEdit(); }
    else if (e.key === 'Escape') { this._cancelAisleEdit(); }
  }

  _deleteAisle(id) {
    this.dispatchEvent(new CustomEvent('delete-aisle', {
      detail: { id },
      bubbles: true,
      composed: true,
    }));
  }

  _remove(id) {
    this.dispatchEvent(new CustomEvent('remove-item', {
      detail: { id },
      bubbles: true,
      composed: true,
    }));
  }

  _renderItem(item) {
    if (this._editingItemId === item.id) {
      return html`
        <li>
          <input
            class="edit-input"
            .value=${this._editingItemName}
            @input=${e => { this._editingItemName = e.target.value; }}
            @keydown=${this._onItemEditKeydown}
            @blur=${this._saveItemEdit}
            aria-label="Edit ${item.name}"
          >
          <button
            class="cancel-edit-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${this._cancelItemEdit}
            aria-label="Cancel edit"
          >${undoArrow}</button>
          <button
            class="remove-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${() => { this._cancelItemEdit(); this._remove(item.id); }}
            aria-label="Remove ${item.name}"
          >&times;</button>
        </li>
      `;
    }
    const aisles = this.listData.aisles ?? [];
    const isPicking = this._movingItemId === item.id;
    return html`
      <li>
        ${aisles.length > 0 ? html`
          <button
            class="move-btn"
            aria-label="Move ${item.name} to a different aisle"
            aria-expanded="${isPicking}"
            @click=${() => this._toggleMove(item)}
          >↕</button>
        ` : ''}
        <button class="item-name" @click=${() => this._startItemEdit(item)} aria-label="Edit ${item.name}">${item.name}</button>
        <button class="remove-btn" @click=${() => this._remove(item.id)} aria-label="Remove ${item.name}">&times;</button>
        ${isPicking ? html`
          <div class="aisle-picker">
            ${aisles.map(aisle => html`
              <button class="aisle-option" @click=${() => this._selectAisle(item.id, aisle.id)}>${aisle.name}</button>
            `)}
            <button class="aisle-option aisle-option--none" @click=${() => this._selectAisle(item.id, null)}>No aisle</button>
          </div>
        ` : ''}
      </li>
    `;
  }

  _renderAisle(aisle) {
    const header = this._editingAisleId === aisle.id
      ? html`
        <div class="aisle-header">
          <input
            class="aisle-edit-input"
            .value=${this._editingAisleName}
            @input=${e => { this._editingAisleName = e.target.value; }}
            @keydown=${this._onAisleEditKeydown}
            @blur=${this._saveAisleEdit}
            aria-label="Rename aisle"
          >
          <button
            class="aisle-action-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${this._cancelAisleEdit}
            aria-label="Cancel rename"
          >${undoArrow}</button>
          <button
            class="aisle-action-btn"
            @mousedown=${e => e.preventDefault()}
            @click=${() => { this._cancelAisleEdit(); this._deleteAisle(aisle.id); }}
            aria-label="Delete aisle"
          >&times;</button>
        </div>
      `
      : html`
        <div class="aisle-header">
          <button class="aisle-name-btn" @click=${() => this._startAisleEdit(aisle)} aria-label="Rename aisle ${aisle.name}">${aisle.name}</button>
          <button class="aisle-action-btn" @click=${() => this._deleteAisle(aisle.id)} aria-label="Delete aisle ${aisle.name}">&times;</button>
        </div>
      `;

    return html`
      <div class="aisle-section">
        ${header}
        <ul>${aisle.items.map(item => this._renderItem(item))}</ul>
      </div>
    `;
  }

  render() {
    const { floatingItems = [], aisles = [] } = this.listData;
    return html`
      ${floatingItems.length > 0 ? html`
        <ul>${floatingItems.map(item => this._renderItem(item))}</ul>
      ` : ''}
      ${aisles.map(aisle => this._renderAisle(aisle))}
    `;
  }
}

customElements.define('grocery-list', GroceryList);
