const fetchSustainabilityInformation = async (destination: string, origin: string) => {
  const apiURL = `http://localhost:4000/api/sustainability/search?destination=${destination}&origin=${origin}`;
  let result = 'Sorry score unavailable';
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    if (response.status === 422) {
      alert(data.message);
    } else if (data.data) {
      result = data.data.sustainabilityScore;
    }
    return result;
  } catch (err: any) {
    console.log(err);
    alert(err.message);
  }
};

const addTooltipStyle = () => {
  const css = `.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }
  
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
  
    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }`;
  const style = document.createElement('style');

  style.appendChild(document.createTextNode(css));

  return style;
};

const processForSkyScanner = async () => {
  const originInputEl = document.querySelector('#originInput-input');

  originInputEl?.addEventListener('focusout', () => {
    const originInputEl = document.querySelector('#originInput-input') as HTMLInputElement;
    if (originInputEl) {
      localStorage.setItem('skyscanner-origin', originInputEl.value);
    }
  });

  const destinationInputEl = document.querySelector('#destinationInput-input');

  destinationInputEl?.addEventListener('focusout', () => {
    const destinationInputEl = document.querySelector('#destinationInput-input') as HTMLInputElement;
    if (destinationInputEl) {
      localStorage.setItem('skyscanner-destination', destinationInputEl.value);
    }
  });

  const el = document.querySelector('#identity');
  const SustainabilityDivElm = document.createElement('div');
  const SustainabilityBtnElm = document.createElement('span');
  const destination = localStorage.getItem('skyscanner-destination');
  const origin = localStorage.getItem('skyscanner-origin');
  el?.appendChild(addTooltipStyle());
  let sustainabilityScore;
  if (destination && origin) {
    sustainabilityScore = await fetchSustainabilityInformation(destination, origin);
    SustainabilityBtnElm.textContent = `Sustainability Score is: ${sustainabilityScore}`;
    SustainabilityBtnElm.style.backgroundColor =
      sustainabilityScore === 'Sorry score unavailable' || undefined ? 'red' : '#0362e3';
    SustainabilityBtnElm.style.color = 'white';
    SustainabilityBtnElm.style.border = 'none';
    SustainabilityBtnElm.style.borderRadius = '5px';
    SustainabilityBtnElm.style.padding = '10px';
    SustainabilityBtnElm.style.fontSize = '14px';
    SustainabilityBtnElm.style.marginTop = '20px';
    SustainabilityBtnElm.style.marginBottom = '20px';
    SustainabilityBtnElm.style.display = 'inline-block';
    SustainabilityBtnElm.classList.add('tooltip');
    const toolTipElm = document.createElement('div');
    toolTipElm.textContent = 'Welcome to tooltip';
    toolTipElm.classList.add('tooltiptext');
    SustainabilityBtnElm.appendChild(toolTipElm);
    SustainabilityDivElm.appendChild(SustainabilityBtnElm);
    el?.appendChild(SustainabilityDivElm);
  }
};

const processForKayak = async () => {
  const originEl = document.querySelector('[aria-label="Flight origin input"]');

  originEl?.addEventListener('focusout', () => {
    const origins = document.querySelectorAll('.zEiP-origin  .c_neb-item-value');
    let originText = '';
    for (const origin of origins) {
      originText += origin.textContent + ';;';
    }
    localStorage.setItem('kayak-origins', originText);
  });

  const destinationEl = document.querySelector('[aria-label="Flight destination input"]');

  destinationEl?.addEventListener('focusout', () => {
    const destinations = document.querySelectorAll('.zEiP-destination .c_neb-item-value');
    let destinationsText = '';
    for (let dest of destinations) {
      destinationsText += dest.textContent + ';;';
    }
    localStorage.setItem('kayak-destinations', destinationsText);
  });

  const el = document.querySelector('.ev1_-mod-layout-default');

  const origins = localStorage.getItem('kayak-origins')?.split(';;');
  const destinations = localStorage.getItem('kayak-destinations')?.split(';;');
  if (!origins) {
    return;
  }
  if (!destinations) {
    return;
  }
  el?.appendChild(addTooltipStyle());
  let sustainabilityScore;
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i] === '') {
      continue;
    }
    const SustainabilityDivElm = document.createElement('div');
    const SustainabilityBtnElm = document.createElement('span');
    if (destinations[i] && origins[i]) {
      sustainabilityScore = await fetchSustainabilityInformation(destinations[i], origins[i]);
    }
    SustainabilityBtnElm.textContent = `Sustainability Score For ( destination: ${destinations[i]}  ) is: ${sustainabilityScore}`;
    SustainabilityBtnElm.style.backgroundColor =
      sustainabilityScore === 'Sorry score unavailable' || undefined ? 'red' : '#0362e3';
    SustainabilityBtnElm.style.color = 'white';
    SustainabilityBtnElm.style.border = 'none';
    SustainabilityBtnElm.style.borderRadius = '5px';
    SustainabilityBtnElm.style.padding = '10px';
    SustainabilityBtnElm.style.fontSize = '14px';
    SustainabilityBtnElm.style.marginTop = '20px';
    SustainabilityBtnElm.style.marginBottom = '20px';
    SustainabilityBtnElm.style.display = 'inline-block';
    SustainabilityBtnElm.classList.add(`tooltip`);
    const toolTipElm = document.createElement('div');
    toolTipElm.textContent = 'Welcome to tooltip';
    toolTipElm.classList.add(`tooltiptext`);
    SustainabilityBtnElm.appendChild(toolTipElm);
    SustainabilityDivElm.appendChild(SustainabilityBtnElm);
    el?.appendChild(SustainabilityDivElm);
  }
};

window.onload = async () => {
  if (window.location.hostname === 'www.skyscanner.de') {
    await processForSkyScanner();
  } else if (window.location.hostname === 'www.kayak.de') {
    await processForKayak();
  }
};

console.log(
  '****************************************\n\neco.mio - Main content script running\n\n****************************************',
);
