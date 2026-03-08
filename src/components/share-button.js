import { LitElement, html, css } from 'lit';

/**
 * Formats the list data for sharing.
 * Accepts either a legacy flat string array or the new structured format
 * { floatingItems: [{id, name}], aisles: [{id, name, items: [{id, name}]}] }.
 */
export function formatShareText(data) {
  const sections = [];

  if (Array.isArray(data)) {
    sections.push(data.map(name => `• ${name}`).join('\n'));
  } else {
    const { floatingItems = [], aisles = [] } = data;
    if (floatingItems.length > 0) {
      sections.push(floatingItems.map(item => `• ${item.name}`).join('\n'));
    }
    for (const aisle of aisles) {
      const itemLines = aisle.items.map(item => `• ${item.name}`).join('\n');
      sections.push(`❧ ${aisle.name}\n${itemLines}`);
    }
  }

  return `🛒 WhoreDash List\n\n${sections.join('\n\n')}`;
}

export function isListEmpty(data) {
  if (Array.isArray(data)) return data.length === 0;
  const { floatingItems = [], aisles = [] } = data;
  return floatingItems.length === 0 && aisles.every(a => a.items.length === 0);
}

export class ShareButton extends LitElement {
  static properties = {
    items: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 1.25rem;
      padding-bottom: 2rem;
    }

    button {
      width: 100%;
      padding: 0.85rem;
      background: var(--pink-500);
      color: var(--white);
      border: none;
      border-radius: var(--radius);
      font: inherit;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
      box-shadow: var(--shadow);
    }

    button:hover:not(:disabled) {
      background: var(--pink-600);
    }

    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.items = [];
  }

  _formatList() {
    return formatShareText(this.items);
  }

  _isEmpty() {
    return isListEmpty(this.items);
  }

  async _share() {
    if (this._isEmpty()) return;

    try {
      await navigator.share({
        title: 'WhoreDash List',
        text: this._formatList(),
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  }

  render() {
    const empty = this._isEmpty();
    return html`
      <button ?disabled=${empty} @click=${this._share}>
        Send the Whore Shopping
      </button>
    `;
  }
}

customElements.define('share-button', ShareButton);
