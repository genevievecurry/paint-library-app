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
  import Header from '$lib/components/Header.svelte';
  import { successNotifier, warningNotifier } from '$lib/notifier';

  let email = '';
  let password = '';
  let username = '';
  let firstName = '';
  let lastName = '';

  $: formData = {
    email: email,
    password: password,
    username: username,
    firstName: firstName,
    lastName: lastName,
  };

  $: success = false;
  $: newUser = {
    username: '',
    email: '',
    role: '',
    status: '',
    firstName: '',
    lastName: '',
    uuid: '',
  };

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
      body: JSON.stringify(formData),
    });

    if (response.status === 200) {
      success = true;
      successNotifier(`Successfully registered new user.`);

      // Clear out form fields
      email = '';
      password = '';
      username = '';
      firstName = '';
      lastName = '';

      return response.json();
    } else {
      warningNotifier(
        `There was a ${response.status} error with registration: ${response.statusText}.`,
      );
    }
  }

  async function submitHandler() {
    newUser = await register();
  }
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="Register New User" />
  <form on:submit|preventDefault={submitHandler}>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="block font-bold">First Name</label>
            <input
              class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="First Name"
              bind:value={firstName} />
          </div>
          <div>
            <label for="lastName" class="block font-bold">Last Name</label>

            <input
              class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Last Name"
              bind:value={lastName} />
          </div>
        </div>
        <div class="mt-6">
          <label for="email" class="block font-bold">Email</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3">
            This is what is used to log in & where password reset emails will
            get sent... someday... when such things exist.
          </small>
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            bind:value={email} />
        </div>
        <div class="mt-6">
          <label for="password" class="block font-bold">Password</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500"
            >Pick a good one! Try the <a
              href="https://gross-warped-trogon.gigalixirapp.com/"
              target="_blank"
              class="underline text-gray-500 hover:text-white hover:bg-black inline-block mb-3"
              >password generator</a
            >.</small>
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            bind:value={password} />
        </div>
        <div class="mt-6">
          <label for="username" class="block font-bold">Username</label>
          <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3"
            >This is what other users are gonna see. (only letters, numbers, and
            underscores)</small>
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            bind:value={username} />
        </div>
        <div class="mt-6 py-3 text-right border-t border-black">
          <button
            type="submit"
            class="pop px-6 py-4 text-2xl hover:text-pink-500">
            Register
          </button>
        </div>
      </div>

      {#if success}
        <div>
          <div class="">
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
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <div class="ml-2">
                <h2 class="text-xl font-bold text-lime-600">It worked!</h2>
                The new user...
              </div>
            </div>
            <table class="border-collapse border border-gray-400 w-full">
              <tr>
                <th
                  class="text-left border border-gray-400  px-4 py-3 whitespace-nowrap"
                  >Username</th>
                <td class="border border-gray-400  px-4 py-3 w-full"
                  ><a href="/@{newUser?.username}" class="decorate-link"
                    >@{newUser?.username}</a
                  ></td>
              </tr>
              <tr>
                <th class="text-left border border-gray-400  px-4 py-3"
                  >Email</th>
                <td class="border border-gray-400  px-4 py-3"
                  >{newUser?.email}</td>
              </tr>
              <tr>
                <th class="text-left border border-gray-400  px-4 py-3"
                  >Roles</th>
                <td class="border border-gray-400  px-4 py-3"
                  >{newUser?.role}</td>
              </tr>
              <tr>
                <th class="text-left border border-gray-400  px-4 py-3"
                  >Status</th>
                <td class="border border-gray-400  px-4 py-3"
                  >{newUser?.status}</td>
              </tr>
              <tr>
                <th class="text-left border border-gray-400  px-4 py-3"
                  >Name</th>
                <td class="border border-gray-400  px-4 py-3"
                  >{newUser?.firstName} {newUser?.lastName}</td>
              </tr>
              <tr>
                <th class="text-left border border-gray-400  px-4 py-3"
                  >UUID</th>
                <td class="border border-gray-400  px-4 py-3"
                  >{newUser?.uuid}</td>
              </tr>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </form>
</div>
