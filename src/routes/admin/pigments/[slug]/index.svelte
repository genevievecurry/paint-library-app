<script context="module" lang="ts">
  export async function load({ params, session, url, fetch }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const create = params.slug === 'create';

      if (create) {
        // Empty form data
        return {
          props: {
            pathname: url.pathname,
            create: create,
            pigmentData: null,
          },
        };
      } else {
        // Look up pigment by slug to fill form data
        const response = await fetch(`/admin/pigments/${params.slug}.json`);
        if (response.ok) {
          return {
            props: {
              pathname: url.pathname,
              create: create,
              uuid: params.uuid,
              pigmentData: await response.json(),
            },
          };
        }
        return {
          status: response.status,
          error: new Error('Could not load.'),
        };
      }
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  import Header from '$lib/components/Header.svelte';
  import { generateSlug } from '$lib/generate';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { pigmentCode, connect } from '$lib/utility';

  export let pathname;
  export let create;
  export let pigmentData;

  let id,
    slug,
    type,
    name,
    number,
    hex,
    colorCode,
    composition,
    description,
    alternateNames,
    toxicity,
    notes,
    ciConstitutionNumber,
    reviewed,
    lightfastRatingCode,
    transparencyRatingCode;
  let disableSlug = create;

  function generatePigmentSlug() {
    if (type && number && colorCode) {
      slug = pigmentCode(type, number, colorCode, { html: false });
    } else {
      let value =
        name + (ciConstitutionNumber ? ` ${ciConstitutionNumber}` : '');
      slug = generateSlug({ value });
    }
    disableSlug = false;
  }

  if (pigmentData) {
    id = pigmentData.id;
    slug = pigmentData.slug;
    type = pigmentData.type;
    name = pigmentData.name;
    number = pigmentData.number;
    hex = pigmentData.hex;
    colorCode = pigmentData.colorCode;
    composition = pigmentData.composition;
    description = pigmentData.description;
    alternateNames = pigmentData.alternateNames;
    toxicity = pigmentData.toxicity;
    notes = pigmentData.notes;
    ciConstitutionNumber = pigmentData.ciConstitutionNumber;
    reviewed = pigmentData.reviewed;
    lightfastRatingCode = pigmentData.lightfastRatingCode;
    transparencyRatingCode = pigmentData.transparencyRatingCode;
  }

  $: formData = {
    id,
    slug,
    type,
    name,
    number: Number(number),
    hex,
    colorCode,
    composition,
    description,
    alternateNames,
    toxicity,
    notes,
    ciConstitutionNumber,
    reviewed,
    lightfastRatingCode,
    transparencyRatingCode,
  };

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/admin/pigments/create.json`,
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    }

    if (response.status !== 200) {
      warningNotifier(`There was a problem saving: ${response.statusText}.`);
    }
  }

  async function submit(node: HTMLElement) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const response = await handlePost();

      if (response.id) {
        goto(`/pigments/${response.color.slug}/${response.slug}`);
        successNotifier(`${response.name} ${create ? 'created!' : 'edited!'}`);
      }
    };

    node.addEventListener('submit', handler);
    return {
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }
</script>

<div class="lg:container mx-auto mt-8 px-4 sm:px-6">
  <Header
    title={create ? `Create Pigment` : `Edit ${pigmentData.name}`}
    {pathname} />

  <form use:submit class="max-w-xl">
    <div>
      <label for="name" class="block font-bold">Pigment Name </label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="name"
          name="name"
          required
          bind:value={name} />
      </div>
    </div>
    <div class="mt-6">
      <span class="block font-bold">Type </span>
      <div class="mt-1 relative inline-flex flex-col">
        <label>
          <input
            type="radio"
            bind:group={type}
            value="CIPIGMENT"
            name="type"
            id="type"
            required />
          P - Pigment (CIPIGMENT)
        </label>
        <label>
          <input
            type="radio"
            bind:group={type}
            value="CINATURAL"
            name="type"
            id="type" />
          N - Natural Pigment (CINATURAL)
        </label>
        <label>
          <input
            type="radio"
            bind:group={type}
            value="ETC"
            name="type"
            id="type" />
          Unknown (ETC)
        </label>
      </div>
    </div>

    <div class="mt-6">
      <span class="block font-bold">Colorway/Hue </span>
      <div class="mt-1 relative inline-flex flex-col">
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="R"
            required
            class="accent-red-500" />
          R - Red
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="O"
            class="accent-orange-500" />
          O - Orange
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="Y"
            class="accent-yellow-400" />
          Y - Yellow
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="G"
            class="accent-green-500" />
          G - Green
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="B"
            class="accent-blue-500" />
          B - Blue
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="V"
            class="accent-violet-500" />
          V - Violet
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="Br"
            class="accent-yellow-800" />
          B - Brown
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="Bk"
            class="accent-black" />
          B - Black
        </label>
        <label>
          <input
            type="radio"
            name="colorCode"
            id="colorCode"
            bind:group={colorCode}
            value="W"
            class="accent-gray-300" />
          W - White
        </label>
      </div>
    </div>

    <div class="mt-6">
      <label for="slug" class="block font-bold">Slug </label>
      <span class="text-gray-500 font-light"
        >This should be the CI Name, if applicable. {create
          ? 'Click generate & then update if slug needs to be changed.'
          : ''}</span>
      <div class=" relative flex">
        <input
          class="mt-1 mr-2 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="slug"
          name="slug"
          required
          disabled={disableSlug}
          bind:value={slug} />
        <div on:click={generatePigmentSlug} class="pop px-2 py-1">Generate</div>
      </div>
    </div>

    <div class="mt-6">
      <span class="font-bold">Representational Color</span>
      <div class="grid grid-cols-2 gap-4 mt-1">
        <div>
          <label for="hex" class="block text-xs mb-1">Hex</label>
          <input
            class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
            id="hex"
            name="hex"
            required
            bind:value={hex} />
        </div>
        <div>
          <label for="hexVis" class="block text-xs mb-1">Visual Select</label>
          <input
            type="color"
            name="hexVis"
            id="hexVis"
            required
            bind:value={hex}
            class="block w-full h-10 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
        </div>
      </div>
    </div>

    <div class="mt-6">
      <label for="number" class="block font-bold">Pigment Number</label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="number"
          name="number"
          bind:value={number} />
      </div>
    </div>

    <div class="mt-6">
      <label for="ciConstitutionNumber" class="block font-bold"
        >Ci Constitution Number</label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="ciConstitutionNumber"
          name="ciConstitutionNumber"
          bind:value={ciConstitutionNumber} />
      </div>
    </div>

    <div class="mt-6">
      <span class="block font-bold">Toxicity </span>
      <div class="mt-1 relative inline-flex flex-col">
        <label>
          <input
            type="radio"
            bind:group={toxicity}
            value="A"
            required
            name="toxicity" />
          A - Low
        </label>
        <label>
          <input type="radio" bind:group={toxicity} value="B" name="toxicity" />
          B - Possible
        </label>
        <label>
          <input type="radio" bind:group={toxicity} value="C" name="toxicity" />
          C - High
        </label>
        <label>
          <input type="radio" bind:group={toxicity} value="D" name="toxicity" />
          D - Extreme
        </label>
        <label>
          <input type="radio" bind:group={toxicity} value="?" name="toxicity" />
          Unknown
        </label>
      </div>
    </div>

    <div class="mt-6">
      <span class="block font-bold">Lightfast Rating</span>
      <div class="mt-1 relative inline-flex flex-col">
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="X"
            name="lightfastRatingCode"
            required />
          X - Unknown
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="NR"
            name="lightfastRatingCode" />
          NR - Not Rated
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="I"
            name="lightfastRatingCode" />
          I - Excellent
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="II"
            name="lightfastRatingCode" />
          II - Very Good
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="III"
            name="lightfastRatingCode" />
          III - Fair
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="IV"
            name="lightfastRatingCode" />
          IV - Poor
        </label>
        <label>
          <input
            type="radio"
            bind:group={lightfastRatingCode}
            value="V"
            name="lightfastRatingCode" />
          V - Very Poor
        </label>
      </div>

      <div class="mt-6">
        <span class="block font-bold">Transparency Rating</span>
        <div class="mt-1 relative inline-flex flex-col">
          <label>
            <input
              type="radio"
              bind:group={transparencyRatingCode}
              value="X"
              name="transparencyRatingCode"
              required />
            X - Unknown
          </label>
          <label>
            <input
              type="radio"
              bind:group={transparencyRatingCode}
              value="T"
              name="transparencyRatingCode" />
            T - Transparent
          </label>
          <label>
            <input
              type="radio"
              bind:group={transparencyRatingCode}
              value="S/T"
              name="transparencyRatingCode" />
            S/T - Semi-Transparent
          </label>
          <label>
            <input
              type="radio"
              bind:group={transparencyRatingCode}
              value="S/O"
              name="transparencyRatingCode" />
            S/O - Semi-Opaque
          </label>
          <label>
            <input
              type="radio"
              bind:group={transparencyRatingCode}
              value="O"
              name="transparencyRatingCode" />
            O - Opaque
          </label>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <label for="composition" class="block font-bold"
        >Composition <span class="text-gray-500 font-light"
          >(Not published by default)</span
        ></label>
      <div class="mt-1 relative">
        <textarea
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="composition"
          name="composition"
          bind:value={composition} />
      </div>
    </div>
    <div class="mt-6">
      <label for="description" class="block font-bold"
        >Description <span class="text-gray-500 font-light"
          >(Not published by default)</span
        ></label>
      <div class="mt-1 relative">
        <textarea
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="description"
          name="description"
          bind:value={description} />
      </div>
    </div>
    <div class="mt-6">
      <label for="alternateNames" class="block font-bold"
        >Alternate Names <span class="text-gray-500 font-light"
          >(Not published by default)</span
        ></label>
      <div class="mt-1 relative">
        <textarea
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="alternateNames"
          name="alternateNames"
          bind:value={alternateNames} />
      </div>
    </div>
    <div class="mt-6">
      <label for="notes" class="block font-bold"
        >Notes <span class="text-gray-500 font-light">(Internal Only)</span
        ></label>
      <div class="mt-1 relative">
        <textarea
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="notes"
          name="notes"
          bind:value={notes} />
      </div>
    </div>

    <div class="mt-6">
      <label for="reviewed" class="block font-bold">Publish as Reviewed</label>
      <p class="text-gray-500 font-light py-2"
        >This will publish each of the fields that are marked "Not published by
        default".</p>
      <div
        class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {formData.reviewed
          ? 'bg-lime-500'
          : 'bg-gray-300'}">
        <label
          for="published"
          class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {formData.reviewed
            ? 'translate-x-full border-lime-500'
            : 'translate-x-0 border-gray-300'}" />
        <input
          type="checkbox"
          id="published"
          name="published"
          class="appearance-none w-full h-full active:outline-none focus:outline-none"
          on:click={() => (formData.reviewed = !formData.reviewed)} />
      </div>
    </div>

    <div class="mt-6 pt-3 text-right border-t border-gray-400">
      <button type="submit" class="pop px-6 py-4 text-2xl hover:text-pink-500">
        Save
      </button>
    </div>
  </form>
</div>
