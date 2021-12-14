<script>
  export let tags;
</script>

<section class="mt-8">
  <h2 class="font-bold text-2xl">Artist Tags</h2>
  <ul class="mt-4">
    {#each tags as tag}
      <li class="inline-block">
        <a
          class="m-1 py-2 px-3 border border-black"
          href="{`/tag/${tag.tag.slug}`}">{tag.tag.label}</a>
      </li>
    {/each}
  </ul>
</section>
