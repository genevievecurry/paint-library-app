<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/users.json');
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
  import { timeAgo } from '$lib/utility';
  import { adminIcon } from '$lib/icons';

  export let users;
  export let pathname: string;
</script>

<Header title="Users" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1">Username</td>
        <td class="font-bold p-1">Role</td>
        <td class="font-bold p-1">Status</td>
        <td class="font-bold p-1 leading-tight">Palettes<br /> Created</td>
        <td class="font-bold p-1 leading-tight">Palettes<br /> Saved</td>
        <td class="font-bold p-1 leading-tight">Swatches<br /> Contributed</td>
        <td class="font-bold p-1 leading-tight">Artist<br /> Notes</td>
        <td class="font-bold p-1">Account Created</td>
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
          <td class="lowercase p-1">{user.role}</td>
          <td class="lowercase p-1">{user.status}</td>
          <td class="p-1" class:muted={user._count.ownedPalettes === 0}
            >{user._count.ownedPalettes}</td>
          <td class="p-1" class:muted={user._count.savedPalettes === 0}
            >{user._count.savedPalettes}</td>
          <td class="p-1" class:muted={user._count.swatchCards === 0}
            >{user._count.swatchCards}</td>
          <td class="p-1" class:muted={user._count.notes === 0}
            >{user._count.notes}</td>
          <td class="p-1">{timeAgo(user.createdAt)}</td>
          <td class="p-1">
            <a href="/@{user.username}" class="decorate-link">Public Profile</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .muted {
    @apply text-gray-300;
  }
</style>
