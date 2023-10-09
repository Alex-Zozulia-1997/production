<script setup lang="ts">
import { ref, computed } from 'vue'
import Preview from '../components/previewCo.vue'
import PdfButton from '../components/pdfOperations.vue'

const listOfProducts = ref<string[]>([
  'Select a Product',
  'Residential Proxies',
  'Data Center proxies',
  'Dedicated Data Center Proxies',
  'Site Unblocker',
  'E-commerce API',
  'Web Scraping API',
  'Social Media API'
])
const name = ref<string>('Neobi Inc.')
const email = ref<string>('alex@smartproxy.com')
const phone = ref<string>('+37066253406')
const product = ref<string>(listOfProducts.value[0])
const bundleDiscountAmount = ref<number>(0)
const isBundleDiscount = ref<boolean>(false)

export interface BundleDiscount {
  isBundleDiscount: boolean
  discountAmount: number
}

export interface Tier {
  id: number
  price: number
  quantity: number
  discount: number
}

export interface Product {
  id: number
  name: string
  commitment: string
  tiers: Tier[]
}

let nextProductId = 1
let nextTierId = 1

const bundleDiscountTotal = computed<BundleDiscount>(() => ({
  isBundleDiscount: isBundleDiscount.value,
  discountAmount: bundleDiscountAmount.value
}))

const products = ref<Product[]>([
  {
    id: nextProductId++,
    name: product.value,
    commitment: 'No Commitment',
    tiers: [
      {
        id: nextTierId++,
        price: 0,
        quantity: 0,
        discount: 0
      }
    ]
  }
])

const backgroundPDF = ref<boolean>(true)

const removeSpecificTier = (productIndex: number, tierIndex: number) => {
  products.value[productIndex].tiers.splice(tierIndex, 1)
}
// early returns
const addDiscount = (productIndex: number, tierIndex: number) => {
  const discountInput = document.getElementById(`discount-${productIndex}-${tierIndex}`)
  const discountButton = document.getElementById(`discountButton-${productIndex}-${tierIndex}`)

  if (discountInput && discountInput.parentElement) {
    if (discountInput.parentElement.classList.contains('no-show')) {
      // Showing the discount input
      discountInput.parentElement.classList.remove('no-show')
      if (discountButton) {
        discountButton.textContent = 'Remove Discount'
        discountButton.classList.add('remove-button')
        discountButton.classList.remove('add-button')
      }
    } else {
      // Hiding that discount input
      discountInput.parentElement.classList.add('no-show')
      if (discountButton) {
        discountButton.textContent = 'Add Discount'
        discountButton.classList.remove('remove-button')
        discountButton.classList.add('add-button')
        products.value[productIndex].tiers[tierIndex].discount = 0 // Reset the discount
      }
    }
  }
}

const addNewTierToProduct = (productIndex: number) => {
  const newTier = {
    id: nextTierId++,
    price: 0,
    quantity: 0,
    discount: 0
  }
  products.value[productIndex].tiers.push(newTier)
}

const addProduct = () => {
  products.value.push({
    id: nextProductId++,
    name: listOfProducts.value[0],
    commitment: 'No Commitment',
    tiers: [
      {
        id: nextTierId++,
        price: 0,
        quantity: 0,
        discount: 0
      }
    ]
  })
}

const removeProduct = (productIndex: number) => {
  products.value.splice(productIndex, 1)
}
</script>

<template>
  <form id="input-form">
    <h1 class="infor-title">Offer Details:</h1>
    <div class="initial-info">
      <label for="name">Client Name: <input v-model="name" id="name" type="text" /></label>
      <label for="email">Your Email: <input v-model="email" id="email" type="email" /></label>
      <label for="phone">Your Phone: <input v-model="phone" id="phone" type="text" /></label>
    </div>
    <div class="product" v-for="(product, productIndex) in products" :key="'product-' + product.id">
      <label class="box">
        <select class="product-options" v-model="product.name">
          <option v-for="prod in listOfProducts" :value="prod" :key="prod">
            {{ prod }}
          </option>
        </select>
      </label>

      <div class="tier-box" v-for="(tier, tierIndex) in product.tiers" :key="'tier-' + tier.id">
        <div class="label-container">
          <label id="product-label">
            Price/unit (USD):
            <input id="price" v-model.number="tier.price" type="number" min="0" />
          </label>

          <label>
            Quantity:
            <input id="q-ty" v-model.number="tier.quantity" type="number" min="0" />
          </label>
          <!-- think about the issues with thte button as check -->
          <label class="no-show">
            Discount:
            <input
              v-model.number="tier.discount"
              :id="`discount-${productIndex}-${tierIndex}`"
              type="number"
              max="99"
              placeholder="0"
            />
          </label>
        </div>
        <div class="remove-tier-btn-container">
          <button
            class="add-button button-shared"
            @click="addDiscount(productIndex, tierIndex)"
            type="button"
            :id="`discountButton-${productIndex}-${tierIndex}`"
          >
            Add Discount
          </button>

          <button
            class="remove-button button-shared"
            @click="removeSpecificTier(productIndex, tierIndex)"
          >
            Remove Tier
          </button>
        </div>
      </div>
      <div class="lower-btns">
        <button
          class="add-button button-shared"
          type="button"
          @click="addNewTierToProduct(productIndex)"
        >
          Add tier
        </button>
        <button class="remove-button button-shared" @click="removeProduct(productIndex)">
          Remove Product
        </button>
      </div>
    </div>

    <button class="add-button dwn-button" type="button" @click="addProduct">Add Product</button>
    <div id="corner-cases">
      <label for="bg"
        >Standard Background:
        <input id="bg" type="checkbox" v-model="backgroundPDF" />
      </label>
      <label for="bundle"
        >Add bundle Discount:
        <input id="bundle-discount" type="checkbox" v-model="isBundleDiscount" />
        <div :class="{ 'no-show': !bundleDiscountTotal.isBundleDiscount }">
          <label
            >Discount:
            <input
              v-model.number="bundleDiscountAmount"
              id="bundleDiscountAmount"
              type="number"
              placeholder="0"
            />
          </label>
        </div>
      </label>
    </div>
    <PdfButton />
  </form>

  <Preview
    :name="name"
    :email="email"
    :products="products"
    :bg="backgroundPDF"
    :phone="phone"
    :bundleDiscountTotal="bundleDiscountTotal"
  />
</template>

<style>
#corner-cases {
  display: flex;
  justify-content: space-around;
}
.label-container {
  display: flex;
  justify-content: space-between;
}
.dwn-button {
  font-size: 34px;
}
.initial-info {
  display: flex;
  justify-content: space-between;
}
.initial-info input {
  width: 60%;
}
.white-background {
  background-color: white;
}
.infor-title {
  text-align: center;
  text-transform: uppercase;
  background-image: linear-gradient(-225deg, #06000b 29%, #df0a0a 67%);
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  display: inline-block;
  font-size: 72px;
}
@keyframes textclip {
  to {
    background-position: 200% center;
  }
}
#input-form {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 1rem;
  width: 35vw;
}
form label {
  width: 100%;
  font-size: 18px;
  font-weight: 800;
}
.initial-info label input {
  width: 90%;
  font-size: 16px;
}
.no-show {
  display: none;
}
.label-container input {
  width: 90%;
}
.remove-tier-btn-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.lower-btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}
.tier-box {
  border: solid;
  padding: 15px;
  margin-bottom: 10px;
}

form label {
  margin-left: 0;
}
.product-options {
  width: 65%;
  margin-bottom: 5%;
  text-align: center;
}
.product-label {
  margin-bottom: 5%;
}
.product {
  border: solid;
  padding: 3%;
}

.button-shared {
  display: inline-block;
  cursor: pointer;
  outline: 0;
  font-weight: 800;
  font-size: 16px;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.07) 0px 2px 4px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 1.5px 0px;
  transition-duration: 0.1s;
  height: 35px;
  padding: 7px;
  margin-left: 10px;
}

.add-button {
  color: #2ea44f;
  background-color: #ffffff;
  border: 2px solid #2ea44f;
}

.add-button:hover {
  background-color: #2ea44f;
  color: #fff;
}

.remove-button {
  color: #ff4742;
  background: 0 0;
  border: 2px solid #ff4742;
}

.remove-button:hover {
  background-color: #ff4742;
  color: #fff;
}

.box {
  display: flex;
  justify-content: center;
}

.box select {
  background-color: #2ea44f;
  color: white;
  padding: 10px;
  width: 90%;
  border: none;
  border-radius: 3%;
  font-size: 40px;
  font-weight: 700;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  appearance: button;
  outline: none;
}

.box select option {
  padding: 30px;
}
h1 {
  text-align: left;
  font-size: 76px;
  font-weight: 800;
  color: rgb(189 56 1);
}
</style>
