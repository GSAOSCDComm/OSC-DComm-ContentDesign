javascript:(function(){
  if(document.querySelector('#uswds-icon-overlay'))return;
  
  const SPRITE = '/sites/gsa.gov/templates/styles/dist/img/sprite.svg';
  
  const icons = ['accessibility_new','accessible_forward','account_balance','account_box','account_circle','add','add_circle','add_circle_outline','alarm','alternate_email','announcement','arrow_back','arrow_downward','arrow_drop_down','arrow_drop_up','arrow_forward','arrow_upward','api','assessment','attach_file','attach_money','autorenew','backpack','bathtub','bedding','bookmark','bug_report','build','calendar_today','campaign','camping','cancel','chat','check','check_box_outline_blank','check_circle','check_circle_outline','checkroom','clean_hands','clothes','close','closed_caption','cloud','code','comment','connect_without_contact','construction','construction_worker','contact_page','content_copy','coronavirus','credit_card','deck','delete','device_thermostat','directions','directions_bike','directions_bus','directions_car','directions_walk','do_not_disturb','do_not_touch','drag_handle','eco','edit','electrical_services','emoji_events','error','error_outline','event','expand_less','expand_more','facebook','fingerprint','fitness_center','flag','folder','folder_open','forum','front_hand','gavel','get_app','gif','grade','group','help','help_outline','highlight','history','home','hourglass_empty','https','image','info','info_outline','keyboard','label','language','launch','link','list','lock','location_on','mail','menu','mic','military_tech','money','more_horiz','more_vert','notification_important','notifications','open_in_new','outdoor_grill','palette','people','person','phone','photo','pie_chart','play_arrow','print','public','query_builder','save','school','search','security','send','settings','share','shopping_cart','smartphone','spa','star','star_border','store','support','thumb_up','thumb_down','timer','today','train','trending_down','trending_up','verified','warning','watch','wifi','work','youtube','instagram','linkedin','twitter'];
  
  const colors = ['default','primary','white','green','red'];
  const sizes = ['default',3,4,5,6,7,8,9];
  
  function mk(tag) { return document.createElement(tag); }
  
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
      cfg.append(iconGrid('icon-sel'), colorSizeText('0'), hiddenInput('ico'));
    } else {
      // List mode implementation
      const countLabel = mk('label');
      countLabel.className = 'usa-label';
      countLabel.innerHTML = 'Number of items';
      
      const count = mk('input');
      count.className = 'usa-input margin-bottom-2';
      count.type = 'number';
      count.min = 1;
      count.max = 10;
      count.value = 3;
      
      countLabel.appendChild(count);
      cfg.appendChild(countLabel);
      
      const itemsContainer = mk('div');
      itemsContainer.id = 'list-items';
      cfg.appendChild(itemsContainer);
      
      function updateItems() {
        itemsContainer.innerHTML = '';
        for (let i = 0; i < count.value; i++) {
          const itemWrap = mk('div');
          itemWrap.className = 'margin-y-2';
          itemWrap.innerHTML = `<hr><h3 class="font-sans-sm">Item ${i+1}</h3>`;
          
          const hiddenIconInput = mk('input');
          hiddenIconInput.type = 'hidden';
          hiddenIconInput.id = `ico-${i}`;
          
          itemWrap.appendChild(iconGrid(`icon-sel-${i}`));
          itemWrap.appendChild(colorSizeText(i));
          itemWrap.appendChild(hiddenIconInput);
          
          itemsContainer.appendChild(itemWrap);
        }
      }
      
      count.onchange = updateItems;
      updateItems();
    }
  }
  
  function iconGrid(id) {
    const container = mk('div');
    container.className = 'usa-form-group margin-y-2';
    
    const label = mk('label');
    label.className = 'usa-label';
    label.textContent = 'Select an icon';
    
    const selectedIcon = mk('div');
    selectedIcon.className = 'margin-top-1 padding-2 border-1px border-base-lighter';
    selectedIcon.id = `selected-${id}`;
    selectedIcon.innerHTML = '<span class="text-secondary">No icon selected</span>';
    selectedIcon.style.cssText = 'display:flex;align-items:center;height:40px';
    
    const gridToggle = mk('button');
    gridToggle.type = 'button';
    gridToggle.className = 'usa-button usa-button--outline margin-top-1';
    gridToggle.textContent = 'Show icon grid';
    
    const iconGrid = mk('div');
    iconGrid.className = 'margin-top-1 padding-2 border-1px border-base-lighter';
    iconGrid.style.cssText = 'display:none;flex-wrap:wrap;gap:4px;max-height:300px;overflow-y:auto';
    
    const searchInput = mk('input');
    searchInput.type = 'text';
    searchInput.className = 'usa-input margin-top-1 margin-bottom-1';
    searchInput.placeholder = 'Search icons...';
    
    icons.forEach(iconName => {
      const btn = mk('button');
      btn.type = 'button';
      btn.className = 'icon-btn usa-button usa-button--unstyled';
      btn.dataset.icon = iconName;
      btn.title = iconName;
      btn.style.cssText = 'padding:8px;margin:2px;display:flex;align-items:center;justify-content:center;cursor:pointer;height:42px;width:42px;border:1px solid #dfe1e2;border-radius:4px';
      
      btn.innerHTML = `<svg class="usa-icon" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${iconName}"></use></svg>`;
      
      btn.onclick = () => {
        const hiddenInput = container.parentNode.querySelector(`#${id.replace('icon-sel','ico')}`);
        hiddenInput.value = iconName;
        
        selectedIcon.innerHTML = `
          <svg class="usa-icon margin-right-1" aria-hidden="true" role="img" width="24" height="24">
            <use href="${SPRITE}#${iconName}"></use>
          </svg>
          ${iconName}
        `;
        
        iconGrid.style.display = 'none';
        gridToggle.textContent = 'Show icon grid';
      };
      
      iconGrid.appendChild(btn);
    });
    
    gridToggle.onclick = () => {
      const isHidden = iconGrid.style.display === 'none';
      iconGrid.style.display = isHidden ? 'flex' : 'none';
      gridToggle.textContent = isHidden ? 'Hide icon grid' : 'Show icon grid';
    };
    
    searchInput.oninput = () => {
      const term = searchInput.value.toLowerCase();
      iconGrid.querySelectorAll('.icon-btn').forEach(btn => {
        const iconName = btn.dataset.icon;
        btn.style.display = iconName.includes(term) ? 'flex' : 'none';
      });
    };
    
    container.append(label, selectedIcon, gridToggle, searchInput, iconGrid);
    return container;
  }
  
  function colorSizeText(index) {
    const wrap = mk('div');
    wrap.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
    
    const colorLabel = mk('label');
    colorLabel.className = 'usa-label';
    colorLabel.style.cssText = 'flex:1;min-width:150px';
    colorLabel.textContent = 'Color';
    
    const colorSelect = mk('select');
    colorSelect.className = 'usa-select';
    colorSelect.id = `col-${index}`;
    
    colors.forEach(color => {
      const option = mk('option');
      option.value = color;
      option.textContent = color;
      colorSelect.appendChild(option);
    });
    
    colorLabel.appendChild(colorSelect);
    
    const sizeLabel = mk('label');
    sizeLabel.className = 'usa-label';
    sizeLabel.style.cssText = 'flex:1;min-width:150px';
    sizeLabel.textContent = 'Size';
    
    const sizeSelect = mk('select');
    sizeSelect.className = 'usa-select';
    sizeSelect.id = `sz-${index}`;
    
    sizes.forEach(size => {
      const option = mk('option');
      option.value = size;
      option.textContent = size === 'default' ? 'Default' : size;
      sizeSelect.appendChild(option);
    });
    
    sizeLabel.appendChild(sizeSelect);
    
    const textLabel = mk('label');
    textLabel.className = 'usa-label';
    textLabel.style.cssText = 'flex:2;min-width:200px';
    textLabel.textContent = 'Text';
    
    const textInput = mk('input');
    textInput.type = 'text';
    textInput.className = 'usa-input';
    textInput.id = `txt-${index}`;
    
    textLabel.appendChild(textInput);
    
    wrap.append(colorLabel, sizeLabel, textLabel);
    return wrap;
  }
  
  function hiddenInput(id) {
    const input = mk('input');
    input.type = 'hidden';
    input.id = id;
    return input;
  }
  
  gen.onclick = () => {
    let html = '';
    
    if (mode.value === 'single') {
      const iconName = document.getElementById('ico').value;
      const colorVal = document.getElementById('col-0').value;
      const sizeVal = document.getElementById('sz-0').value;
      const textVal = document.getElementById('txt-0').value;
      
      if (iconName) {
        const cls = [
          'usa-icon',
          colorVal !== 'default' ? `text-${colorVal}` : '',
          sizeVal !== 'default' ? `usa-icon--size-${sizeVal}` : ''
        ].filter(Boolean).join(' ');
        
        html = `<svg class="${cls}" aria-hidden="true" role="img" width="24" height="24">
          <use href="${SPRITE}#${iconName}"></use>
        </svg>`;
        
        if (textVal) {
          html += ` ${textVal}`;
        }
      }
    } else {
      // List mode
      html = '<ul class="usa-icon-list">\n';
      
      const itemCount = parseInt(document.querySelector('#list-items').childElementCount);
      
      for (let i = 0; i < itemCount; i++) {
        const iconName = document.getElementById(`ico-${i}`).value;
        
        if (iconName) {
          const colorVal = document.getElementById(`col-${i}`).value;
          const sizeVal = document.getElementById(`sz-${i}`).value;
          const textVal = document.getElementById(`txt-${i}`).value || '';
          
          const cls = [
            'usa-icon',
            colorVal !== 'default' ? `text-${colorVal}` : '',
            sizeVal !== 'default' ? `usa-icon--size-${sizeVal}` : ''
          ].filter(Boolean).join(' ');
          
          const svg = `<svg class="${cls}" aria-hidden="true" role="img" width="24" height="24">
            <use href="${SPRITE}#${iconName}"></use>
          </svg>`;
          
          html += `  <li class="usa-icon-list__item">
    <div class="usa-icon-list__icon">${svg}</div>
    <div class="usa-icon-list__content">${textVal}</div>
  </li>\n`;
        }
      }
      
      html += '</ul>';
    }
    
    out.value = html;
  };
})();
