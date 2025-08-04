let seoData = {}
let productData = {}
let listingDetails = {}

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

try {
  document
    .querySelectorAll('[data-testid="structured-amenities-table-category"]')
    .forEach((categoryEl) => {
      const categoryName =
        categoryEl.querySelector('.textStyle_body')?.innerText?.trim() ||
        'Unknown Category'
      const subcategories = categoryEl.querySelectorAll(
        '[data-testid="structured-amenities-table-subcategory"]'
      )

      if (subcategories.length > 0) {
        listingDetails[categoryName] = {}
        subcategories.forEach((subEl) => {
          const subName =
            subEl.querySelector('.textStyle_body')?.innerText?.trim() || 'Misc'
          const subObj = {}

          subEl.parentElement.querySelectorAll('span').forEach((span) => {
            const text = span.innerText?.trim()
            if (text && text.includes(':')) {
              const [key, ...rest] = text.split(':')
              subObj[key.trim()] = rest.join(':').trim()
            }
          })

          if (Object.keys(subObj).length > 0) {
            listingDetails[categoryName][subName] = subObj
          }
        })
        if (Object.keys(listingDetails[categoryName]).length === 0)
          delete listingDetails[categoryName]
      } else {
        const catObj = {}
        categoryEl.querySelectorAll('span').forEach((span) => {
          const text = span.innerText?.trim()
          if (text && text.includes(':')) {
            const [key, ...rest] = text.split(':')
            catObj[key.trim()] = rest.join(':').trim()
          }
        })
        if (Object.keys(catObj).length > 0)
          listingDetails[categoryName] = catObj
      }
    })
} catch (e) {
  console.error('❌ Failed to parse listing details', e)
}

// Extract Listed value
let listedValue = ''
const additionalProps = productData?.additionalProperty || []
const listedProp = additionalProps.find((p) => p.name === 'Listed')
if (listedProp?.value) {
  listedValue = listedProp.value
}

// Build dataMap
const dataMap = {
  name: seoData.name || '',
  image: seoData.image || '',
  price: seoData.offers?.price
    ? `$${seoData.offers.price.toLocaleString()}`
    : '',
  address: seoData.address?.streetAddress?.split(',')[0] || '',
  cityState: `${seoData.address?.addressLocality || ''}, ${
    seoData.address?.addressRegion || ''
  }`.trim(),
  status: 'To Review',
  link: seoData.url || '',
  propType: '',
  dom:
    listedValue || listingDetails['Days on Market']?.['Days on Market'] || '',
  desc: seoData.description?.replace(/\s+/g, ' ') || '',
  notes: '',
}

console.log('✅ Extracted Data:')
console.table(dataMap)
console.log('🧩 Full SEO Data:', seoData)
console.log('📦 Full Product Data:', productData)
console.log('📋 Listing Details:', listingDetails)
console.log(dataMap.image || 'No image found')
