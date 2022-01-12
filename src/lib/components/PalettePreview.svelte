<script lang="ts">
  export let palette;
  import { adminIcon } from '$lib/icons';
  import { onMount } from 'svelte';

  const visiblePaints = 18;

  let paintsInPaletteCount: number, lotsOfPaints: boolean, diff: number;

  $: shadowPaints = [];
  $: hovered = false;

  onMount(() => {
    paintsInPaletteCount = palette?._count?.paintsInPalette || 0;
    lotsOfPaints = paintsInPaletteCount > visiblePaints;
    diff = visiblePaints - paintsInPaletteCount;

    if (paintsInPaletteCount < visiblePaints) {
      for (let index = 0; index < diff; index++) {
        shadowPaints.push(index);
      }
    }
  });
</script>

<div class="border-2 border-black p-1">
  <a
    href={`/palette/${palette.uuid}/${palette.slug}`}
    class="relative block"
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}>
    <div class="grid grid-cols-6 grid-rows-3 gap-1">
      {#each palette?.paintsInPalette as paintPalette}
        <div
          class="aspect-w-16 aspect-h-16 "
          style={`background-color: ${paintPalette.paint.hex};`}>
          {#if paintPalette.paint.swatchCard[0].imageKitUpload?.thumbnailUrl}
            <img
              loading="lazy"
              src={paintPalette.paint.swatchCard[0].imageKitUpload
                ?.thumbnailUrl}
              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 {hovered
                ? 'opacity-0'
                : ''}"
              alt={paintPalette.paint.name} />
          {/if}
        </div>
      {/each}
      {#if shadowPaints.length > 0}
        {#each shadowPaints as _shadowPaint}
          <div class="paint-item bg-stone-100" />
        {/each}
      {/if}
    </div>
    {#if lotsOfPaints}
      <div
        class="absolute right-2 bottom-2 text-sm font-light bg-white px-3 py-1">
        +{paintsInPaletteCount - visiblePaints}
      </div>
    {/if}
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
        {#if palette.owner.role === 'ADMIN'}
          {@html adminIcon('h-4 w-4 inline-block')}
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .paint-item {
    aspect-ratio: 1;
  }
</style>
