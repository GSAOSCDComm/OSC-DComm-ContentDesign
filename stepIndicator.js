(function () {
  const d = document.createElement('div');
  d.setAttribute('role', 'dialog');
  d.setAttribute('aria-modal', 'true');
  d.setAttribute('aria-labelledby', 'uswds-step-header');
  d.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:white;padding:20px;border:2px solid #1a4480;border-radius:4px;
    z-index:10000;max-width:90%;width:600px;max-height:90vh;overflow:auto;
    font-family:Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;
    box-sizing:border-box;
  `;

  d.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      textarea, select, input, button { width: 100%; }
      fieldset { border: none; padding: 0; margin: 0; }
    </style>
    <div style="overflow-y:auto;padding-right:10px">
      <h3 id="uswds-step-header" style="margin-top:0;color:#1a4480">USWDS Step Indicator Generator</h3>
      <div style="margin:10px 0">
        <label for="stepNum">Number of Steps (1–10):</label>
        <select id="stepNum">
          <option value="">Select number of steps</option>
          ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
      </div>
      <div style="margin:10px 0">
        <label for="currentStep">Current Step:</label>
        <select id="currentStep">
          <option value="">Select current step</option>
        </select>
      </div>
      <div style="margin:10px 0">
        <label for="variant">Variant:</label>
        <select id="variant">
          <option value="">Default</option>
          <option value="usa-step-indicator--no-labels">No labels</option>
          <option value="usa-step-indicator--counters">Counters</option>
          <option value="usa-step-indicator--counters-sm">Small counters</option>
          <option value="usa-step-indicator--center">Centered</option>
        </select>
      </div>
      <div id="stepInputs"></div>
      <div style="margin:10px 0">
        <label for="outputHTML">Generated HTML:</label>
        <textarea id="outputHTML" style="height:200px;padding:10px;font-family:monospace" readonly></textarea>
      </div>
    </div>
    <div style="position:sticky;bottom:0;left:0;right:0;background:white;padding:10px;border-top:1px solid #ccc;display:flex;gap:10px;justify-content:flex-end">
      <button type="button" id="updateBtn" class="usa-button" disabled>Update HTML</button>
      <button type="button" id="copyBtn" class="usa-button" disabled>Copy HTML</button>
      <button type="button" id="closeBtn" class="usa-button usa-button--secondary">Close</button>
    </div>
  `;

  document.body.appendChild(d);

  let settings = {
    numSteps: 0,
    currentStep: 0,
    variant: ''
  };

  const stepNumSel = d.querySelector('#stepNum');
  const currentStepSel = d.querySelector('#currentStep');
  const variantSel = d.querySelector('#variant');
  const stepInputs = d.querySelector('#stepInputs');
  const output = d.querySelector('#outputHTML');
  const copyBtn = d.querySelector('#copyBtn');
  const updateBtn = d.querySelector('#updateBtn');
  const closeBtn = d.querySelector('#closeBtn');

  function generateStepInputs() {
    const val = stepNumSel.value;

    if (!val) {
      stepInputs.innerHTML = '';
      currentStepSel.innerHTML = '<option value="">Select current step</option>';
      copyBtn.disabled = true;
      updateBtn.disabled = true;
      return;
    }

    settings.numSteps = parseInt(val);
    stepInputs.innerHTML = '';
    currentStepSel.innerHTML = '<option value="">Select current step</option>';

    for (let i = 0; i < settings.numSteps; i++) {
      const id = `stepLabel${i}`;
      const wrap = document.createElement('div');
      wrap.style.margin = '10px 0';
      wrap.innerHTML = `
        <label for="${id}">Step ${i + 1} Label:</label>
        <input type="text" id="${id}" value="Step ${i + 1}" style="width:50%;margin-right:10px">
      `;
      stepInputs.appendChild(wrap);

      const opt = document.createElement('option');
      opt.value = i + 1;
      opt.textContent = i + 1;
      currentStepSel.appendChild(opt);
    }

    copyBtn.disabled = false;
    updateBtn.disabled = false;
  }

  function generateStepIndicator() {
    let variantClass = settings.variant ? ` ${settings.variant}` : '';
    let html = `<div class="usa-step-indicator${variantClass}"><ol class="usa-step-indicator__segments">`;

    for (let i = 0; i < settings.numSteps; i++) {
      const label = d.querySelector(`#stepLabel${i}`).value.trim();
      let status = 'incomplete';
      if (i + 1 < settings.currentStep) status = 'complete';
      else if (i + 1 === settings.currentStep) status = 'current';

      let segmentClass = 'usa-step-indicator__segment';
      if (status === 'complete') segmentClass += ' usa-step-indicator__segment--complete';
      if (status === 'current') segmentClass += ' usa-step-indicator__segment--current';

      html += `
        <li class="${segmentClass}"${status === 'current' ? ' aria-current="true"' : ''}>
          <span class="usa-step-indicator__segment-label">
            ${label}
            ${status === 'complete' ? '<span class="usa-sr-only"> completed</span>' : ''}
            ${status === 'incomplete' ? '<span class="usa-sr-only"> not completed</span>' : ''}
          </span>
        </li>
      `;
    }

    const currentLabel = d.querySelector(`#stepLabel${settings.currentStep - 1}`).value.trim();

    html += `
      </ol>
      <div class="usa-step-indicator__header">
        <h4 class="usa-step-indicator__heading">
          <span class="usa-step-indicator__heading-counter">
            <span class="usa-sr-only">Step </span>
            <span class="usa-step-indicator__current-step">${settings.currentStep}</span>
            <span class="usa-step-indicator__total-steps"> of ${settings.numSteps}</span>
          </span>
          <span class="usa-step-indicator__heading-text">${currentLabel}</span>
        </h4>
      </div>
    </div>`;

    return html;
  }

  function updateOutput() {
    output.value = generateStepIndicator();
    updateBtn.disabled = true;
  }

  stepNumSel.addEventListener('change', generateStepInputs);

  currentStepSel.addEventListener('change', (e) => {
    settings.currentStep = parseInt(e.target.value);
    updateOutput();
  });

  variantSel.addEventListener('change', (e) => {
    settings.variant = e.target.value;
    updateOutput();
  });

  updateBtn.addEventListener('click', () => {
    updateOutput();
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.value).then(() => {
      alert('HTML copied to clipboard!');
    });
  });

  closeBtn.addEventListener('click', () => {
    if (!copyBtn.disabled && confirm('You have unsaved changes. Close anyway?')) {
      document.body.removeChild(d);
    } else if (copyBtn.disabled) {
      document.body.removeChild(d);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(d);
    }
  });
})();
