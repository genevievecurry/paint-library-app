<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/users.json?status=PENDING');
      const { pathname } = url;
      if (response.ok) {
        return {
          props: {
            users: await response.json(),
            pathname,
          },
        };
      }

      return {
        status: response.status,
        error: new Error('Could not load.'),
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';

  import { connect, timeAgo } from '$lib/utility';
  import { adminIcon, approveIcon, removeIcon } from '$lib/icons';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import Dialog from '$lib/components/Dialog.svelte';

  export let users;
  export let pathname: string;

  const emptyUser = {
    uuid: null,
    username: null,
  };

  let updateUser = emptyUser;

  let showDeleteUserDialog = false;
  let status;

  $: formData = {
    status: status,
  };

  async function deleteUser() {
    const response = await connect({
      method: 'DELETE',
      endpoint: `/admin/users.json`,
      data: updateUser.uuid,
    });

    showDeleteUserDialog = false;

    if (response.ok) {
      successNotifier('Deleted!');
    } else {
      warningNotifier(
        `Uh oh, there was a problem deleting user. ${response.statusText}.`,
      );
    }
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/admin/users.json`,
      data: { formData, user: updateUser },
    });

    if (response.status === 200) {
      return response.json();
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function updateStatus() {
    const promise = await handlePost();
    if (promise.id) {
      successNotifier('Status!');
      updateUser = emptyUser;
    }
  }
</script>

{#if showDeleteUserDialog}
  <Dialog
    on:close={() => (showDeleteUserDialog = false)}
    on:close={() => (updateUser = emptyUser)}
    on:confirm={deleteUser}>
    <span slot="title">Are you sure you want to delete this user?</span>
    <p slot="confirmationText"> This cannot be undone.</p>
  </Dialog>
{/if}

<Header title="Member Status Pending" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1">Username</td>
        <td class="font-bold p-1">Name</td>
        <td class="font-bold p-1">Email</td>
        <td class="font-bold p-1">Requested</td>
        <td />
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr class="border-b border-gray-300">
          <td class="p-1"><input type="checkbox" /></td>
          <td class="p-1">{user.id}</td>
          <td class="p-1">
            @<pre class="inline-block">{user.username}</pre>
            {#if user.role === 'ADMIN'}
              {@html adminIcon('h-5 w-5 inline-block')}
            {/if}
          </td>
          <td class="p-1">{user.firstName} {user.lastName}</td>
          <td class="p-1">{user.email}</td>
          <td class="p-1">{timeAgo(user.createdAt)}</td>
          <td class="p-1 whitespace-nowrap align-top">
            <button
              type="button"
              class="pop p-1 text-xs"
              on:click={() => ((updateUser = user), (status = 'ACTIVE'))}
              on:click={updateStatus}>
              {@html approveIcon('h-4 w-4')}
            </button>
            <button
              type="button"
              class="pop inline-flex items-center px-2 py-1 text-xs"
              on:click={() => (updateUser = user)}
              on:click={() => (showDeleteUserDialog = true)}>
              {@html removeIcon('h-4 w-4 mr-1')}
              <span>Delete</span>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>
