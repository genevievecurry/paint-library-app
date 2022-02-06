<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const response = await fetch(`/manufacturer/${params.slug}.json`);

    if (response.ok) {
      return {
        props: {
          manufacturer: await response.json(),
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { generateUrl } from '$lib/generate';

  export let manufacturer;
</script>

<svelte:head>
  <title>{manufacturer.name} - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title={manufacturer.name} />

  <h2 class="font-bold text-3xl mb-6">Paints</h2>

  <table class="border-collapse table-auto w-full text-sm relative">
    <thead>
      <tr class="border-b-2 border-black">
        <th class="sticky top-0">&nbsp;</th>
        <th class="sticky top-0 font-bold p-3 pl-1 text-left">Name</th>
        {#if manufacturer._count.lines > 0}<th class="px-3 text-xs text-left"
            >Line</th
          >{/if}
        <th class="sticky top-0 px-3 text-xs">Lightfastness</th>
        <th class="sticky top-0 px-3 text-xs">Transparency</th>
        <th class="sticky top-0 px-3 text-xs">Staining</th>
        <th class="sticky top-0 px-3 text-xs">Granulating</th>
        <th class="sticky top-0 px-3 text-xs text-left">Pigments</th>
      </tr>
    </thead>
    <tbody>
      {#each manufacturer.paints as paint}
        <tr class="border-b border-gray-400">
          <td class="py-1">
            <div class="w-12 border-2 border-black p-px">
              <div
                class="aspect-w-16 aspect-h-16 "
                style={`background-color: ${paint.hex};`}>
                <a href={generateUrl({ prefix: 'paint', target: paint })}>
                  <img
                    loading="lazy"
                    src={paint?.primarySwatchCard?.imageKitUpload?.filePath
                      ? `https://ik.imagekit.io/paintlibrary/tr:w-200,h-200${paint?.primarySwatchCard?.imageKitUpload?.filePath}`
                      : ''}
                    class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 hover:opacity-0 overflow-hidden"
                    alt={paint.name} />
                </a>
              </div>
            </div>
          </td>
          <td class="px-3 pl-1">
            <a
              class="decorate-link"
              href={generateUrl({ prefix: 'paint', target: paint })}
              >{paint.name}</a>
          </td>
          {#if manufacturer._count.lines > 0}
            <td class="px-3"
              >{@html paint.line
                ? paint.line.name
                : '<div class="text-center"><span class="text-gray-400">&bull;</span></div>'}</td>
          {/if}
          <td class="px-3 text-center" title={paint.lightfastRating.label}>
            {@html paint.lightfastRating.code !== 'X' &&
            paint.lightfastRating.code !== 'NR'
              ? paint.lightfastRating.code
              : '<span class="text-gray-400">&bull;</span>'}</td>
          <td class="px-3 text-center" title={paint.transparencyRating.label}>
            {@html paint.transparencyRating.code !== 'X'
              ? paint.transparencyRating.code
              : '<span class="text-gray-400">&bull;</span>'}
          </td>
          <td class="px-3 text-center" title={paint.stainingRating.label}>
            {@html paint.stainingRating.code !== 'X'
              ? paint.stainingRating.code
              : '<span class="text-gray-400">&bull;</span>'}
          </td>
          <td class="px-3 text-center" title={paint.granulationRating.label}>
            {@html paint.granulationRating.code !== 'X'
              ? paint.granulationRating.code
              : '<span class="text-gray-400">&bull;</span>'}
          </td>
          <td class="px-3">
            {#each paint.pigmentsOnPaints as pigmentsOnPaints, index}
              <a
                class="decorate-link"
                href={`/pigments/${pigmentsOnPaints.pigment.color?.slug}/${pigmentsOnPaints.pigment.slug}`}
                >{pigmentsOnPaints.pigment.slug}</a
              >{#if index + 1 < paint.pigmentsOnPaints.length},&nbsp;{/if}
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
