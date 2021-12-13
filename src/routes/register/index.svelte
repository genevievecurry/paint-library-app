<script context="module" lang="ts">
  export async function load({ session }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      return {};
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  let email = '';
  let password = '';
  let displayName = '';
  $: combined = {
    email: email,
    password: password,
    displayName: displayName,
  };
  $: error = false;
  $: success = false;
  $: newUser = { displayName: '', email: '', role: '', status: '', slug: '' };

  async function register() {
    const response = await fetch('/auth/register', {
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
      success = true;
      error = false;
      // Clear out form fields
      email = '';
      password = '';
      displayName = '';

      return response.json();
    } else {
      error = true;
    }
  }

  async function submitHandler() {
    newUser = await register();
  }
</script>

<div class="container mx-auto px-4 sm:px-6">
  <header class="my-7">
    <h1 class="font-extrabold text-5xl">Register New User </h1>
  </header>

  <form on:submit|preventDefault="{submitHandler}">
    <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <div class="mt-6">
          <label for="email" class="block ">Email</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3"
            >This is what is used to log in & where password reset emails will
            get sent... someday... when such things exist.</small>
          <input
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            bind:value="{email}" />
        </div>
        <div class="mt-6">
          <label for="password" class="block ">Password</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500"
            >Pick a good one! Try the <a
              href="https://gross-warped-trogon.gigalixirapp.com/"
              target="_blank"
              class="underline text-gray-500 hover:text-white hover:bg-black inline-block mb-3"
              >password generator</a
            >.</small>
          <input
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            bind:value="{password}" />
        </div>
        <div class="mt-6">
          <label for="displayName" class="block">Display Name</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3"
            >This is what other users are gonna see.</small>
          <input
            class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
            id="displayName"
            name="displayName"
            type="text"
            required
            placeholder="Password"
            bind:value="{displayName}" />
        </div>
        <div class="mt-6 px-4 py-3 text-right sm:px-6 border-t border-black">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border-4 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-2xl">
            Register
          </button>
        </div>
      </div>

      {#if success}
        <div>
          <div class="bg-green-600 p-3 text-white">
            <div class="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-smile">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <div class="ml-2">
                <h2 class="text-xl font-bold">It worked!</h2>
                The new user...
              </div>
            </div>
            <table class="border-collapse border border-white w-full">
              <tr>
                <th
                  class="text-left border border-white px-4 py-3 whitespace-nowrap"
                  >Display Name</th>
                <td class="border border-white px-4 py-3 w-full"
                  >{newUser?.displayName}</td>
              </tr>
              <tr>
                <th class="text-left border border-white px-4 py-3">Email</th>
                <td class="border border-white px-4 py-3">{newUser?.email}</td>
              </tr>
              <tr>
                <th class="text-left border border-white px-4 py-3">Roles</th>
                <td class="border border-white px-4 py-3">{newUser?.role}</td>
              </tr>
              <tr>
                <th class="text-left border border-white px-4 py-3">Status</th>
                <td class="border border-white px-4 py-3">{newUser?.status}</td>
              </tr>
              <tr>
                <th class="text-left border border-white px-4 py-3">Slug</th>
                <td class="border border-white px-4 py-3">{newUser?.slug}</td>
              </tr>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </form>
</div>
