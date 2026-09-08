function getCleanSVGs() {
  const svgElements = Array.from(document.querySelectorAll('svg'));
  return svgElements.map((svg, index) => {
    const clone = svg.cloneNode(true);
    
    // Remove unwanted noisy inline attributes
    ['id', 'class', 'style', 'data-name', 'xmlns:xlink'].forEach(attr => clone.removeAttribute(attr));
    if (!clone.getAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    const rawSvg = clone.outerHTML;
    
    // Format SVG attributes into standard React JSX syntax
    const jsxSvg = rawSvg
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=');

    return { id: index, raw: rawSvg, jsx: jsxSvg };
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract_svgs') {
    sendResponse({ svgs: getCleanSVGs() });
  }
});