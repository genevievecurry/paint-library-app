<script lang="ts">
  export let paint;
</script>

<table class="table-auto border-collapse border border-gray-400 mt-4 w-full">
  <tr>
    <th class="text-left border border-gray-400 px-4 py-3">Lightfastness</th>
    <td class="border border-gray-400 px-4 py-3">
      {#if paint.lightfastRating.code !== 'X'}
        <span class="border-2 border-black font-bold px-1 mr-1"
          >{paint.lightfastRating.code}</span>
      {:else}
        <span class="border-2 border-gray-400 font-bold px-1 mr-1 text-gray-500"
          >?</span>
      {/if}
    </td>
    <td class="border border-gray-400 px-4 py-3 w-full">
      {paint.lightfastRating.label}
      <p class="text-gray-500 font-light text-sm"
        >{paint.lightfastRating.description}</p>
    </td>
  </tr>
  <tr>
    <th class="text-left border border-gray-400 px-4 py-3">Transparency</th>
    <td class="border border-gray-400 px-4 py-3">
      {#if paint.transparencyRating.code !== 'X'}
        <span class="border-2 border-black font-bold px-1"
          >{paint.transparencyRating.code}</span>
      {:else}
        <span class="border-2 border-gray-400 font-bold px-1 mr-1 text-gray-500"
          >?</span>
      {/if}
    </td>
    <td class="border border-gray-400 px-4 py-3">
      {paint.transparencyRating.label}
      <p class="text-gray-500 font-light text-sm"
        >{paint.transparencyRating.description}</p>
    </td>
  </tr>
  <tr>
    <th class="text-left border border-gray-400 px-4 py-3">Staining</th>
    <td class="border border-gray-400 px-4 py-3">
      {#if paint.stainingRating.code !== 'X'}
        <span class="border-2 border-black font-bold px-1"
          >{paint.stainingRating.code}</span>
      {:else}
        <span class="border-2 border-gray-400 font-bold px-1 mr-1 text-gray-500"
          >?</span>
      {/if}
    </td>
    <td class="border border-gray-400 px-4 py-3">
      {paint.stainingRating.label}
      <p class="text-gray-500 font-light text-sm"
        >{paint.stainingRating.description}</p>
    </td>
  </tr>
  <tr>
    <th class="text-left border border-gray-400 px-4 py-3">Granulation</th>
    <td class="border border-gray-400 px-4 py-3">
      {#if paint.granulationRating.code !== 'X'}
        <span class="border-2 border-black font-bold px-1"
          >{paint.granulationRating.code}</span>
      {:else}
        <span class="border-2 border-gray-400 font-bold px-1 mr-1 text-gray-500"
          >?</span>
      {/if}
    </td>
    <td class="border border-gray-400 px-4 py-3">
      {paint.granulationRating.label}
      <p class="text-gray-500 font-light text-sm"
        >{paint.granulationRating.description}</p>
    </td>
  </tr>
</table>
