<script context="module" lang="ts">
  export async function load({ params, fetch, url }) {
    const response = await fetch(
      `/pigments/${params.colorSlug}/${params.pigmentSlug}.json`,
    );
    const { pathname } = url;

    if (response.ok) {
      return {
        props: {
          slug: params.pigmentSlug,
          pigment: await response.json(),
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
  import PaintPreview from '$lib/components/PaintPreview.svelte';
  import { pigmentCode } from '$lib/utility';
  import { session } from '$app/stores';
  import { settingsIcon } from '$lib/icons';

  export let pigment: PigmentComponent;
  export let pathname;
  export let slug;

  let editable = $session.user?.role === 'ADMIN';

  const displayHex = pigment.hex ? pigment.hex : pigment.color.hex;

  const singlePigmentPaints = pigment.paints.filter(
    (paint) => paint.paint._count.pigmentsOnPaints === 1,
  );

  const multiPigmentPaints = pigment.paints.filter(
    (paint) => paint.paint._count.pigmentsOnPaints > 1,
  );
</script>

<svelte:head>
  <title>Pigment {pigment.name} - Paint Library</title>
</svelte:head>

<Header title={pigment.name} {pathname}>
  {#if editable}
    <a
      href={`/admin/pigments/${slug}`}
      title="Contribute Swatch"
      aria-label="Contribute Swatch"
      class="pop inline-flex justify-center p-2 lg:px-3 lg:py-1 text-sm">
      {@html settingsIcon('h-5 w-5')}
      <span class="hidden lg:inline-block ml-1">Edit</span>
    </a>
  {/if}
</Header>
<section class="grid gap-3 grid-cols-2 md:grid-cols-4 2xl:grid-cols-6">
  <div class="relative col-span-1">
    <div class="border-2 border-black p-1">
      <div
        class="aspect-w-16 aspect-h-16 "
        style={`background-color: ${displayHex};`}>
        {#if pigment.imageKitUploadId}
          <img
            loading="lazy"
            src={pigment.imageKitUpload.url}
            class="w-full h-full object-center object-cover lg:w-full lg:h-full transition-all opacity-100 hover:opacity-0"
            alt={pigment.name} />
        {/if}
      </div>
    </div>
  </div>
  <div class="ml-0 lg:ml-3 col-span-2 md:col-span-3">
    <table class="table-auto border-collapse border border-gray-400 w-full">
      <tr class="block md:table-row">
        <th
          class="inline-block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
          ><span class="whitespace-nowrap">CI Name</span></th>
        <td
          class="inline-block md:table-cell md:border border-gray-400 px-4 py-3 md:text-center align-top">
          <span class="border-2 border-black font-bold px-2">
            {#if pigment.type === 'CINATURAL' || pigment.type === 'CIPIGMENT'}
              {@html pigmentCode(
                pigment.type,
                pigment.number,
                pigment.color.code,
                {
                  html: true,
                },
              )}
            {/if}
          </span>
        </td>
        <td
          class="block md:table-cell border-b md:border border-gray-400 px-4 py-3 w-full align-top">
          <p class="mb-2">
            CI stands for "Color Index". It's a short code that easily
            identifies the pigment. Not all pigments have one.
          </p>

          {#if pigment.number}
            <ul class="list-disc ml-3 pl-3 text-gray-600 font-light text-sm">
              {#if pigment.type === 'CIPIGMENT'}
                <li class="mb-1 leading-snug">
                  <strong>P</strong> designates that this pigment may be organic
                  or inorganic, and may be composed of naturally occuring minerals,
                  synthetic materials, or lakes.
                </li>
              {/if}

              {#if pigment.type === 'CINATURAL'}
                <li class="mb-1 leading-snug">
                  <strong>N</strong> designates that this is a naturally occuring
                  pigment, composed of plant, animal, or organic natural earths.
                </li>
              {/if}

              <li class="mb-1 leading-snug">
                <strong>{pigment.color.code}</strong> is shorthand for {pigment
                  .color.label}.
              </li>
              <li class="mb-1 leading-snug"
                ><strong>{pigment.number.toString().replace('.', ':')}</strong> is
                the CI serial number.</li>
            </ul>
          {/if}
        </td>
      </tr>
      <tr class="block md:table-row">
        <th
          class="inline-block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
          ><span class="whitespace-nowrap">Toxicity</span></th>
        <td
          class="inline-block md:table-cell md:border border-gray-400 px-4 py-3 md:text-center align-top">
          <span class="border-2 border-black font-bold px-2">
            {#if pigment.toxicity === 'A'}
              Low
            {:else if pigment.toxicity === 'B'}
              Possible
            {:else if pigment.toxicity === 'C'}
              High
            {:else if pigment.toxicity === 'D'}
              Extreme
            {:else}
              ?
            {/if}
          </span></td>
        <td
          class="block md:table-cell border-b md:border border-gray-400 px-4 py-3 w-full align-top">
          <p
            >The general rule of thumb to follow is to not inhale, ingest, feed
            to pets or babies, pour on the ground, or leave on skin.</p>
          <p class="text-gray-600 font-light text-sm mt-2">
            All pigments should be assumed to be dangerous, and potentially
            lethal if mishandled. If the pigment has high or extreme toxicity,
            it might be better not to use it at all.</p>
        </td>
      </tr>
      <tr class="block md:table-row">
        <th
          class="inline-block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
          >Lightfastness</th>
        <td
          class="inline-block md:table-cell md:border border-gray-400 px-4 py-3 md:text-center align-top">
          {#if pigment.lightfastRating.code !== 'X'}
            <span class="border-2 border-black font-bold px-2"
              >{pigment.lightfastRating.code}</span>
          {:else}
            <span class="border-2 border-black font-bold px-2 text-gray-500"
              >?</span>
          {/if}
        </td>
        <td
          class="block md:table-cell border-b md:border border-gray-400 px-4 py-3 w-full align-top">
          {pigment.lightfastRating.label}
          <p class="text-gray-600 font-light text-sm"
            >{pigment.lightfastRating.description}</p>
        </td>
      </tr>
      <tr class="block md:table-row">
        <th
          class="inline-block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
          >Transparency</th>
        <td
          class="inline-block md:table-cell md:border border-gray-400 px-4 py-3 md:text-center align-top">
          {#if pigment.transparencyRating.code !== 'X'}
            <span class="border-2 border-black font-bold px-2"
              >{pigment.transparencyRating.code}</span>
          {:else}
            <span class="border-2 border-black font-bold px-2 text-gray-500"
              >?</span>
          {/if}
        </td>
        <td
          class="block md:table-cell md:border border-gray-400 px-4 py-3 align-top">
          {pigment.transparencyRating.label}
          <p class="text-gray-600 font-light text-sm"
            >{pigment.transparencyRating.description}</p>
        </td>
      </tr>
      {#if pigment.reviewed && pigment.description}
        <tr class="block md:table-row">
          <th
            class="block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
            >Description</th>

          <td
            class="block md:table-cell md:border border-gray-400 px-4 py-3"
            colspan="2">
            {pigment.description}
          </td>
        </tr>
      {/if}
      {#if pigment.reviewed && pigment.composition}
        <tr class="block md:table-row">
          <th
            class="block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
            >Composition</th>

          <td
            class="block md:table-cell md:border border-gray-400 px-4 py-3"
            colspan="2">
            {pigment.composition}
          </td>
        </tr>
      {/if}
      {#if pigment.reviewed && pigment.alternateNames}
        <tr class="block md:table-row">
          <th
            class="block md:table-cell text-left md:border border-gray-400 px-4 py-3 align-top"
            >Alternate Names</th>

          <td
            class="block md:table-cell md:border border-gray-400 px-4 py-3"
            colspan="2">
            {pigment.alternateNames}
          </td>
        </tr>
      {/if}
    </table>
  </div>
</section>

<section class="mt-10">
  <h2 class="font-bold text-3xl">Paints</h2>
  <p class="text-gray-500 font-light mt-2 mb-6">
    {#if pigment.paints.length > 0}
      The following paints likely use this pigment.
    {:else}
      No paint in this database is currently linked to this pigment.
    {/if}
  </p>

  {#if singlePigmentPaints.length > 0}
    <h3 class="font-bold text-xl mb-3">Single-Pigment Watercolors</h3>
    <p class="text-gray-500 font-light mt-2 mb-6 text-sm"
      >The paints listed here are not guaranteed to be single-pigment, but we
      found {pigment.name} listed as the only known pigment in our database.</p>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3">
      {#each singlePigmentPaints as paint, index}
        {#if paint.paint.published}
          <PaintPreview paint={paint.paint} {index} />
        {/if}
      {/each}
    </div>
  {/if}
</section>

<section class="mt-10">
  {#if multiPigmentPaints.length > 0}
    <h3 class="font-bold text-xl mb-3">Multi-Pigment Watercolors</h3>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3">
      {#each multiPigmentPaints as multiPigmentPaint, index}
        {#if multiPigmentPaint.paint.published}
          <PaintPreview paint={multiPigmentPaint.paint} {index} />
        {/if}
      {/each}
    </div>
  {/if}
</section>

<section class="mt-10 max-w-2xl">
  <h2 class="font-bold text-3xl">More Information</h2>
  <p class="font-light my-4">
    Information on this website related to pigments has the distict possibility
    of being incorrect, out of date, or baffling. It is offered for the main
    purpose of being able to thoughtfully compare paints based on their
    composition, which also might be incorrect or out of date.
  </p>
  <p class="font-light my-4">
    Please do your own independent research about pigments if you are interested
    in mixing your own paints. Check out the <a
      href="http://www.artiscreation.com/Color_index_names.html"
      class="decorate-link"
      target="_blank"
      rel="noreferrer noopener">Art is Creation Pigment Database</a
    >, or
    <a
      href="https://handprint.com/HP/WCL/water.html"
      class="decorate-link"
      target="_blank"
      rel="noreferrer noopener">handprint</a
    >.
  </p>
  <p class="font-light my-4">
    If you want to help update pigment information, or want to just share
    something that can be fixed, you can send an email to <a
      href="mailto:librarian@paintlibrary.art"
      class="decorate-link cursor-pointer">librarian@paintlibrary.art</a
    >.
  </p>
</section>
