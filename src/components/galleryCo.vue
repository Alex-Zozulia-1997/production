<template>
  <h1 class="gallery-title">Our Past offers</h1>
  <div class="saved">
    <div v-for="storedOffer in storedOffersList" :key="storedOffer.id" :id="storedOffer.id">
      <div v-html="storedOffer.data"></div>
      <div class="btn-container">
        <button class="gallery-btn add-button" @click="downloadPDF(storedOffer.id)">
          Download
        </button>
        <!-- <button
          id="edit-btn"
          class="gallery-btn add-button edit-btn"
          @click="editOffer(storedOffer.id)"
        >
          Edit
        </button> -->
        <button class="gallery-btn remove-button" @click="deletePDF(storedOffer.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ref, onMounted } from 'vue'

//const offerToEdit = ref("") to be implemented later

const storedOffersList = ref<{ id: string; data: string }[]>([])
onMounted(() => {
  console.log('Mounting Gallery Component')

  const allKeys = Object.keys(localStorage).reverse()
  console.log('All keys in localStorage:', allKeys)
  // just in case there is something else in local storage
  const sortedKeys = allKeys.filter((key) => key.startsWith('pdfPreviewHTML-'))

  sortedKeys.sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))

  // Populate storedOffersList with sorted offers
  storedOffersList.value = sortedKeys.map((key) => ({
    id: key,
    data: localStorage.getItem(key) || ''
  }))

  console.log('Stored HTML List:', storedOffersList.value)
})

async function downloadPDF(id: string) {
  const parentDiv = document.getElementById(id)

  if (!parentDiv) {
    console.error(`Parent div with id "${id}" not found.`)
    return
  }

  const createdOffer: HTMLElement | null = parentDiv.querySelector('#pdf-preview')

  if (!createdOffer) {
    console.error('Element with id "pdf-preview" not found.')
    return
  }

  const canvas = await html2canvas(createdOffer, {
    scale: 6
  })

  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
  pdf.save(`downloaded-${id}.pdf`)
}

const deletePDF = (id: string) => {
  localStorage.removeItem(id)
  storedOffersList.value = storedOffersList.value.filter((item) => item.id !== id)
}
</script>

<style>
.btn-container {
  display: flex;
  justify-content: space-evenly;
}
.saved {
  display: grid;
  justify-self: center;
  grid-gap: 0px;
  grid-template-columns: repeat(1, 1fr);
  margin-top: 20px;
}

@media (width >= 1444px) {
  .saved {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (width >= 2000px) {
  .saved {
    grid-template-columns: repeat(3, 1fr);
  }
}
.gallery-btn {
  height: 50px;
  font-size: 42px;
}
#edit-btn {
  color: #2b7be3;
  border: 2px solid #2b7be3;
}
#edit-btn:hover {
  background-color: #2b7be3;
  color: #fff;
}
.gallery-title {
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
  font-size: 90px;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}
</style>
