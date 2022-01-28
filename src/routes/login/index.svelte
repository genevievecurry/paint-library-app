<script context="module" lang="ts">
  export async function load({ session, url }) {
    const { pathname } = url;
    if (session.user) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    return {
      props: {
        pathname,
      },
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';
  import { successNotifier, warningNotifier } from '$lib/notifier';

  export let pathname;

  let email = '';
  let password = '';
  $: combined = { email: email, password: password };

  async function authenticate() {
    const response = await fetch('/auth/login', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(combined),
    });

    if (response.status == 200) {
      successNotifier(`Successfully logged in.`);
      goto('/');
      return response.json();
    } else {
      warningNotifier(
        `Uh oh, looks like we either couldn't find your account, or your
        password was entered incorrectly.`,
        { persist: true },
      );
    }
  }

  async function submitHandler() {
    $session.user = await authenticate();

    // Clear out the data fields
    password = '';
  }
</script>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Login" {pathname} />

  <form on:submit|preventDefault={submitHandler}>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <fieldset class="form-group">
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            bind:value={email} />
        </fieldset>
        <fieldset class="form-group">
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            bind:value={password} />
        </fieldset>
        <div class="mt-6 py-3 text-right border-t border-black">
          <button
            type="submit"
            class="pop px-6 py-2 text-2xl hover:text-pink-500">
            Login
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
