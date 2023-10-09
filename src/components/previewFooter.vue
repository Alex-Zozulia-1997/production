<script setup lang="ts">
import { defineProps } from 'vue'

const { email, phone } = defineProps<{ email: string; phone: string }>()
</script>

<template>
  <div id="footer-pdf">
    <label class="website">Website:<a href="https://smartproxy.com/"> smartproxy.com</a></label>
    <label class="email">Contact Email: {{ email }}</label>
    <label class="phone">Contact Phone: {{ phone }}</label>
    <label class="address">Address: Antakalnio g. 17, Vilnius, LT</label>
    <!-- <div class="logo"><img src="@/assets/smartproxy-newsfeed.png" alt="logo" /></div> -->
  </div>
</template>

<style>
.logo {
  grid-area: logo;
  width: 100px;
  height: 40px;
}
#footer-pdf .logo img {
  max-width: 100%;
  max-height: 100%;
}
#footer-pdf {
  font-weight: 600;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, auto);
  grid-template-areas:
    'website phone '
    'email   address';
  padding: 8px;
  background-color: rgb(189 56 1);
  color: aliceblue;
  gap: 0px;
}

#footer-pdf label {
  font-weight: 600;
}
#footer .logo {
  font-weight: bold;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
}

#footer a {
  color: aliceblue;
  text-decoration: underline;
}
</style>
