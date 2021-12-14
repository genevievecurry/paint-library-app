<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    const url = `/pigments/${page.params.colorSlug}/${page.params.pigmentSlug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.pigmentSlug,
          pigment: await response.json(),
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
  export let pigment: PigmentComponent;

  function randomDimension() {
    const dimensions = [300, 350, 400, 500, 600];
    return dimensions[Math.floor(Math.random() * dimensions.length)];
  }
</script>

<header class="my-7">
  <div>
    <div class="mb-4 font-light">
      <a
        href="/"
        class="underline text-gray-500 hover:text-white hover:bg-black inline-block pr-2"
        >Paint Library</a>
      <span class="text-gray-400">/</span>
      <a
        href="/pigments"
        class="underline text-gray-500 hover:text-white hover:bg-black inline-block px-2"
        >Pigments</a>
      <span class="text-gray-400">/</span>
      <a
        href="/pigments/{pigment.color.label.toLowerCase()}"
        class="underline text-gray-500 hover:text-white hover:bg-black inline-block px-2">
        {pigment.color.label}
      </a>
      <span class="text-gray-400">/</span>
      <span class="inline-block pl-2">{pigment.name}</span>
    </div>
    <h1 class="font-extrabold text-5xl">
      {pigment.slug}
      {pigment.name}
    </h1>
  </div>
</header>

<section class="grid gap-3 grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
  <div class="border border-black relative h-56 col-span-2 lg:col-span-1">
    <div class="empty-swatch h-full" style={`background: ${pigment.hex}`} />
  </div>
  <div class="ml-0 lg:ml-3 col-span-2 lg:col-span-3 xl:col-span-3">
    <table class="table-fixed border-collapse border border-black w-full">
      <tr>
        <th class="text-left border border-black px-4 py-3"
          ><span class="whitespace-nowrap">C.I. Generic Name</span></th>
        <td class="border border-black px-4 py-3">
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
  <div
    class="masonry sm:masonry-sm md:masonry-md lg:masonry-lg xl:masonry-xl 2xl:masonry-2xl">
    {#each pigment.paints as paint}
      <div class="table border border-black p-3 break-inside mb-3 w-full">
        <a sveltekit:prefetch href={`/paint/${paint.paint.slug}`}>
          <div
            class="w-full block h-32"
            style={`background-color: ${
              paint.paint.hex
            }; height: ${randomDimension()}px`}>
            <!-- To-do: Figure out how to pull in a swatch image, if there is one. -->
          </div>
          <div class="mt-2">
            <span class="block font-medium">
              {paint.paint.manufacturer?.name}
            </span>
            <span class="block text-sm">{paint.paint.productColorName}</span>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>
