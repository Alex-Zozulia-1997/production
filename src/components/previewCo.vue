<script setup lang="ts">
import { ref, defineProps } from 'vue'
import Table from '../components/tablePrev.vue'
import Footer from '../components/previewFooter.vue'
import type { Product, BundleDiscount } from '../components/clientInfo.vue'

const { name, email, products, bg, phone, bundleDiscountTotal } = defineProps<{
  name: string
  email: string
  products: Product[]
  bg: boolean
  phone: string
  bundleDiscountTotal: BundleDiscount
}>()

const dateObject = ref(new Date())
// mistake setting the date below
const getMonthName = (monthIndex: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return monthNames[monthIndex]
}

const validUntilObject = ref(new Date(dateObject.value.getTime()))
validUntilObject.value.setDate(validUntilObject.value.getDate() + 14)

const date = ref<string>(
  `${getMonthName(
    dateObject.value.getMonth()
  )} ${dateObject.value.getDate()}, ${dateObject.value.getFullYear()}`
)
const validUntil = ref<string>(
  `${getMonthName(
    validUntilObject.value.getMonth()
  )} ${validUntilObject.value.getDate()}, ${validUntilObject.value.getFullYear()}`
)
</script>
<template>
  <div :class="{ background: bg }" id="pdf-preview">
    <section id="top">
      <label id="issue-date"
        >Issued: <span id="bold">{{ date }}</span></label
      >
      <label id="valid-until"
        >Valid untill: <span id="bold">{{ validUntil }}</span></label
      >
    </section>
    <h1 id="co">Commercial Proposal <br />to</h1>
    <label id="client-name"> {{ name }}</label>
    <!-- <label id="email">Email: {{ email }}</label> -->

    <Table :products="products" :bundleDiscountTotal="bundleDiscountTotal"></Table>
    <Footer :email="email" :products="products" :phone="phone"></Footer>
  </div>
</template>

<style>
#pdf-preview {
  min-height: 891px;
  max-height: 891px;
  min-width: 630px;
  max-width: 630px;
  border: solid;
  border-width: 5px;

  background-size: contain;
  padding-top: 140px;
  margin: 50px;
  overflow: hidden;
}
.background {
  background-image: url('src/assets/Smartproxy.svg');
  /* does not show im npm run build */
}
#top {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-bottom: 10px;
  font-size: 16px;
}
#bold {
  font-weight: 900;
}
#co {
  color: black;
  padding-top: 15px;
  text-align: center;
  font-size: 30px;
  font-weight: 900;
  font-family: 'Times New Roman', Times, serif;
  line-height: 100%;
}
#client-name {
  display: block;
  text-align: center;
  padding-bottom: 50px;
  font-size: 40px;
  font-weight: 700;
  line-height: 95%;
  padding-top: 10px;
  margin-left: 0px;
}
#issue-date {
  margin-left: 3%;
}
</style>
