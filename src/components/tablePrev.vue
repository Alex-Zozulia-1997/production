<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { Tier, Product, BundleDiscount } from '../components/clientInfo.vue'

interface Props {
  products: Product[]
  bundleDiscountTotal: BundleDiscount
}

const { products, bundleDiscountTotal } = defineProps<Props>()

const hasMultipleTiers = computed(() => {
  return products.some((product: Product) => product.tiers.length > 1)
})

console.log(bundleDiscountTotal.discountAmount)

const totalPrice = computed(() => {
  return products.reduce((total: number, product: Product) => {
    let productTotal = 0

    product.tiers.forEach((tier: Tier) => {
      const discountedPrice =
        typeof tier.discount === 'number' && tier.discount > 0
          ? tier.price * (1 - tier.discount / 100)
          : tier.price

      productTotal += Math.round(tier.quantity * discountedPrice)
    })

    return total + productTotal
  }, 0)
})
</script>

<template>
  <section id="table-preview">
    <div v-for="product in products" :key="'product-' + product.id">
      <h2>{{ product.name }}</h2>

      <table>
        <thead>
          <tr>
            <th>Commitment</th>
            <th>
              Price per
              {{
                product.name.includes('Dedicated')
                  ? 'IPs'
                  : product.name.includes('API')
                  ? 'K req.'
                  : 'GBs'
              }}
            </th>
            <th>Quantity</th>
            <th>Total price</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="tier in product.tiers" :key="'tier-' + tier.id">
            <tr>
              <td class="commitement">{{ product.commitment }}</td>
              <td class="price">{{ tier.price }} USD</td>
              <td class="qt">
                {{ tier.quantity }}
                {{
                  product.name.includes('Dedicated')
                    ? 'IPs'
                    : product.name.includes('API')
                    ? 'K req.'
                    : 'GBs'
                }}
              </td>
              <td class="price-final">{{ Math.round(tier.quantity * tier.price) }} USD</td>
            </tr>

            <!-- Discount Row: Displayed only if discount is available -->
            <tr v-if="tier.discount && tier.discount !== 0">
              <td class="commitement">Contract({{ tier.discount }}% Off)</td>
              <td class="price discounted">
                {{ (tier.price * (1 - tier.discount / 100)).toFixed(2) }} USD
              </td>
              <td class="qt">
                {{ tier.quantity }}
                {{
                  product.name.includes('Dedicated')
                    ? 'IPs'
                    : product.name.includes('API')
                    ? 'K req.'
                    : 'GBs'
                }}
              </td>
              <td class="price-final discounted">
                {{ Math.round(tier.quantity * tier.price * (1 - tier.discount / 100)) }} USD
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="total-price-container">
      <div class="show" id="total-price" v-if="totalPrice > 0 && !hasMultipleTiers">
        <div>
          <h2 class="total-price">Total: {{ totalPrice }} USD</h2>
        </div>

        <div
          class="show total-price"
          id="total-price-discounted"
          v-if="totalPrice > 0 && bundleDiscountTotal.isBundleDiscount"
        >
          <h2>
            Total
            <span class="discounted bundle">({{ bundleDiscountTotal.discountAmount }}% Off)</span>:
            <span class="discounted"
              >{{
                bundleDiscountTotal.discountAmount > 0
                  ? Math.round(totalPrice * (1 - bundleDiscountTotal.discountAmount / 100))
                  : totalPrice
              }}
              USD
            </span>
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.bundle {
  font-size: 18px;
}
.total-price-container {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: right;
}

.total-price {
  width: 100%;
  display: flex;
  justify-content: left;
  padding-right: 20px;
}
.discounted {
  font-weight: 800;
  color: rgb(27, 123, 27);
}
#footer a {
  color: blue;
  text-decoration: none;
}
#table-preview {
  margin-bottom: 20px;
  min-height: 440px;
  max-height: 440px;
  min-width: 600px;
  overflow: hidden;
  padding-left: 40px;
}
th {
  font-weight: 600;
  font-size: 16px;
  text-align: left;
}
tr {
  vertical-align: top;
}
.expanded {
  height: 30px;
}
td {
  justify-content: left;
  font-weight: 600;
}
table {
  width: 100%;
  font-size: 14px;
}
tbody {
  vertical-align: top;
  text-align: left;
}
h2 {
  text-align: left;
  font-size: 20px;
  font-weight: 800;
  color: rgb(189 56 1);
}
.total-price-container h2 {
  line-height: 1.2;
}
</style>
