<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { session } from '$app/stores';
  import { connect } from '$lib/utility';
  import { goto } from '$app/navigation';
  import { successNotifier, warningNotifier } from '$lib/notifier';

  // paintUuid is a seed to create a new palette via a paint
  // This functionality will need to be modified if we add ability to create
  // a palette elsewhere, as it is janky jank
  export let paintUuid = null;
  export let palette = null;

  let title = palette?.title || '';
  let description = palette?.description || '';
  let visible = palette?.visible;
  let action;
  let endpoint;

  if (paintUuid !== null) {
    action = 'create';
    endpoint = '/palette/create.json';
  } else if (palette?.uuid !== undefined) {
    action = 'update';
    endpoint = `/palette/${palette?.uuid}.json`;
  }

  const dispatch = createEventDispatcher();
  const success = () => dispatch('success');

  $: formData = {
    owner: $session.user,
    title: title,
    description: description,
    paintUuid: paintUuid,
    visible,
  };

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: endpoint,
      data: formData,
    });

    if (response.status == 200) {
      return response.json();
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function submit(node) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const promise = await handlePost();

      if (promise.uuid) {
        success();
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

<form use:submit>
  <div>
    <div>
      <label for="title" class="block">Title</label>
      <input
        class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
        id="title"
        name="title"
        type="text"
        required
        placeholder="Title"
        bind:value={title} />
    </div>
    <div class="mt-6">
      <label for="description" class="block">Description</label>
      <textarea
        class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
        id="description"
        name="description"
        placeholder="Description"
        bind:value={description} />
    </div>

    <div class="mt-6">
      <label for="description" class="block">Public</label>

      <div
        class="relative rounded-full w-12 h-6 transition duration-200 ease-linear {visible
          ? 'bg-green-400'
          : 'bg-gray-400'}">
        <label
          for="toggle"
          class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer {visible
            ? 'translate-x-full border-green-400'
            : 'translate-x-0 border-gray-400'}" />
        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          class="appearance-none w-full h-full active:outline-none focus:outline-none"
          on:click={() => (visible = !visible)} />
      </div>
    </div>
  </div>

  <div class="mt-6 py-3 text-right border-t border-black">
    <button type="submit" class="pop px-6 py-4 text-2xl hover:text-pink-500">
      {action} Palette
    </button>
  </div>
</form>
