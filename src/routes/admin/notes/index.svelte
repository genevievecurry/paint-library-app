<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/notes.json');
      const { pathname } = url;
      if (response.ok) {
        return {
          props: {
            notes: await response.json(),
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
  import { adminIcon, approveIcon, unapproveIcon } from '$lib/icons';
  import { generateUrl } from '$lib/generate';

  export let notes: NoteComponent[];
  export let pathname: string;
</script>

<Header title="Notes" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1">Author</td>
        <td class="font-bold p-1">Approved</td>
        <td class="font-bold p-1">Content</td>
        <td class="font-bold p-1">Note Created</td>
        <td />
      </tr>
    </thead>
    <tbody>
      {#each notes as note}
        <tr class="border-b border-gray-300">
          <td class="p-1 align-top"><input type="checkbox" /></td>
          <td class="p-1 align-top">{note.id}</td>
          <td class="p-1 whitespace-nowrap align-top">
            @<pre class="inline-block">{note.author.username}</pre>
            {#if note.author.role === 'ADMIN'}
              {@html adminIcon('h-5 w-5 inline-block')}
            {/if}
          </td>
          <td
            class="p-1 align-top text-center {note.approved
              ? ''
              : 'text-gray-400'}">
            {@html note.approved
              ? approveIcon('h-4 w-4 mx-auto')
              : unapproveIcon('h-4 w-4 mx-auto')}
          </td>
          <td class="p-1 w-full">{note.content}</td>
          <td class="p-1 whitespace-nowrap align-top"
            >{timeAgo(note.createdAt)}</td>
          <td class="p-1 whitespace-nowrap align-top">
            <a
              href={generateUrl({ prefix: 'paint', target: note.paint })}
              class="decorate-link">{note.paint.name}</a>
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
