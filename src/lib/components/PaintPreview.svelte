<script lang="ts">
  import { generateUrl } from '$lib/utility';

  export let paint;
  export let index;

  let swatchImage;

  if (paint.swatchCard.length > 0) {
    swatchImage = paint.swatchCard[0].imageKitUpload?.url;
  }
</script>

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
