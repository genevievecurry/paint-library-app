<script type="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { session } from '$app/stores';
  import { connect } from '$lib/utility';
  import { goto } from '$app/navigation';

  // paintId is a seed to create a new palette via a paint
  // This functionality will need to be modified if we add ability to create
  // a palette elsewhere, as it is janky jank
  export let paintId = null;
  export let palette = null;

  let title = palette?.title || '';
  let description = palette?.description || '';
  let action;
  let endpoint;

  if (paintId !== null){
    action = 'create';
    endpoint = '/palette/create.json'
  } else if(palette?.uuid !== undefined) {
    action = 'update';
    endpoint = `/palette/${palette?.uuid}.json`
  }

  const dispatch = createEventDispatcher();
  const success = () => dispatch('success');

  $: formData = {
    owner: $session.user,
    title: title,
    description: description,
    paintId: paintId,
  };

  async function handlePost() {
    const response = await connect({method: 'post', endpoint: endpoint, data: formData});

    if (response.status == 200) {
      return response.json();
    }
  }

  async function submit(node) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const promise = await handlePost()

      if(promise.uuid){
        $session.notification = {
        type: 'success',
        visible: true,
        message: 
          `
          Hoorah! Palette was updated successfully.
          `
        }

        goto(`/palette/${promise?.uuid}/${promise?.slug}`);
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
  <div class="mt-10">
    <div class="mt-6">
      <label for="title" class="block">Title</label>
      <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3">
        Name your new palette.
      </small>
      <input
        class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        id="title"
        name="title"
        type="text"
        required
        placeholder="Title"
        bind:value={title} />
    </div>
    <div class="mt-6">
      <label for="description" class="block">Description</label>
      <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3">
        Describe it?
      </small>
      <textarea
        class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        id="description"
        name="description"
        placeholder="Description"
        bind:value={description} />
    </div>
  </div>

  <div class="mt-6 py-3 text-right border-t border-black">
    <button
      type="submit"
      class="action-link inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
      {action} Palette
    </button>
  </div>
</form>
