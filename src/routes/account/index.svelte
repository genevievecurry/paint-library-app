<script context="module" lang="ts">
  export function load({ session, url }) {
    const { user } = session;
    const { pathname } = url;
    if (!user) {
      return {
        status: 302,
        redirect: '/login',
      };
    }
    return {
      props: { user, pathname },
    };
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import { connect, validatePassword, validateUsername } from '$lib/utility';
  import Header from '$lib/components/Header.svelte';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { hideIcon, showIcon } from '$lib/icons';
  import PasswordQuality from '$lib/components/PasswordQuality.svelte';
  import UsernameQuality from '$lib/components/UsernameQuality.svelte';

  export let user: User;
  export let pathname: string;

  let username = user.username;
  let firstName = user.firstName;
  let lastName = user.lastName;
  let currentPassword = '';
  let newPassword = '';

  let showCurrentPassword = false;
  let showNewPassword = false;
  let allowSubmission = true;

  $: formData = {
    username,
    firstName,
    lastName,
    currentPassword,
    newPassword: '',
  };

  let passwordValidation = validatePassword(newPassword);
  let usernameValidation = validateUsername(username);

  function toggleAllowSubmission() {
    if (newPassword.length > 0 && !passwordValidation.passes) {
      allowSubmission = false;
    }

    if (
      newPassword.length > 0 &&
      passwordValidation.passes &&
      currentPassword.length > 0
    ) {
      allowSubmission = true;
      formData.newPassword = newPassword;
    }

    if (newPassword.length === 0) {
      allowSubmission = true;
    }
  }

  async function update() {
    const response = await connect({
      method: 'post',
      endpoint: '/auth/update',
      data: formData,
    });

    if (response.status === 200) {
      return response.json();
    } else {
      warningNotifier(`There was an issue: ${response.statusText}`, {
        persist: true,
      });
    }
  }

  async function submitHandler() {
    if (allowSubmission) {
      let userResponse = await update();
      if (userResponse) {
        newPassword = '';
        currentPassword = '';
      }
      if (userResponse?.uuid) {
        $session.user = userResponse;
        successNotifier(
          `Hoorah! @${userResponse?.username} was updated successfully.`,
          { persist: true },
        );
      }
    }
  }
</script>

<svelte:head>
  <title>Account Settings - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Account Settings" {pathname} />

  <form on:submit|preventDefault={submitHandler}>
    <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <h2 class="text-xl font-bold">Member Details</h2>
        <div class="mt-6">
          <label for="username" class="block">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            bind:value={username}
            on:keyup={() => (usernameValidation = validateUsername(username))}
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
        </div>
      </div>
      <div>
        <UsernameQuality validation={usernameValidation} {username} />
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <div class="mt-6">
          <label for="firstName" class="block">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            bind:value={firstName}
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
        </div>
        <div class="mt-6">
          <label for="lastName" class="block">
            Last Name <span class="text-gray-400 font-light">(Optional)</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            bind:value={lastName}
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
        </div>
      </div>
    </div>
    <div class="mt-10 grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <h2 class="text-xl font-bold">Update Password</h2>
        <div class="mt-6">
          <label for="currentPassword" class="block"
            >Current/Old Password</label>
          <small
            class="leading-5 block mt-1 text-sm font-light text-gray-500 mb-3">
            Enter your current password to confirm that you're you! This is only
            necessary if you are updating your password.
          </small>
          <div class="flex">
            {#if showCurrentPassword}
              <input
                id="currentPassword"
                name="currentPassword"
                type="text"
                on:blur={toggleAllowSubmission}
                on:keyup={toggleAllowSubmission}
                bind:value={currentPassword}
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
            {:else}
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                on:blur={toggleAllowSubmission}
                on:keyup={toggleAllowSubmission}
                bind:value={currentPassword}
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
            {/if}
            <button
              type="button"
              title="Toggle password visibility"
              class="pop text-xs ml-2 px-2 {showCurrentPassword
                ? 'active'
                : ''}"
              id="menu-button"
              on:click={() => (showCurrentPassword = !showCurrentPassword)}>
              {@html showCurrentPassword
                ? hideIcon('h-5 w-5')
                : showIcon('h-5 w-5')}
            </button>
          </div>
        </div>
        <div class="mt-6">
          <label for="currentPassword" class="block">New Password</label>
          <small
            class="leading-5 block mt-1 text-sm font-light text-gray-500 mb-3">
            Enter a fresh new password.
          </small>
          <div class="flex">
            {#if showNewPassword}
              <input
                id="currentPassword"
                name="currentPassword"
                type="text"
                on:blur={toggleAllowSubmission}
                on:blur={() =>
                  (passwordValidation = validatePassword(newPassword))}
                on:keyup={toggleAllowSubmission}
                on:keyup={() =>
                  (passwordValidation = validatePassword(newPassword))}
                bind:value={newPassword}
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
            {:else}
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                on:blur={toggleAllowSubmission}
                on:blur={() =>
                  (passwordValidation = validatePassword(newPassword))}
                on:keyup={toggleAllowSubmission}
                on:keyup={() =>
                  (passwordValidation = validatePassword(newPassword))}
                bind:value={newPassword}
                class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
            {/if}
            <button
              type="button"
              title="Toggle password visibility"
              class="pop text-xs ml-2 px-2 {showNewPassword ? 'active' : ''}"
              id="menu-button"
              on:click={() => (showNewPassword = !showNewPassword)}>
              {@html showNewPassword
                ? hideIcon('h-5 w-5')
                : showIcon('h-5 w-5')}
            </button>
          </div>
        </div>
      </div>
      <div class="my-6">
        <PasswordQuality
          validation={passwordValidation}
          password={newPassword} />
      </div>
    </div>
    <div class="mt-6 py-3 text-right border-t border-black">
      <button
        type="submit"
        class="pop px-6 py-2 text-2xl"
        disabled={!allowSubmission}>
        Update Settings
      </button>
    </div>
  </form>
</div>
