<script>
  export let stats;
</script>

<section>
  <h2>Stats</h2>

  <ul>
    {#each stats as stat}
      <li>{@html stat}</li>
    {/each}
  </ul>
</section>
