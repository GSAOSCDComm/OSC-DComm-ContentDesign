(function() {
  if (document.querySelector('#uswds-icon-overlay')) return;

  const SPRITE = '/sites/gsa.gov/templates/styles/dist/img/sprite.svg';
  const icons = [/* your icon list here (same as original) */];
  const colors = ['default','primary','white','green','red'];
  const sizes = ['default',3,4,5,6,7,8,9];

  function mk(tag) {
    return document.createElement(tag);
  }

  const overlay = mk('div');
  overlay.className = 'usa-overlay is-visible';
  overlay.id = 'uswds-icon-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998';

  const modal = mk('div');
  modal.className = 'usa-modal usa-modal--lg is-visible';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'uswds-icon-title');
  modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;background:white;border:2px solid #565c65;border-radius:8px;box-shadow:0 0 20px rgba(0,0,0,0.4);max-height:90vh;overflow:auto;width:90%;max-width:800px;padding:1rem';
  modal.innerHTML = `
    <div class="usa-modal__content" style="position:relative;padding-top:30px">
      <div class="usa-modal__main">
        <button class="usa-button usa-button--unstyled usa-modal__close" aria-label="Close" id="close-modal" style="position:absolute;top:0;right:0;padding:10px;">
          <svg class="usa-icon"><use href="${SPRITE}#close"></use></svg>
        </button>
        <h2 class="usa-modal__heading" id="uswds-icon-title">USWDS Icon Generator</h2>
        <div class="usa-form-group">
          <label class="usa-label">Type
            <select class="usa-select" id="mode">
              <option value="single">Single</option>
              <option value="list">List</option>
            </select>
          </label>
        </div>
        <div id="cfg"></div>
        <button class="usa-button margin-y-2" id="gen">Generate</button>
        <div class="usa-form-group">
          <label class="usa-label" for="out">Generated HTML</label>
          <textarea class="usa-textarea" id="out" rows="6"></textarea>
        </div>
      </div>
    </div>
  `;

  document.body.append(overlay, modal);

  const mode = modal.querySelector('#mode');
  const cfg = modal.querySelector('#cfg');
  const gen = modal.querySelector('#gen');
  const out = modal.querySelector('#out');
  const close = modal.querySelector('#close-modal');

  close.onclick = () => {
    modal.remove();
    overlay.remove();
  };

  mode.onchange = build;
  build();

  function build() {
    cfg.innerHTML = '';
    if (mode.value === 'single') {
      cfg.append(iconGrid('icon-sel'), colorSizeText(), hiddenInput('ico'));
    }
  }

  function iconGrid(id) {
    const container = mk('div');
    const label = mk('label');
    label.className = 'usa-label';
    label.textContent = 'Select an icon';

    const selectedIcon = mk('div');
    selectedIcon.className = 'margin-top-1 padding-2 border-1px border-base-lighter';
    selectedIcon.id = `selected-${id}`;

    const iconGridDiv = mk('div');
    iconGridDiv.style.display = 'grid';
    iconGridDiv.style.gridTemplateColumns = 'repeat(auto-fill, 42px)';
    iconGridDiv.style.gap = '4px';
    iconGridDiv.className = 'margin-top-1';

    icons.forEach(iconName => {
      const iconBtn = mk('button');
      iconBtn.type = 'button';
      iconBtn.className = 'icon-btn usa-button usa-button--unstyled';
      iconBtn.dataset.icon = iconName;
      iconBtn.title = iconName;
      iconBtn.style.cssText = 'padding:8px;margin:2px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;height:42px;width:42px;flex-shrink:0;border:1px solid #dfe1e2;border-radius:4px';
      iconBtn.innerHTML = `<svg class="usa-icon" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${iconName}"></use></svg>`;
      iconBtn.onclick = () => {
        selectedIcon.innerHTML = `<svg class="usa-icon" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${iconName}"></use></svg> ${iconName}`;
        modal.querySelector(`#${id.replace('icon-sel','ico')}`).value = iconName;
      };
      iconGridDiv.appendChild(iconBtn);
    });

    container.append(label, selectedIcon, iconGridDiv);
    return container;
  }

  function colorSizeText() {
    const wrap = mk('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '10px';
    wrap.style.flexWrap = 'wrap';
    const colorSelect = `<label class="usa-label" style="flex: 1; min-width: 150px;">Color<select id="col" class="usa-select">${colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select></label>`;
    const sizeSelect = `<label class="usa-label" style="flex: 1; min-width: 150px;">Size<select id="sz" class="usa-select">${sizes.map(s => `<option value="${s}">${s === 'default' ? 'Default' : s}</option>`).join('')}</select></label>`;
    const textInput = `<label class="usa-label" style="flex: 2; min-width: 150px;">Optional Text<input id="txt" class="usa-input" type="text"></label>`;
    wrap.innerHTML = colorSelect + sizeSelect + textInput;
    return wrap;
  }

  function hiddenInput(id) {
    const input = mk('input');
    input.type = 'hidden';
    input.id = id;
    return input;
  }

  function generateSvg(icon, color, size, text) {
    const cls = [
      'usa-icon',
      color !== 'default' ? `usa-icon--${color}` : '',
      size !== 'default' ? `usa-icon--size-${size}` : ''
    ].filter(Boolean).join(' ');
    const svg = `<svg class="${cls}" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${icon}"></use></svg>`;
    return text ? svg + ' ' + text : svg;
  }

  gen.onclick = () => {
    let html = '';
    if (mode.value === 'single') {
      const iconName = modal.querySelector('#ico').value;
      const colorVal = modal.querySelector('#col').value;
      const sizeVal = modal.querySelector('#sz').value;
      const textVal = modal.querySelector('#txt').value;
      if (iconName) {
        html = generateSvg(iconName, colorVal, sizeVal, textVal);
      }
    }
    out.value = html;
  };
})();
