<script context="module" lang="ts">
  export async function load({ session }) {
    if (session.user) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    return {};
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let combined;
  $: combined = { email: email, password: password };
  $: error = false;

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
      error = false;
      goto('/');
      return response.json();
    } else {
      error = true;
    }
  }

  async function submitHandler() {
    $session.user = await authenticate();

    // Clear out the data fields
    password = '';
  }
</script>

<div class="container mx-auto px-4 sm:px-6">
  <header class="my-7">
    <h1 class="font-extrabold text-5xl"> Sign In to Your Account </h1>
    <p class="text-xs-center">
      <a href="/register">Need an account?</a>
    </p>
  </header>

  {#if error}
    <div class="bg-red-400 p-3 mb-3 text-white">
      <p
        >Uh oh, looks like we either couldn't find your account, or your
        password was entered incorrectly. Try again?</p>
    </div>
  {/if}

  <form on:submit|preventDefault="{submitHandler}">
    <fieldset class="form-group">
      <input
        class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        id="email"
        name="email"
        type="email"
        required
        placeholder="Email"
        bind:value="{email}" />
    </fieldset>
    <fieldset class="form-group">
      <input
        class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
        id="password"
        name="password"
        type="password"
        required
        placeholder="Password"
        bind:value="{password}" />
    </fieldset>
    <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
        Sign in
      </button>
    </div>
  </form>
</div>
