<script lang="ts">
  export let _count;

  let activeSection = 'ownedPalettes';
</script>

<div class="border-b mb-10">
  <ul class="flex">
    <li
      class="py-3 px-6 border-b-4 {activeSection === 'ownedPalettes'
        ? 'border-black'
        : ''}"
      id="ownedPalettes">
      <a href="palettes">Palettes {_count.ownedPalettes}</a></li>
    <li
      class="py-3 px-6 border-b-4 {activeSection === 'savedPalettes'
        ? 'border-black'
        : ''}"
      id="savedPalettes">
      <a href="saved">Saved {_count.savedPalettes}</a></li>
    <li class="py-3 px-6 border-b-4" id="swatchCards">
      <a href="swatches">Swatch Cards {_count.swatchCards}</a></li>
    <li class="py-3 px-6 border-b-4" id="notes">
      <a href="notes">Notes {_count.notes}</a></li>
  </ul>
</div>

<slot />
