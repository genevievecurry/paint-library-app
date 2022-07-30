<script context="module" lang="ts">
  export async function load({ params, fetch, url }) {
    const { pathname } = url;
    const response = await fetch(`/manufacturer/${params.slug}.json`);

    if (response.ok) {
      return {
        props: {
          manufacturer: await response.json(),
          pathname,
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
  import { timeAgo } from '$lib/utility';

  export let pathname;
  export let manufacturer;
</script>

<svelte:head>
  <title>{manufacturer.name} - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title={manufacturer.name} {pathname} />

  {#if manufacturer.sellPaint}
    <section class="mb-16">
      <h2 class="font-bold text-3xl mb-6">Paints</h2>

      {#if manufacturer._count.paints === 0}
        <div class="p-3 grid place-items-center border-2">
          <div class="text-center m-3">
            <p class="font-bold text-2xl"
              >No paints from {manufacturer.name} added to the library yet.</p>
          </div>
        </div>
      {:else}
        <div class="overflow-y-auto">
          <table class="border-collapse table-auto w-full text-sm relative">
            <thead>
              <tr class="border-b-2 border-black">
                <th class="sticky top-0">&nbsp;</th>
                <th class="sticky top-0 font-bold p-3 pl-1 text-left">Name</th>
                {#if manufacturer._count.lines > 0}<th
                    class="px-3 text-xs text-left">Line</th
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
                        <a
                          href={generateUrl({
                            prefix: 'paint',
                            target: paint,
                          })}>
                          {#if paint?.primarySwatchCard?.imageKitUpload?.filePath}
                            <img
                              loading="lazy"
                              src={paint?.primarySwatchCard?.imageKitUpload
                                ?.filePath
                                ? `https://ik.imagekit.io/paintlibrary/tr:w-200,h-200${paint?.primarySwatchCard?.imageKitUpload?.filePath}`
                                : ''}
                              class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 hover:opacity-0 overflow-hidden text-xxs leading-tight"
                              alt={paint.name} />
                          {/if}
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
                  <td
                    class="px-3 text-center"
                    title={paint.lightfastRating.label}>
                    {@html paint.lightfastRating.code !== 'X' &&
                    paint.lightfastRating.code !== 'NR'
                      ? paint.lightfastRating.code
                      : '<span class="text-gray-400">&bull;</span>'}</td>
                  <td
                    class="px-3 text-center"
                    title={paint.transparencyRating.label}>
                    {@html paint.transparencyRating.code !== 'X'
                      ? paint.transparencyRating.code
                      : '<span class="text-gray-400">&bull;</span>'}
                  </td>
                  <td
                    class="px-3 text-center"
                    title={paint.stainingRating.label}>
                    {@html paint.stainingRating.code !== 'X'
                      ? paint.stainingRating.code
                      : '<span class="text-gray-400">&bull;</span>'}
                  </td>
                  <td
                    class="px-3 text-center"
                    title={paint.granulationRating.label}>
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
      {/if}
    </section>
  {/if}

  {#if manufacturer.sellPaper}
    <section>
      <h2 class="font-bold text-3xl mb-6">Paper</h2>
      {#if manufacturer._count.swatchCard === 0}
        <div class="p-3 grid place-items-center border-2">
          <div class="text-center m-3">
            <p class="font-bold text-2xl"
              >No swatch cards using paper from {manufacturer.name} added to the
              library yet.</p>
          </div>
        </div>
      {:else}
        <div
          class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6">
          {#each manufacturer.swatchCard as swatchCard}
            <a
              class={`cursor-pointer border-2 border-black p-1 relative`}
              href={generateUrl({ prefix: 'paint', target: swatchCard.paint })}>
              <div class="h-full flex flex-col">
                <div>
                  <div class="aspect-w-8 aspect-h-10">
                    <img
                      alt={swatchCard.paint.name}
                      src={swatchCard.imageKitUpload.url}
                      class="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                  </div>
                </div>
                <div class="mt-2 flex flex-col h-full content-between p-1">
                  <div class="flex-grow">
                    {#if swatchCard.paperType?.name && swatchCard.paperWeightInLbs}
                      <p class=" mb-2 font-bold">
                        {swatchCard.paperType?.name} ({swatchCard.paperWeightInLbs}
                        lb.)
                      </p>
                    {/if}
                    <p class="text-xs font-bold">
                      {swatchCard.paint.manufacturer.name}</p>
                    <p class="truncate text-xs text-gray-500"
                      >{swatchCard.paint.name}</p>

                    {#if swatchCard.description}
                      <div
                        class="text-xs font-light mt-1 leading-tight truncate">
                        {swatchCard.description}</div>
                    {/if}
                  </div>
                  <div>
                    <p
                      class="text-xs mt-2 leading-tight font-light text-gray-500">
                      {#if swatchCard.isOriginal}
                        Original work uploaded
                        {timeAgo(swatchCard.createdAt)}
                        {#if swatchCard.author}
                          by @<a
                            href="/@{swatchCard.author.username}"
                            class="decorate-link"
                            >{swatchCard.author.username}</a>
                        {/if}
                        .
                      {:else}
                        Uploaded {timeAgo(swatchCard.createdAt)}.
                      {/if}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>
