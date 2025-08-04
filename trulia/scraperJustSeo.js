let seoData = {}
let productData = {}

try {
  const seoElement = document.querySelector(
    '[data-testid="hdp-seo-residence-schema"]'
  )
  if (seoElement) seoData = JSON.parse(seoElement.innerText)
} catch (e) {
  console.error('❌ Failed to parse residence SEO JSON', e)
}

try {
  const productElement = document.querySelector(
    '[data-testid="hdp-seo-product-schema"]'
  )
  if (productElement) productData = JSON.parse(productElement.innerText)
} catch (e) {
  console.error('❌ Failed to parse product SEO JSON', e)
}

// Extract "Listed" value (as dom)
let dom = ''
const props = productData?.additionalProperty || []
const listedProp = props.find((p) => p.name === 'Listed')
if (listedProp?.value) dom = listedProp.value

// Define column order for reference
const columns = [
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
]

console.log('🧩 SEO Data:', seoData)
console.log('📦 Product Data:', productData)
console.log(seoData.image || 'No image found')
