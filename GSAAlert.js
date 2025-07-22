javascript:(function () {
  if (document.querySelector('#uswds-alert-overlay')) return;

  const dialog = document.createElement('div');
  dialog.id = 'uswds-alert-overlay';
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border: 2px solid #1a4480;
    border-radius: 4px;
    z-index: 10000;
    max-width: 95%;
    width: 750px;
    height: 90vh;
    overflow: auto;
    font-family: Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif;
    box-sizing: border-box;
  `;

  dialog.innerHTML = `
    <style>
      #outputHTML, #alertMessage, select, input {
        box-sizing: border-box;
        max-width: 100%;
        width: 100%;
        overflow-x: hidden;
        word-wrap: break-word;
      }
      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .checkbox-container label {
        margin-left: 3px;
        white-space: nowrap;
      }
    </style>

    <h3 style="margin-top:0; color:#1a4480;">USWDS Alert Generator</h3>

    <div style="margin:10px 0">
      <label>Alert Type:</label>
      <select id="alertType" style="margin-bottom:10px">
        <option value="">Select Alert Type</option>
        <option value="error">Error</option>
        <option value="warning">Warning</option>
        <option value="success">Success</option>
        <option value="info">Info</option>
        <option value="emergency">Emergency</option>
      </select>
    </div>

    <div style="margin:10px 0; text-align:left;">
      <div class="checkbox-container" style="margin-bottom:10px;">
        <div style="display:flex;align-items:center;margin-right:15px;">
          <input type="checkbox" id="slimVariant">
          <label for="slimVariant">Slim Variant</label>
        </div>
        <div style="display:flex;align-items:center;">
          <input type="checkbox" id="hideIcon">
          <label for="hideIcon">Hide Icon</label>
        </div>
      </div>
    </div>

    <div style="margin:10px 0">
      <label>Alert Message:</label>
      <div style="margin-bottom:10px">
        <button id="boldBtn" class="usa-button usa-button--small">B</button>
        <button id="italicBtn" class="usa-button usa-button--small">I</button>
        <button id="underlineBtn" class="usa-button usa-button--small">U</button>
        <button id="linkBtn" class="usa-button usa-button--small">Link</button>
      </div>
      <div id="alertMessage" contenteditable="true"
        style="width:100%;height:100px;margin-bottom:10px;border:1px solid #ccc;padding:10px;overflow:auto;"
        placeholder="Enter your alert message here">
      </div>
    </div>

    <div style="margin:10px 0">
      <label>Heading (Optional):</label>
      <input type="text" id="alertHeading" placeholder="Enter optional heading">
    </div>

    <div style="margin:10px 0">
      <label>HTML Output:</label>
      <textarea id="outputHTML" style="height:200px;margin:10px 0;padding:10px;font-family:monospace"></textarea>
    </div>

    <button id="generateBtn" class="usa-button">Generate Alert</button>
    <button id="copyBtn" class="usa-button">Copy HTML</button>
    <button id="closeBtn" class="usa-button usa-button--secondary">Close</button>
  `;

  document.body.appendChild(dialog);

  function formatText(command) {
    document.execCommand(command, false, null);
  }

  function insertLink() {
    const url = prompt('Enter the URL for the link:', 'https://');
    if (url) document.execCommand('createLink', false, url);
  }

  function generateAlert() {
    const alertType = document.getElementById('alertType').value;
    const alertMessage = document.getElementById('alertMessage').innerHTML.trim();
    const alertHeading = document.getElementById('alertHeading').value.trim();
    const isSlim = document.getElementById('slimVariant').checked;
    const hideIcon = document.getElementById('hideIcon').checked;

    if (!alertType) {
      alert('Please select an alert type');
      return '';
    }
    if (!alertMessage) {
      alert('Please enter an alert message');
      return '';
    }

    let classNames = ['usa-alert', `usa-alert--${alertType}`];
    if (isSlim) classNames.push('usa-alert--slim');
    if (hideIcon) classNames.push('usa-alert--no-icon');

    let alertHTML = `<div class="${classNames.join(' ')}"><div class="usa-alert__body">`;
    if (alertHeading) {
      alertHTML += `<h4 class="usa-alert__heading">${alertHeading}</h4>`;
    }
    alertHTML += `<p class="usa-alert__text">${alertMessage}</p></div></div>`;
    return alertHTML;
  }

  const alertMessageDiv = document.getElementById('alertMessage');
  alertMessageDiv.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  });

  document.getElementById('boldBtn').addEventListener('click', () => formatText('bold'));
  document.getElementById('italicBtn').addEventListener('click', () => formatText('italic'));
  document.getElementById('underlineBtn').addEventListener('click', () => formatText('underline'));
  document.getElementById('linkBtn').addEventListener('click', insertLink);

  document.getElementById('generateBtn').addEventListener('click', () => {
    const output = generateAlert();
    if (output) {
      document.getElementById('outputHTML').value = output;
    }
  });

  document.getElementById('copyBtn').addEventListener('click', () => {
    const textarea = document.getElementById('outputHTML');
    textarea.select();
    document.execCommand('copy');
    alert('HTML copied to clipboard!');
  });

  document.getElementById('closeBtn').addEventListener('click', () => {
    document.body.removeChild(dialog);
  });

  const placeholderStyle = document.createElement('style');
  placeholderStyle.innerHTML = `
    [contenteditable]:empty:before {
      content: attr(placeholder);
      color: #888;
      display: block;
    }
  `;
  document.head.appendChild(placeholderStyle);

  alertMessageDiv.setAttribute('placeholder', 'Enter your alert message here');
})();
