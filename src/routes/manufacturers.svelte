<script context="module" lang="ts">
  export async function load({ fetch, url }) {
    const response = await fetch('/manufacturers.json');
    const { pathname } = url;
    const manufacturers = await response.json();

    if (response.ok) {
      return {
        props: {
          manufacturers,
          pathname,
        },
      };
    }
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { checkmarkIcon, closeIcon } from '$lib/icons';
  import Header from '$lib/components/Header.svelte';

  export let manufacturers;
  export let pathname;
</script>

<svelte:head>
  <title>Manufacturers - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Manufacturers" {pathname} />

  <section>
    <table
      class="border-separate my-4 w-full table-fixed"
      style="border-spacing: 0px;">
      <thead class="text-left border-b relative">
        <tr>
          <th
            class="sticky top-0 px-3 py-3 whitespace-nowrap bg-white border-y border-l">
            Name</th>

          <th
            class="sticky top-0 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y">
            Make Paint?</th>
          <th
            class="sticky top-0 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y">
            Paints in Library</th>

          <th
            class="sticky top-0 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y">
            Make Paper?</th>

          <th
            class="sticky top-0 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y border-r">
            Paper Swatch Cards in Library</th>
        </tr>
      </thead>
      <tbody>
        {#each manufacturers as manufacturer}
          <tr
            class="transition-all border-b cursor-pointer"
            on:click={() => goto(`/manufacturer/${manufacturer.slug}`)}>
            <td class="pl-1 pr-3 py-1 border-l border-b">
              <span class="decorate-link">{manufacturer.name}</span>
            </td>
            <td class="px-3 text-center sm:table-cell border-b">
              {#if manufacturer.sellPaint === true}
                {@html checkmarkIcon('h-6 w-6 inline-block text-green-500')}
              {:else}
                {@html closeIcon('h-4 w-4 inline-block text-gray-300')}
              {/if}
            </td>
            <td class="px-3 text-center sm:table-cell border-b">
              {#if manufacturer.sellPaint === true}
                {manufacturer._count.paints > 0
                  ? manufacturer._count.paints
                  : ''}
              {/if}
            </td>
            <td class="px-3 text-center sm:table-cell border-b">
              {#if manufacturer.sellPaper === true}
                {@html checkmarkIcon('h-6 w-6 inline-block text-green-500')}
              {:else}
                {@html closeIcon('h-4 w-4 inline-block text-gray-300')}
              {/if}
            </td>
            <td class="px-3 text-center sm:table-cell border-b border-r">
              {manufacturer._count.swatchCard > 0
                ? manufacturer._count.swatchCard
                : ''}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>
