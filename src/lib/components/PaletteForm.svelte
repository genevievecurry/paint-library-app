<script type="ts">
  import { session } from '$app/stores';
  import { post } from '$lib/utility';

  export let paintId;

  let title, description;

  $: formData = {
    owner: $session.user,
    title: title,
    description: description,
    paintId: paintId,
  };

  $: newPalette = { title: '', description: '', slug: '' };

  async function create() {
    const response = await post('/palette/create.json', formData);

    if (response.status === 200) {
      return response.json();
    }
  }

  async function submitHandler() {
    newPalette = await create();
  }
</script>

<form on:submit|preventDefault={submitHandler}>
  <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
    <div>
      <div class="mt-6">
        <label for="email" class="block">Title</label>
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
        <label for="email" class="block">Description</label>
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
  </div>
  <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
    <button
      type="submit"
      class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
      Create Palette
    </button>
  </div>
</form>
