<script context="module" lang="ts">
  export function load({ session }) {
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
  import { connect } from '$lib/utility';
  import Header from '$lib/components/Header.svelte';

  export let user: User;

  $: error = false;

  async function update() {
    const response = await connect({
      method: 'post',
      endpoint: '/auth/update',
      data: user,
    });

    if (response.status == 200) {
      error = false;
      return response.json();
    } else {
      error = true;
    }
  }

  async function submitHandler() {
    $session.user = await update();

    if (error) {
    } else {
      $session.notification = {
        type: 'success',
        visible: true,
        message: `
          Hoorah! @${user.username} was updated successfully.
        `,
      };
    }
  }
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="Account Settings" />

  <form on:submit|preventDefault={submitHandler}>
    <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <div class="mt-6">
          <label for="username" class="block">Display Name</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            bind:value={user.username}
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400" />
        </div>
        <div class="mt-6">
          <label for="firstName" class="block">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            bind:value={user.firstName}
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400" />
        </div>
        <div class="mt-6">
          <label for="lastName" class="block">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            bind:value={user.lastName}
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400" />
        </div>
        <div class="mt-6 py-3 text-right border-t border-black">
          <button
            type="submit"
            class="pop px-6 py-2 text-2xl hover:text-pink-500">
            Update Settings
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
