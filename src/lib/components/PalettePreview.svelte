<script lang="ts">
  export let palette;
</script>

<div class="border border-black p-2">
  <a href={`/palette/${palette.slug}`}>
    <div class="grid grid-cols-6 gap-1">
      {#each palette.paintsInPalette as paintPalette}
        <div
          class="paint-item"
          style={`background-color: ${paintPalette.paint.hex}`} />
      {/each}
    </div>

    <h3 class="font-bold text-lg my-3">{palette.title}</h3>
    {#if palette.description}
      <p class="text-sm">{palette.description}</p>
    {/if}
    <div class="text-sm my-3">
      {palette._count.paintsInPalette} paints
      {#if palette.owner}
        | by {palette.owner?.displayName}
      {/if}
    </div>
  </a>
</div>

<style>
  .paint-item {
    aspect-ratio: 1;
  }
</style>
