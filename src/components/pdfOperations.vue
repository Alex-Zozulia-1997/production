<script setup lang="ts">
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

async function captureElementAsCanvas(elementId: string, scale = 1) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error(`Element with ID "${elementId}" not found.`)

  const canvas = await html2canvas(element, {
    scale: scale
  })
  return canvas
}

function generateIDBasedOnTime() {
  return 'pdfPreviewHTML-' + Date.now().toString()
}

function storeElementHTML(id: string) {
  const element = document.getElementById('pdf-preview')
  if (element) {
    localStorage.setItem(id, element.outerHTML)
  }
}

async function downloadPDF() {
  const canvas = await captureElementAsCanvas('pdf-preview', 6)

  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
  pdf.save('download.pdf')
  storeElementHTML(generateIDBasedOnTime())
}

async function downloadPng() {
  const canvas = await captureElementAsCanvas('pdf-preview', 6)

  const link = document.createElement('a')
  link.download = 'download.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
  storeElementHTML(generateIDBasedOnTime())
}
</script>

<template>
  <div id="btn-dwn">
    <button class="add-button download-button" id="pdf-button" type="button" @click="downloadPDF">
      Download PDF
    </button>
    <button class="add-button download-button" id="png-button" type="button" @click="downloadPng">
      Download PNG
    </button>
  </div>
</template>

<style>
#btn-dwn {
  display: flex;
  justify-content: center;
}
.download-button {
  margin: 5px;
  width: 25%;
  min-height: 6%;
  font-size: 22px;
  font-weight: 600;
  background-color: rgb(189 56 1);
  color: aliceblue;
}
</style>
