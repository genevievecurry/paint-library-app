<script context="module" lang="ts">
  export async function load({ params, session, url, fetch }) {
    const response = await fetch(`/manufacturer/${params.slug}.json`);

    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const create = params.slug === 'create';

      if (response.ok) {
        return {
          props: {
            pathname: url.pathname,
            manufacturer: await response.json(),
            create: create,
          },
        };
      }

      return {
        props: {
          pathname: url.pathname,
          create: create,
          manufacturer: {},
        },
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { connect } from '$lib/utility';
  import { generateUrl } from '$lib/generate';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';

  export let pathname;
  export let create;
  export let manufacturer;

  let name = manufacturer?.name || '';
  let website = manufacturer?.website || '';
  let sellPaper = manufacturer?.sellPaper || false;
  let sellPaint = manufacturer?.sellPaint || false;

  const title = create ? 'Create Manufacturer' : `Update ${manufacturer.name}`;
  const buttonTitle = title;

  $: formData = {
    id: manufacturer?.id,
    name: name,
    website: website,
    sellPaper: sellPaper,
    sellPaint: sellPaint,
  };

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: '/admin/manufacturers/create.json',
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    }

    if (response.status !== 200) {
      warningNotifier(`There was a problem saving: ${response.statusText}.`);
    }
  }

  async function submit(node) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const newManufacturer = await handlePost();

      if (newManufacturer.slug) {
        const url = generateUrl({
          prefix: 'manufacturer',
          target: newManufacturer,
        });
        goto(url);
        successNotifier('Manufacturer Created');
      }
    };

    node.addEventListener('submit', handler);
    return {
      destroy() {
        node.removeEventListener('submit', handler);
        window.location.reload();
      },
    };
  }
</script>

<div class="lg:container mx-auto mt-8 px-4 sm:px-6">
  <Header {title} {pathname} />
  <form use:submit class="max-w-xl">
    <div>
      <label for="name" class="block">Manufacturer Name </label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="name"
          name="name"
          bind:value={name} />
      </div>
    </div>
    <div class="mt-6">
      <label for="website" class="block">Website</label>
      <div class="mt-1 relative">
        <input
          class="border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500 block w-full p-2 sm:text-sm"
          id="website"
          name="website"
          bind:value={website} />
      </div>
    </div>
    <div class="mt-6">
      <label for="sellPaint" class="block">Sell Paint</label>

      <div
        class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {sellPaint
          ? 'bg-lime-500'
          : 'bg-gray-300'}">
        <label
          for="sellPaint"
          class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {sellPaint
            ? 'translate-x-full border-lime-500'
            : 'translate-x-0 border-gray-300'}" />
        <input
          type="checkbox"
          id="sellPaint"
          name="sellPaint"
          class="appearance-none w-full h-full active:outline-none focus:outline-none"
          on:click={() => (sellPaint = !sellPaint)} />
      </div>
    </div>
    <div class="mt-6">
      <label for="sellPaint" class="block">Sell Paper</label>

      <div
        class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {sellPaper
          ? 'bg-lime-500'
          : 'bg-gray-300'}">
        <label
          for="sellPaper"
          class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {sellPaper
            ? 'translate-x-full border-lime-500'
            : 'translate-x-0 border-gray-300'}" />
        <input
          type="checkbox"
          id="sellPaper"
          name="sellPaper"
          class="appearance-none w-full h-full active:outline-none focus:outline-none"
          on:click={() => (sellPaper = !sellPaper)} />
      </div>
    </div>

    <div class="mt-6 pt-3 text-right border-t border-gray-400">
      <button type="submit" class="pop px-6 py-4 text-2xl ">
        {buttonTitle}
      </button>
    </div>
  </form>
</div>
