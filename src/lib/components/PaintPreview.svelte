<script lang="ts">
  import { generateUrl } from '$lib/generate';
  import { pigmentCode } from '$lib/utility';

  export let paint;
  export let index;
  export let type = 'default';

  const swatchImage = paint?.primarySwatchCard?.imageKitUpload?.filePath
    ? `https://ik.imagekit.io/paintlibrary/tr:w-200,h-200${paint?.primarySwatchCard?.imageKitUpload?.filePath}`
    : '';
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
              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 text-white text-xs leading-tight"
              alt={paint.name} />
          {/if}
        </div>
      </div>
      <div class="p-1 leading-4 flex flex-col">
        <div class="flex-1">
          <span class="decorate-link">{paint.name}</span>
          <span class="block text-xs mt-1">
            {paint.manufacturer?.name}
          </span>
          {#if paint.line}
            <span class="block text-xs font-light">{paint.line?.name}</span>
          {/if}
        </div>
        <div>
          {#if paint.pigmentsOnPaints?.length > 0}
            {#each paint.pigmentsOnPaints as pigmentsOnPaints, index}
              <a
                class="decorate-link text-xs"
                href={`/pigments/${pigmentsOnPaints.pigment.color?.slug}/${pigmentsOnPaints.pigment.slug}`}>
                {#if pigmentsOnPaints.pigment.type === 'CINATURAL' || pigmentsOnPaints.pigment.type === 'CIPIGMENT'}
                  {@html pigmentCode(
                    pigmentsOnPaints.pigment.type,
                    pigmentsOnPaints.pigment.number,
                    pigmentsOnPaints.pigment.color.code,
                    {
                      html: false,
                    },
                  )}{:else}{pigmentsOnPaints.pigment.name}{/if}</a
              >{#if index + 1 < paint._count.pigmentsOnPaints},&nbsp;{/if}
            {/each}
          {/if}
        </div>
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
        class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 text-white text-xs leading-tight"
        alt={paint.name} />
    {/if}
  </div>
{/if}
