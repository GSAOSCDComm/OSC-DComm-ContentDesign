(function(){
    const SPRITE='/sites/gsa.gov/templates/styles/dist/img/sprite.svg';
    const icons=['accessibility_new','accessible_forward','account_balance'/* ... rest of icons ... */];
    const colors=['default','primary','white','green','red'];
    const sizes=['default',3,4,5,6,7,8,9];

    // [Rest of the original script, but with search functionality removed]
    function iconGrid(id){
        const container=mk('div');
        container.className='usa-form-group';
        const label=mk('label');
        label.className='usa-label';
        label.textContent='Select an icon';
        const gridToggle=mk('button');
        gridToggle.type='button';
        gridToggle.className='usa-button usa-button--outline margin-top-1';
        gridToggle.textContent='Show icon grid';
        gridToggle.id=`toggle-${id}`;
        const selectedIcon=mk('div');
        selectedIcon.className='margin-top-1 padding-2 border-1px border-base-lighter';
        selectedIcon.id=`selected-${id}`;
        selectedIcon.innerHTML='<span class="text-secondary">No icon selected</span>';
        selectedIcon.style.display='flex';
        selectedIcon.style.alignItems='center';
        selectedIcon.style.height='40px';
        const iconGridDiv=mk('div');
        iconGridDiv.className='margin-top-1 padding-2 border-1px border-base-lighter';
        iconGridDiv.id=id;
        iconGridDiv.style.display='none';
        iconGridDiv.style.flexWrap='wrap';
        iconGridDiv.style.justifyContent='flex-start';
        iconGridDiv.style.gap='4px';
        iconGridDiv.style.maxHeight='300px';
        iconGridDiv.style.overflowY='auto';

        icons.forEach(iconName=>{
            const iconBtn=mk('button');
            iconBtn.type='button';
            iconBtn.className='icon-btn usa-button usa-button--unstyled';
            iconBtn.dataset.icon=iconName;
            iconBtn.title=iconName;
            iconBtn.style.padding='8px';
            iconBtn.style.margin='2px';
            iconBtn.style.display='flex';
            iconBtn.style.flexDirection='column';
            iconBtn.style.alignItems='center';
            iconBtn.style.justifyContent='center';
            iconBtn.style.cursor='pointer';
            iconBtn.style.height='42px';
            iconBtn.style.width='42px';
            iconBtn.style.flexShrink='0';
            iconBtn.style.border='1px solid #dfe1e2';
            iconBtn.style.borderRadius='4px';
            iconBtn.innerHTML=`<svg class="usa-icon" aria-hidden="true" role="img" width="24" height="24"><use href="${SPRITE}#${iconName}" xlink:href="${SPRITE}#${iconName}"></use></svg>`;
            iconGridDiv.appendChild(iconBtn);
        });

        container.append(label, selectedIcon, gridToggle, iconGridDiv);
        return container;
    }

    // [Rest of the original script remains the same]
})();
