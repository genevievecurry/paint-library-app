<script>
  export let lightfastRating, transparencyRating, stainingRating, granulationRating;
</script>

<section class="ratings">
  <h2>Ratings</h2>

  <table>
    <tr>
      <td>Lightfastness</td>
      <td>
        {lightfastRating.label}
        <small>{lightfastRating.description}</small>
      </td>
    </tr>
    <tr>
      <td>Transparency</td>
      <td>
        {transparencyRating.label}
        <small>{transparencyRating.description}</small>
      </td>
    </tr>
    <tr>
      <td>Staining</td>
      <td>
        {stainingRating.label}
        {#if stainingRating.description}
          <small>{stainingRating.description}</small>
        {/if}
      </td>
    </tr>
    <tr>
      <td>Granulation</td>
      <td>
        {stainingRating.label}
        {#if granulationRating.description}
          <small>{granulationRating.description}</small>
        {/if}
      </td>
    </tr>
  </table>
</section>

<style>
  .ratings {
    padding: 10px;
		border: 1px solid black;
		margin: 10px;
  }
</style>