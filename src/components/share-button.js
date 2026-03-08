import { LitElement, html, css } from 'lit';

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
    const lines = this.items.map(item => `• ${item}`);
    return `🛒 WhoreDash List\n\n${lines.join('\n')}`;
  }

  async _share() {
    if (this.items.length === 0) return;

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
    const empty = this.items.length === 0;
    return html`
      <button ?disabled=${empty} @click=${this._share}>
        Send the Whore Shopping
      </button>
    `;
  }
}

customElements.define('share-button', ShareButton);
