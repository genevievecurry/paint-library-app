<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const { pathname } = url;
      const response = await fetch(
        '/admin/paints.json?set=0&take=200&all=true',
      );

      if (response.ok) {
        return {
          props: {
            paints: await response.json(),
            pathname,
          },
        };
      }

      return {
        status: response.status,
        error: new Error('Could not load.'),
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { generateUrl } from '$lib/generate';
  import { checkmarkIcon, closeIcon } from '$lib/icons';
  import { timeAgo } from '$lib/utility';
  export let pathname;
  export let paints;
</script>

<Header title="Paints" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1" />
        <td class="font-bold p-1">Name</td>
        <td class="font-bold p-1">Manufacturer</td>
        <td class="font-bold p-1">Line</td>
        <td class="font-bold p-1 leading-tight">Pigments</td>
        <td class="font-bold p-1 leading-tight">Swatches</td>
        <td class="font-bold p-1 leading-tight">In<br /> Palettes</td>
        <td class="font-bold p-1 leading-tight">Live</td>
        <td class="font-bold p-1 leading-tight">Mfr.<br />Desc.</td>
        <td class="font-bold p-1 leading-tight">Primary<br />Swatch?</td>
        <td class="font-bold p-1 leading-tight">Updated</td>
        <td class="font-bold p-1" />
        <td />
      </tr>
    </thead>
    <tbody>
      {#each paints as paint}
        <tr class="border-b border-gray-300">
          <td class="p-1"><input type="checkbox" /></td>
          <td class="p-1">{paint.id}</td>
          <td>
            <div class="w-5 mr-2">
              <div
                class="aspect-w-16 aspect-h-16"
                style={`background-color: ${paint.hex};`} />
            </div>
          </td>
          <td class="p-1">{paint.name}</td>
          <td class="p-1">{paint.manufacturer.name}</td>
          <td class="p-1">{paint.line?.name ? paint.line.name : ''}</td>
          <td class="p-1" class:muted={paint._count.pigmentsOnPaints === 0}
            >{paint._count.pigmentsOnPaints}</td>
          <td class="p-1" class:muted={paint._count.swatchCard === 0}
            >{paint._count.swatchCard}</td>
          <td class="p-1" class:muted={paint._count.paintsInPalette === 0}
            >{paint._count.paintsInPalette}</td>
          <td class="p-1"
            >{@html paint.published
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1"
            >{@html paint.manufacturerDescription
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1"
            >{@html paint.primarySwatchCard
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1">{timeAgo(paint.updatedAt)}</td>
          <td class="p-1">
            <a
              href={generateUrl({ prefix: 'paint', target: paint })}
              class="decorate-link">Link</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .muted {
    @apply text-gray-300;
  }
</style>
