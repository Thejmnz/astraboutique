export function getEffectivePrice(product) {
  if (product.on_sale && product.sale_price) return product.sale_price
  return product.price
}

export function isOnSale(product) {
  return product.on_sale && product.sale_price && product.sale_price < product.price
}

export function formatPrice(price) {
  return `$${price?.toLocaleString('es-CO')}`
}
