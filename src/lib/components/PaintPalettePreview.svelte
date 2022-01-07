<script lang="ts">
  import { generateUrl } from '$lib/utility';

  export let paint;
  export let showText: boolean;
  export let listView: boolean;

  let swatchImage;

  if (paint.swatchCard.length > 0) {
    swatchImage = paint.swatchCard[0].imageKitUpload?.url;
  }
</script>

{#if listView}
  <tr>
    <td class="w-16">
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
  <div class="table border-2 border-black p-1 break-inside mb-3 w-full">
    <a
      href={generateUrl({ prefix: 'paint', target: paint })}
      class="h-full flex flex-col">
      <div class="flex-1">
        <div
          class="aspect-w-8 aspect-h-16"
          style={`background-color: ${paint.hex};`}>
          {#if swatchImage}
            <img
              loading="lazy"
              src={swatchImage}
              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 hover:opacity-0"
              alt={paint.name} />
          {/if}
        </div>
      </div>
      {#if showText}
        <div class="mt-2">
          <span class="block text-xs">{paint.manufacturer?.name}</span>
          <span class="block text-xs">{paint.name}</span>
        </div>
      {/if}
    </a>
  </div>
{/if}
