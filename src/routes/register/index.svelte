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
  import PasswordQuality from '$lib/components/PasswordQuality.svelte';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { validatePassword, validateUsername } from '$lib/utility';
  import { hideIcon, showIcon } from '$lib/icons';
  import UsernameQuality from '$lib/components/UsernameQuality.svelte';

  let email = '';
  let password = '';
  let username = '';
  let firstName = '';
  let lastName = '';

  let showPassword = false;
  let allowSubmission = true;

  $: formData = {
    email: email,
    password: password,
    username: username,
    firstName: firstName,
    lastName: lastName,
  };

  $: newUser = {
    username: '',
    email: '',
    role: '',
    status: '',
    firstName: '',
    lastName: '',
    uuid: '',
  };

  let passwordValidation = validatePassword(password);
  let usernameValidation = validateUsername(username);

  function toggleAllowSubmission() {
    if (password.length > 0 && !passwordValidation.passes) {
      allowSubmission = false;
    }

    if (password.length > 0 && passwordValidation.passes) {
      allowSubmission = true;
      formData.password = password;
    }

    if (password.length === 0) {
      allowSubmission = true;
    }
  }

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
    if (allowSubmission) {
      newUser = await register();

      if (newUser.uuid) {
        successNotifier(
          `Successfully created <a href="/@${newUser.username}" class="underline">@${newUser.username}</a>.`,
          {
            persist: true,
          },
        );
      }
    }
  }
</script>

<svelte:head>
  <title>Register New User - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Register New User" />
  <form on:submit|preventDefault={submitHandler}>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div class="">
        <div>
          <label for="username" class="block font-bold">Username</label>

          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            on:keyup={() => (usernameValidation = validateUsername(username))}
            bind:value={username} />
        </div>
      </div>
      <div>
        <UsernameQuality validation={usernameValidation} {username} />
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32 mt-6">
      <!-- First Name & Last Name -->
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
          <label for="lastName" class="block font-bold">
            Last Name <span class="text-gray-400 font-light">(Optional)</span>
          </label>

          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            bind:value={lastName} />
        </div>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32 mt-6">
      <div>
        <label for="email" class="block font-bold">Email</label>
        <small class="leading-5 block mt-1 text-sm text-gray-500 mb-3">
          This is what is used to log in & where password reset emails will get
          sent... someday... when such things exist.
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
    </div>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32 mt-6">
      <div class="">
        <label for="password" class="block font-bold">Password</label>

        <div class="flex">
          {#if showPassword}
            <input
              id="currentPassword"
              name="currentPassword"
              type="text"
              on:keyup={toggleAllowSubmission}
              on:keyup={() => (passwordValidation = validatePassword(password))}
              bind:value={password}
              class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
          {:else}
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              on:keyup={toggleAllowSubmission}
              on:keyup={() => (passwordValidation = validatePassword(password))}
              bind:value={password}
              class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
          {/if}
          <button
            type="button"
            title="Toggle password visibility"
            class="pop text-xs ml-2 px-2 {showPassword ? 'active' : ''}"
            id="menu-button"
            on:click={() => (showPassword = !showPassword)}>
            {@html showPassword ? hideIcon('h-5 w-5') : showIcon('h-5 w-5')}
          </button>
        </div>
      </div>
      <div>
        <PasswordQuality validation={passwordValidation} {password} />
      </div>
    </div>

    <div class="mt-6 py-3 text-right border-t border-black">
      <button
        type="submit"
        class="pop px-6 py-4 text-2xl hover:text-pink-500"
        disabled={!allowSubmission}>
        Register
      </button>
    </div>
  </form>
</div>
