<script>
  export let tags;
</script>

<section>
  <h2>Artist Tags</h2>

  <ul>
    {#each tags as tag}
      <li>{tag.name}</li>
    {/each}
  </ul>
</section>
