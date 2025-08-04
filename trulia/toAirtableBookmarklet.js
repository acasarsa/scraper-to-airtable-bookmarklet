javascript: (function () {
  var seoData = {};
  var productData = {};
  try {
    var seoElement = document.querySelector(
      '[data-testid="hdp-seo-residence-schema"]'
    );
    if (seoElement) seoData = JSON.parse(seoElement.innerText);
  } catch (e) {
    console.error('❌ Failed to parse residence SEO JSON', e);
  }

  try {
    var productElement = document.querySelector(
      '[data-testid="hdp-seo-product-schema"]'
    );
    if (productElement) productData = JSON.parse(productElement.innerText);
  } catch (e) {
    console.error('❌ Failed to parse product SEO JSON', e);
  }

  var dom = '';
  var props = (productData && productData.additionalProperty) || [];
  var listedProp = props.find(function (p) {
    return p.name === 'Listed';
  });
  if (listedProp && listedProp.value) dom = listedProp.value;

  var dataMap = {
    name: seoData.name || '',
    image: seoData.image || '',
    price:
      seoData.offers && seoData.offers.price
        ? '$' + seoData.offers.price.toLocaleString()
        : '',
    address:
      seoData.address && seoData.address.streetAddress
        ? seoData.address.streetAddress.split(',')[0]
        : '',
    cityState:
      ((seoData.address && seoData.address.addressLocality) || '') +
      ', ' +
      ((seoData.address && seoData.address.addressRegion) || ''),
    status: 'To Review',
    link: seoData.url || '',
    propType: '',
    dom: dom,
    desc: seoData.description ? seoData.description.replace(/\s+/g, ' ') : '',
    notes: '',
  };

  var columns = [
    'name',
    'image',
    'price',
    'status',
    'dom',
    'notes',
    'address',
    'cityState',
    'link',
    'propType',
    'desc',
  ];
  var tabbedRow = columns
    .map(function (k) {
      return dataMap[k] || '';
    })
    .join('\t');

  function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('✅ Copied to clipboard');
    } catch (err) {
      console.error('❌ Copy failed', err);
    }
    document.body.removeChild(textarea);
  }

  copyToClipboard(tabbedRow);
  console.log('🧩 SEO Data:', seoData);
  console.log('📦 Product Data:', productData);
  alert(seoData.image || 'No image found');
})();
