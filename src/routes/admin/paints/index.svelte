<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const { pathname } = url;
      const response = await fetch(`/admin/paints.json?all=true`);

      if (response.ok) {
        return {
          props: {
            body: await response.json(),
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
  export let body;

  const paints = body.paints;
  const paintCount = body.paintCount;
</script>

<Header title="Paints" {pathname} />
Total Paints: {paintCount}
<section>
  <table class="sticky-header-table border-separate w-full text-xs mb-10">
    <thead class="text-left border-b relative z-10">
      <tr>
        <td class="sticky top-0 pl-1 pr-3 py-3 bg-white border-y border-l"
          >ID</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y" />
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Name</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Manufacturer</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Line</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Pigments</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Swatches</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Palettes</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Live</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Mfr.<br />Desc.</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Primary<br />Swatch?</td>
        <td class="sticky top-0 py-1 whitespace-nowrap bg-white border-y"
          >Updated</td>
        <td
          class="sticky top-0 py-1 whitespace-nowrap bg-white border-y border-r" />
        <td />
      </tr>
    </thead>
    <tbody>
      {#each paints as paint}
        <tr class="border-b border-gray-300">
          <td class="py-1 border-l border-b p-1">{paint.id}</td>
          <td class="border-b">
            <div class="w-5 mr-2">
              <div
                class="aspect-w-16 aspect-h-16"
                style={`background-color: ${paint.hex};`} />
            </div>
          </td>
          <td class="p-1 border-b">{paint.name}</td>
          <td class="p-1 border-b">{paint.manufacturer.name}</td>
          <td class="p-1 border-b"
            >{paint.line?.name ? paint.line.name : ''}</td>
          <td
            class="p-1 border-b"
            class:muted={paint._count.pigmentsOnPaints === 0}
            >{paint._count.pigmentsOnPaints}</td>
          <td class="p-1 border-b" class:muted={paint._count.swatchCard === 0}
            >{paint._count.swatchCard}</td>
          <td
            class="p-1 border-b"
            class:muted={paint._count.paintsInPalette === 0}
            >{paint._count.paintsInPalette}</td>
          <td class="p-1 border-b"
            >{@html paint.published
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1 border-b"
            >{@html paint.manufacturerDescription
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1 border-b"
            >{@html paint.primarySwatchCard
              ? checkmarkIcon()
              : closeIcon('h-6 w-6 text-gray-300')}</td>
          <td class="p-1 border-b">{timeAgo(paint.updatedAt)}</td>
          <td class="p-1 border-b border-r">
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

  .sticky-header-table {
    border-spacing: 0px;
  }
</style>
