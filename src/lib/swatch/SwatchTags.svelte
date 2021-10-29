<script>
  export let tags;
</script>

<section class="tags">
  <h2>Artist Tags</h2>

  <ul>
    {#each tags as tag}
      <li><a href={`/tag/${tag.slug}`}>{tag.label}</a></li>
    {/each}
  </ul>
</section>

<style>
  .tags {
    padding: 10px;
    border: 1px solid black;
    margin: 10px;
  }
</style>
