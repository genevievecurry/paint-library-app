<script context="module" lang="ts">
  export function load({ session }) {
    console.log('session', session);
    const { user } = session;
    if (!user) {
      return {
        status: 302,
        redirect: '/login',
      };
    }
    return {
      props: { user },
    };
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import { post } from '$lib/utility';

  export let user;

  $: error = false;
  $: success = false;

  async function update() {
    const response = await post('/auth/update', user);

    if (response.status == 200) {
      success = true;
      error = false;
      return response.json();
    } else {
      error = true;
    }
  }

  async function submitHandler() {
    $session.user = await update();
    console.log('$session.user', $session.user);
  }
</script>

<div class="container mx-auto px-4 sm:px-6">
  <header class="my-7">
    <h1 class="font-extrabold text-5xl">Account Settings</h1>
  </header>

  {#if error}
    <div class="bg-red-400 p-3 mb-3 text-white">
      <p>Sorry, no!</p>
    </div>
  {/if}

  <form on:submit|preventDefault="{submitHandler}">
    <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <div class="mt-6">
          <label for="displayName" class="block">Display Name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            bind:value="{user.displayName}"
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400" />
        </div>

        <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
            Update
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
