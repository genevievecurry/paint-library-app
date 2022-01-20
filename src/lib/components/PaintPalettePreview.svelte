<script lang="ts">
  import { generateUrl } from '$lib/generate';
  import { createEventDispatcher } from 'svelte';

  export let paintOnPalette;
  export let showText: boolean;
  export let listView: boolean;
  export let editPaletteMode: boolean = false;

  const dispatch = createEventDispatcher();

  let { paint, order, id } = paintOnPalette;

  $: swatchImage = paint.swatchCard[0].imageKitUpload?.thumbnailUrl || '';

  function remove() {
    dispatch('remove', id);
  }
</script>

{#if listView}
  <tr>
    <td class="w-16 border-2 border-black p-px">
      <div
        class="aspect-w-16 aspect-h-16 "
        style={`background-color: ${paint.hex};`}>
        <a href={generateUrl({ prefix: 'paint', target: paint })}>
          {#if swatchImage}
            <img
              loading="lazy"
              src={swatchImage}
              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 hover:opacity-0"
              alt={paint.name} />
          {/if}
        </a>
      </div>
    </td>
    <td class="ml-3 px-3">{paint.manufacturer?.name}</td>
    <td class="ml-3 px-3">
      <a
        class="decorate-link"
        href={generateUrl({ prefix: 'paint', target: paint })}>{paint.name}</a>
    </td>
    <td class="ml-3 px-3">{paint.lightfastRating.label}</td>
    <td class="ml-3 px-3">{paint.transparencyRating.label}</td>
    <td class="ml-3 px-3">{paint.stainingRating.label}</td>
    <td class="ml-3 px-3">{paint.granulationRating.label}</td>
    <td class="ml-3 px-3">
      {#each paint.pigmentsOnPaints as pigmentsOnPaints, index}
        <a
          class="decorate-link"
          href={`/pigments/${pigmentsOnPaints.pigment.color?.slug}/${pigmentsOnPaints.pigment.slug}`}
          >{pigmentsOnPaints.pigment.slug}</a
        >{#if index + 1 < paint.pigmentsOnPaints.length},&nbsp;{/if}
      {/each}
    </td>
  </tr>
{:else}
  <div
    class="grid border-2 p-1 mb-3 w-full relative {showText
      ? 'h-full'
      : ''} {editPaletteMode
      ? 'cursor-move border-dashed border-orange-500'
      : 'border-black'}">
    {#if editPaletteMode}
      <div
        class="absolute left-2 top-2 z-10 h-6 w-6 bg-white border-2 border-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          ><polyline points="5 9 2 12 5 15" /><polyline
            points="9 5 12 2 15 5" /><polyline
            points="15 19 12 22 9 19" /><polyline
            points="19 9 22 12 19 15" /><line
            x1="2"
            y1="12"
            x2="22"
            y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></svg>
      </div>

      <div class="absolute top-2 right-2 z-10">
        <button
          class="h-6 w-6 bg-white border-2 hover:text-orange-500 border-black hover:border-orange-500 cursor-pointer"
          on:click={remove}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    {/if}
    <a
      href={editPaletteMode
        ? '#'
        : generateUrl({ prefix: 'paint', target: paint })}
      draggable={!editPaletteMode}
      class="h-full flex flex-col {editPaletteMode
        ? 'pointer-events-none'
        : 'pointer-events-auto'}">
      <div class="flex-1">
        <div
          class="aspect-w-8 aspect-h-14 "
          style={`background-color: ${paint.hex};`}>
          {#if swatchImage}
            <img
              draggable={!editPaletteMode}
              loading="lazy"
              src={swatchImage}
              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all {editPaletteMode
                ? ''
                : 'opacity-100 hover:opacity-0'}"
              alt={paint.name} />
          {/if}
        </div>
      </div>
      {#if showText}
        <div class="mt-2 flex flex-col h-full content-between">
          <div class="block text-xs leading-tight font-medium flex-grow"
            >{paint.name}</div>
          <div class="block text-xxs leading-none mt-1 ">
            {paint.manufacturer?.name}
          </div>
        </div>
      {/if}
    </a>
  </div>
{/if}
