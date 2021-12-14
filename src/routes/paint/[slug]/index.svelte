<script context="module">
  export async function load({ page, fetch }) {
    const url = `/paint/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.slug,
          paint: await response.json(),
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
  import { setContext } from 'svelte';
  import SwatchCards from './_SwatchCards.svelte';
  import Pigments from './_Pigments.svelte';
  import Notes from './_Notes.svelte';

  export let slug: string;
  export let paint: PaintComponent;

  setContext('slug', slug);
  setContext('editable', true);

  if (paint) setContext('hex', paint.hex);

  const {
    lightfastRating,
    transparencyRating,
    stainingRating,
    granulationRating,
    name,
    manufacturer,
    manufacturerDescription,
    communityDescription,
    manufacturerPigmentDescription,
  } = paint;
</script>

{#if paint}
  <header class="my-7">
    <div>
      <div class="mb-4 font-light">
        <a
          href="/"
          class="underline text-gray-500 hover:text-white hover:bg-black inline-block pr-2"
          >Paint Library</a>
        <span class="text-gray-400">/</span>
        <span class="inline-block ml-2">{name}</span>
      </div>
      <h1 class="font-extrabold text-5xl">
        {name}
      </h1>
      <span class="block mt-2">{manufacturer.name}</span>
    </div>
  </header>
  <SwatchCards swatchCardsOnPaint={paint.swatchCardsOnPaint} />
  <div class="md:flex">
    <div class="flex-auto">
      <section class="mt-8">
        <h2 class="font-bold text-2xl">Ratings</h2>

        <table class="table-fixed border-collapse border border-black mt-4">
          <tr>
            <th class="text-left border border-black px-4 py-3"
              >Lightfastness</th>
            <td class="border border-black px-4 py-3">
              {lightfastRating.label}
              {#if lightfastRating.description}
                - {lightfastRating.description}
              {/if}
            </td>
          </tr>
          <tr>
            <th class="text-left border border-black px-4 py-3"
              >Transparency</th>
            <td class="border border-black px-4 py-3">
              {transparencyRating.label}
              {#if transparencyRating.description}
                - {transparencyRating.description}
              {/if}
            </td>
          </tr>
          <tr>
            <th class="text-left border border-black px-4 py-3">Staining</th>
            <td class="border border-black px-4 py-3">
              {stainingRating.label}
              {#if stainingRating.description}
                - {stainingRating.description}
              {/if}
            </td>
          </tr>
          <tr>
            <th class="text-left border border-black px-4 py-3">Granulation</th>
            <td class="border border-black px-4 py-3">
              {granulationRating.label}
              {#if granulationRating.description}
                - {granulationRating.description}
              {/if}
            </td>
          </tr>
        </table>
      </section>

      {#if manufacturerDescription}
        <section class="mt-8">
          <h2 class="font-bold text-2xl">Manufacturer Description</h2>
          <span class="text-xs text-gray-500 mt-4 block">
            From {manufacturer.name}:
          </span>
          <div class="mt-2">{@html manufacturerDescription}</div>
          <div>{manufacturerPigmentDescription}</div>
        </section>
      {/if}

      {#if communityDescription}
        <section class="mt-8">
          <h2 class="font-bold text-2xl">Community Description</h2>
          <div class="mt-2">{@html communityDescription}</div>
        </section>
      {/if}
    </div>
    <div class="flex-none md:w-96 md:pl-8">
      <Pigments pigmentsOnPaints={paint.pigmentsOnPaints} />
      <!-- <section class="mt-8">
        <h2 class="font-bold text-2xl">Artist Tags</h2>
        <ul class="mt-4">
          {#each tags as tag}
            <li class="inline-block">
              <a
                class="m-1 py-2 px-3 border border-black"
                href="{`/tag/${tag.tag.slug}`}">{tag.tag.label}</a>
            </li>
          {/each}
        </ul>
      </section> -->
    </div>
  </div>
  <Notes notes={paint.notes} />
{:else}
  LOADING!
{/if}
