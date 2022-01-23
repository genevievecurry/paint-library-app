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

  export let pigment: PigmentComponent;
  export let pathname;
</script>

<!-- Todo: figure out breadcrumbs and use Header component -->
<Header title="{pigment.slug} {pigment.name}" {pathname} />

<section class="grid gap-3 grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
  <div class="border-2 border-black p-1 relative h-56 col-span-2 lg:col-span-1">
    <div class="empty-swatch h-full" style={`background: ${pigment.hex}`} />
  </div>
  <div class="ml-0 lg:ml-3 col-span-2 lg:col-span-3 xl:col-span-3">
    <table class="table-fixed border-collapse border border-gray-400 w-full">
      <tr>
        <th class="text-left border border-gray-400 px-4 py-3"
          ><span class="whitespace-nowrap">C.I. Generic Name</span></th>
        <td class="border border-gray-400 px-4 py-3">
          {#if pigment.type === 'CIPIGMENT'}
            Pigment {pigment.color.label} {pigment.number}, {pigment.name}
          {/if}
          {#if pigment.type === 'CINATURAL'}
            Natural {pigment.color.label} {pigment.number}, {pigment.name}
          {/if}
        </td>
      </tr>
    </table>
    {#if pigment.type === 'CIPIGMENT'}
      <p class="mt-6">
        Pigments can be organic or Inorganic. Most modern pigments are given
        this usage designation by the Color Index. They can be completely
        synthetic, naturally occurring minerals, or lakes based on the synthetic
        derivatives of natural dyes. Pigments are designated with C.I. Generic
        name which consists of the usage class "Pigment" and the basic hue
        followed by the CI serial number (i.e. Pigment Red 106, Cadmium Red).
        The pigment CI generic names are often abbreviated with the usage class
        P + the hue abbreviation + the serial number. (i.e. PR83 for Pigment Red
        83)
      </p>
    {/if}
    {#if pigment.type === 'CINATURAL'}
      <p class="mt-6">
        These are naturally occurring organic pigments and dyes. With a few
        exceptions, most are plant or animal extracts or dyes that need to be
        fixed to a substrate to become pigments (i.e. Madder Lake). A few are
        organic natural earths such as Cassel earth (Van Dyke Brown). They are
        designated with C.I. Generic name of which consists of the usage class
        "Natural" and basic hue, followed by the CI serial number (i.e. Natural
        Brown 8). Natural pigment CI generic names are often abbreviated with
        the usage class N + the hue abbreviation + the serial number. (i.e. NBr
        8)
      </p>
    {/if}
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
  {#if pigment.paints.length > 0}
    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-3">
      {#each pigment.paints as paint, index}
        {#if paint.paint.published}
          <PaintPreview paint={paint.paint} {index} />
        {/if}
      {/each}
    </div>
  {/if}
</section>
