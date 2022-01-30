<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const url = `/@${params.username}/swatches.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          swatchData: await response.json(),
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
  import { generateUrl } from '$lib/generate';
  import { adminIcon } from '$lib/icons';
  import { timeAgo } from '$lib/utility';

  export let swatchData;

  $: data = swatchData;
</script>

{#if data.swatchCards.length === 0}
  <span class="text-gray-400 font-light">
    This user has not yet saved any palettes.
  </span>
{:else}
  <div
    class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6">
    {#each data.swatchCards as swatchCard}
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
              <p class="text-gray-500 text-xs"
                >{swatchCard.paint.manufacturer.name}</p>
              <p class="font-bold">{swatchCard.paint.name}</p>
              {#if swatchCard.description}
                <p class="text-sm mt-1 leading-tight"
                  >{swatchCard.description}</p>
              {/if}
              {#if swatchCard.paperType?.name && swatchCard.paperWeightInLbs}
                <p class="text-sm mt-2">
                  {swatchCard.paperType?.name} ({swatchCard.paperWeightInLbs} lb.)
                </p>
              {/if}
            </div>
            <div>
              <p class="text-xs mt-2 leading-tight">
                {#if swatchCard.isOriginal}
                  Original work uploaded
                  {timeAgo(swatchCard.createdAt)}.
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
