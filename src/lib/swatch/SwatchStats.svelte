<script>
  export let stats;
</script>

<section class="stats">
  <h2>Stats</h2>

  <ul>
    {#each stats as stat}
      <li>{@html stat}</li>
    {/each}
  </ul>
</section>

<style>
  .stats {
    padding: 10px;
		border: 1px solid black;
		margin: 10px;
  }
</style>