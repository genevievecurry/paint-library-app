<script lang="ts">
  export let palette;
</script>

<div class="border-2 border-black p-1">
  <a href={`/palette/${palette.uuid}/${palette.slug}`}>
    <div class="grid grid-cols-6 gap-1">
      {#each palette?.paintsInPalette as paintPalette}
        <div
          class="paint-item"
          style={`background-color: ${paintPalette.paint.hex}`} />
      {/each}
    </div>
  </a>
  <div class="p-2">
    <h3 class="font-bold text-lg my-3"
      ><a
        href={`/palette/${palette.uuid}/${palette.slug}`}
        class="decorate-link"><span class="font-bold">{palette.title}</span></a
      ></h3>
    {#if palette.description}
      <p class="text-sm">{palette.description}</p>
    {/if}
    <div class="text-sm my-3">
      {palette?._count?.paintsInPalette} paints
      {#if palette.owner}
        | by @<a href={`/@${palette.owner.username}`} class="decorate-link"
          >{palette.owner.username}</a>
      {/if}
    </div>
  </div>
</div>

<style>
  .paint-item {
    aspect-ratio: 1;
  }
</style>
