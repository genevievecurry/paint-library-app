<script lang="ts">
  export let palette;
  import { adminIcon } from '$lib/icons';
  import { onMount } from 'svelte';
  import PaintPreview from './PaintPreview.svelte';
  import { pluralize } from '$lib/utility';

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
      {#each palette?.paintsInPalette as paintPalette, index}
        <PaintPreview
          type="simple"
          paint={paintPalette.paint}
          {index}
          {hovered} />
      {/each}
      {#if shadowPaints.length > 0}
        {#each shadowPaints as _shadowPaint}
          <div class="placeholder bg-stone-100" />
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
      {pluralize(palette._count.paintsInPalette, 'paint')}
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
  .placeholder {
    aspect-ratio: 1;
  }
</style>
