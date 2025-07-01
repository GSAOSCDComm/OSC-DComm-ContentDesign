(function () {
  if (document.querySelector('#uswds-icon-overlay')) return;
  
  const SPRITE = '/sites/gsa.gov/templates/styles/dist/img/sprite.svg';
  
  const icons = [
    'accessibility_new','accessible_forward','account_balance','account_box','account_circle','add','add_circle','add_circle_outline','alarm','alternate_email','announcement','arrow_back','arrow_downward','arrow_drop_down','arrow_drop_up','arrow_forward','arrow_upward','api','assessment','attach_file','attach_money','autorenew','backpack','bathtub','bedding','bookmark','bug_report','build','calendar_today','campaign','camping','cancel','chat','check','check_box_outline_blank','check_circle','check_circle_outline','checkroom','clean_hands','clothes','close','closed_caption','cloud','code','comment','connect_without_contact','construction','construction_worker','contact_page','content_copy','coronavirus','credit_card','deck','delete','device_thermostat','directions','directions_bike','directions_bus','directions_car','directions_walk','do_not_disturb','do_not_touch','drag_handle','eco','edit','electrical_services','emoji_events','error','error_outline','event','expand_less','expand_more','facebook','fingerprint','fitness_center','flag','folder','folder_open','forum','front_hand','gavel','get_app','gif','grade','group','help','help_outline','highlight','history','home','hourglass_empty','https','image','info','info_outline','keyboard','label','language','launch','link','list','lock','location_on','mail','menu','mic','military_tech','money','more_horiz','more_vert','notification_important','notifications','open_in_new','outdoor_grill','palette','people','person','phone','photo','pie_chart','play_arrow','print','public','query_builder','save','school','search','security','send','settings','share','shopping_cart','smartphone','spa','star','star_border','store','support','thumb_up','thumb_down','timer','today','train','trending_down','trending_up','verified','warning','watch','wifi','work','youtube','instagram','linkedin','twitter'
  ];
  
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
  
  modal.innerHTML =
    `<div class="usa-modal__content" style="position:relative;padding-top:30px">
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
    </div>`;
  
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
    } else {
      // List mode implementation
      let count = mk('input');
      count.className = 'usa-input';
      count.type = 'number';
      count.min = 1;
      count.max = 10;
      count.value = 3;
      
      let label = mk('label');
      label.className = 'usa-label';
      label.textContent = 'Number of items';
      label.append(count);
      
      cfg.append(label);
      let items = mk('div');
      cfg.append(items);
      
      count.onchange = () => {
        items.innerHTML = '';
        for (let i = 0; i < count.value; i++) {
          let wrap = mk('div');
          wrap.innerHTML = `<hr><strong>Item ${i+1}</strong>`;
          wrap.append(
            iconGrid(`icon-sel-${i}`), 
            colorSizeText(), 
            hiddenInput(`ico-${i}`)
          );
          items.append(wrap);
        }
      };
      
      count.onchange();
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
    selectedIcon.innerHTML = '<span class="text-secondary">No icon selected</span>';
    selectedIcon.style.display = 'flex';
    selectedIcon.style.alignItems = 'center';
    selectedIcon.style.height = '40px';
    
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
        // Fixed the syntax error in the next line (was missing opening parenthesis)
        document.querySelector(`#${id.replace('icon-sel','ico')}`).value = iconName;
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
    
    // Fixed backtick syntax issues in template literals
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
      color !== 'default' ? `text-${color}` : '',
      size !== 'default' ? `usa-icon--size-${size}` : ''
    ].filter(Boolean).join(' ');
    
    const svg = `<svg class="${cls}" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${icon}"></use></svg>`;
    return text ? svg + ' ' + text : svg;
  }
  
  gen.onclick = () => {
    let html = '';
    if (mode.value === 'single') {
      const iconName = document.querySelector('#ico').value;
      const colorVal = document.querySelector('#col').value;
      const sizeVal = document.querySelector('#sz').value;
      const textVal = document.querySelector('#txt').value;
      
      if (iconName) {
        html = generateSvg(iconName, colorVal, sizeVal, textVal);
      }
    } else {
      // List mode HTML generation
      html = '<ul class="usa-icon-list">';
      
      const count = parseInt(cfg.querySelector('input[type="number"]').value);
      for (let i = 0; i < count; i++) {
        const iconName = document.querySelector(`#ico-${i}`).value;
        const colorVal = document.querySelector(`#icon-sel-${i}`).parentNode.querySelector('#col').value;
        const sizeVal = document.querySelector(`#icon-sel-${i}`).parentNode.querySelector('#sz').value;
        const textVal = document.querySelector(`#icon-sel-${i}`).parentNode.querySelector('#txt').value || '';
        
        if (iconName) {
          const svg = generateSvg(iconName, colorVal, sizeVal);
          html += `<li class="usa-icon-list__item">
            <div class="usa-icon-list__icon">${svg}</div>
            <div class="usa-icon-list__content">${textVal}</div>
          </li>`;
        }
      }
      
      html += '</ul>';
    }
    
    out.value = html;
  };
})();
