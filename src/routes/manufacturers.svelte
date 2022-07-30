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
    <div class="sticky top-0 bg-white py-2">
      <h2 class="font-bold text-3xl">Paint Manufacturers</h2>
    </div>
    <table
      class="border-separate my-4 w-full table-fixed"
      style="border-spacing: 0px;">
      <thead class="text-left border-b relative">
        <tr>
          <th
            class="sticky top-12 px-3 py-3 whitespace-nowrap bg-white border-y border-l">
            Name</th>
          <th
            class="sticky top-12 px-3 py-3 whitespace-nowrap bg-white border-y">
            Paint Lines</th>
          <th
            class="sticky top-12 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y">
            Paints</th>

          <th
            class="sticky top-12 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y border-r">
            Swatch Cards</th>
        </tr>
      </thead>
      <tbody>
        {#each manufacturers as manufacturer}
          {#if manufacturer.sellPaint === true}
            <tr
              class="transition-all border-b cursor-pointer"
              on:click={() => goto(`/manufacturer/${manufacturer.slug}`)}>
              <td class="pl-1 pr-3 py-1 border-l border-b">
                <span class="decorate-link">{manufacturer.name}</span>
              </td>
              <td class="px-3 border-b">
                {#each manufacturer.lines as line, index}
                  {line.name}{index + 1 === manufacturer._count.lines
                    ? ''
                    : ', '}
                {/each}
              </td>
              <td class="px-3 text-center hidden sm:table-cell border-b">
                {manufacturer._count.paints > 0
                  ? manufacturer._count.paints
                  : ''}
              </td>

              <td
                class="px-3 text-center hidden sm:table-cell border-b border-r">
                {manufacturer._count.swatchCard > 0
                  ? manufacturer._count.swatchCard
                  : ''}
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </section>
  <section>
    <div class="sticky top-0 bg-white py-2">
      <h2 class="font-bold text-3xl">Paper Manufacturers</h2>
    </div>
    <table
      class="border-separate my-4 w-full table-fixed"
      style="border-spacing: 0px;">
      <thead class="text-left border-b relative">
        <tr>
          <th
            class="sticky top-12 px-3 py-3 whitespace-nowrap bg-white border-y border-l">
            Name</th>
          <th
            class="sticky top-12 px-3 py-3 whitespace-nowrap bg-white border-y">
            Paper Lines</th>
          <th
            class="sticky top-12 px-3 text-xs text-center hidden sm:table-cell whitespace-nowrap bg-white border-y border-r">
            Swatch Cards</th>
        </tr>
      </thead>
      <tbody>
        {#each manufacturers as manufacturer}
          {#if manufacturer.sellPaper === true}
            <tr
              class="transition-all border-b cursor-pointer"
              on:click={() => goto(`/manufacturer/${manufacturer.slug}`)}>
              <td class="pl-1 pr-3 py-1 border-l border-b">
                <span class="decorate-link">{manufacturer.name}</span>
              </td>
              <td class="px-3 border-b">
                {#each manufacturer.lines as line, index}
                  {line.name}{index + 1 === manufacturer._count.lines
                    ? ''
                    : ', '}
                {/each}
              </td>
              <td
                class="px-3 text-center hidden sm:table-cell border-b border-r">
                {manufacturer._count.swatchCard > 0
                  ? manufacturer._count.swatchCard
                  : ''}
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </section>
</div>
