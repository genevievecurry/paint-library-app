<script context="module" lang="ts">
  export async function load({ session, fetch }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/users.json');
      if (response.ok) {
        return {
          props: {
            users: await response.json(),
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

  //   {
  //   "id": 1,
  //   "createdAt": "2022-01-10T18:46:42.288Z",
  //   "updatedAt": "2022-01-10T18:46:42.289Z",
  //   "deleted": false,
  //   "email": "admin@paintlibrary.com",
  //   "firstName": "Admin",
  //   "lastName": "Human",
  //   "username": "admin-the-human",
  //   "uuid": "37287234987",
  //   "role": "ADMIN",
  //   "status": "ACTIVE"
  // }

  //   notes: 2
  // ​​​
  // ownedPalettes: 2
  // ​​​
  // paints: 254
  // ​​​
  // savedPalettes: 1
  // ​​​
  // swatchCards: 508
  // ​​​
  // userToken: 0
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { timeAgo } from '$lib/utility';
  import { adminIcon } from '$lib/icons';

  export let users;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="Users" />

  <section>
    <table class="table-auto border-collapse w-full text-sm">
      <thead>
        <tr class="border-b-2 border-black">
          <td class="p-1"><input type="checkbox" /></td>
          <td class="font-bold p-1">Username</td>
          <td class="font-bold p-1">Role</td>
          <td class="font-bold p-1 leading-tight">Palettes<br /> Created</td>
          <td class="font-bold p-1 leading-tight">Palettes<br /> Saved</td>
          <td class="font-bold p-1 leading-tight"
            >Swatches<br /> Contributed</td>
          <td class="font-bold p-1 leading-tight">Artist<br /> Notes</td>
          <td class="font-bold p-1">Account Created</td>
          <td />
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr class="border-b border-gray-300">
            <td class="p-1"><input type="checkbox" /></td>
            <td class="p-1"
              >@<pre class="inline-block">{user.username}</pre
              >{#if user.role === 'ADMIN'}
                {@html adminIcon('h-5 w-5 inline-block')}
              {/if}</td>
            <td class="lowercase p-1">{user.role}</td>
            <td class="p-1">{user._count.ownedPalettes}</td>
            <td class="p-1">{user._count.savedPalettes}</td>
            <td class="p-1">{user._count.swatchCards}</td>
            <td class="p-1">{user._count.notes}</td>
            <td class="p-1">{timeAgo(user.createdAt)}</td>
            <td class="p-1"
              ><a href="/@{user.username}" class="decorate-link"
                >Public Profile</a
              ></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>
