<script>
  export let ratings;
</script>

<section class="ratings">
  <h2>Ratings</h2>

  <table>
    <tr>
      <td>Lightfastness</td>
      <td>
        {ratings.lightfastRating.label}
        <small>{ratings.lightfastRating.description}</small>
      </td>
    </tr>
    <tr>
      <td>Transparency</td>
      <td>
        {ratings.transparencyRating.label}
        <small>{ratings.transparencyRating.description}</small>
      </td>
    </tr>
    <tr>
      <td>Staining</td>
      <td>
        {ratings.stainingRating.label}
        {#if ratings.stainingRating.description}
          <small>{ratings.stainingRating.description}</small>
        {/if}
      </td>
    </tr>
    <tr>
      <td>Granulation</td>
      <td>
        {ratings.stainingRating.label}
        {#if ratings.granulationRating.description}
          <small>{ratings.granulationRating.description}</small>
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