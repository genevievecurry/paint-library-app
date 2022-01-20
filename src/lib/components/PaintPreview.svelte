<script lang="ts">
  import { generateUrl } from '$lib/generate';

  export let paint;
  export let index;
  export let hovered = false;
  export let type = 'default';

  let swatchImage;

  if (paint.swatchCard) {
    if (paint.swatchCard.length > 0 && type === 'default') {
      swatchImage = paint.swatchCard[0].imageKitUpload?.url;
    }
    if (paint.swatchCard.length > 0 && type === 'simple') {
      swatchImage = paint.swatchCard[0].imageKitUpload?.thumbnailUrl;
    }
  }
</script>

{#if type === 'default' && paint !== null}
  <div
    class="table border-2 border-black p-1 break-inside mb-3 w-full"
    data-num={index + 1}>
    <a
      href={generateUrl({ prefix: 'paint', target: paint })}
      class="h-full flex flex-col">
      <div class="flex-1">
        <div
          class="aspect-w-16 aspect-h-16"
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
      <div class="p-1">
        <span class="decorate-link">{paint.manufacturer?.name}</span>
        <span class="block text-sm">{paint.name}</span>
      </div>
    </a>
  </div>
{/if}

{#if type === 'simple' && paint !== null}
  <div
    class="aspect-w-16 aspect-h-16 "
    style={`background-color: ${paint.hex};`}>
    {#if swatchImage}
      <img
        loading="lazy"
        src={swatchImage}
        class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 {hovered
          ? 'opacity-0'
          : ''}"
        alt={paint.name} />
    {/if}
  </div>
{/if}
