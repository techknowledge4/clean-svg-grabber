document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const container = document.getElementById('container');

  // Inject content script into active tab
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });

  chrome.tabs.sendMessage(tab.id, { action: 'extract_svgs' }, (response) => {
    if (!response || !response.svgs || response.svgs.length === 0) {
      container.innerHTML = '<div class="empty">No SVGs found on this page.</div>';
      return;
    }

    response.svgs.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="preview">${item.raw}</div>
        <div class="btn-group">
          <button id="svg-${item.id}">SVG</button>
          <button id="jsx-${item.id}" class="secondary">JSX</button>
        </div>
      `;
      container.appendChild(card);

      document.getElementById(`svg-${item.id}`).addEventListener('click', () => {
        navigator.clipboard.writeText(item.raw);
        alert('Copied clean SVG code!');
      });

      document.getElementById(`jsx-${item.id}`).addEventListener('click', () => {
        navigator.clipboard.writeText(item.jsx);
        alert('Copied React JSX code!');
      });
    });
  });
});