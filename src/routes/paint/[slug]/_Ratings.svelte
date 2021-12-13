<script>
  export let lightfastRating,
    transparencyRating,
    stainingRating,
    granulationRating;
</script>

<section class="mt-8">
  <h2 class="font-bold text-2xl">Ratings</h2>

  <table class="table-fixed border-collapse border border-black mt-4">
    <tr>
      <th class="text-left border border-black px-4 py-3">Lightfastness</th>
      <td class="border border-black px-4 py-3">
        {lightfastRating.label}
        {#if lightfastRating.description}
          - {lightfastRating.description}
        {/if}
      </td>
    </tr>
    <tr>
      <th class="text-left border border-black px-4 py-3">Transparency</th>
      <td class="border border-black px-4 py-3">
        {transparencyRating.label}
        {#if transparencyRating.description}
          - {transparencyRating.description}
        {/if}
      </td>
    </tr>
    <tr>
      <th class="text-left border border-black px-4 py-3">Staining</th>
      <td class="border border-black px-4 py-3">
        {stainingRating.label}
        {#if stainingRating.description}
          - {stainingRating.description}
        {/if}
      </td>
    </tr>
    <tr>
      <th class="text-left border border-black px-4 py-3">Granulation</th>
      <td class="border border-black px-4 py-3">
        {granulationRating.label}
        {#if granulationRating.description}
          - {granulationRating.description}
        {/if}
      </td>
    </tr>
  </table>
</section>
