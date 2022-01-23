<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const response = await fetch('/admin/notes.json?approved=false');
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

  import { connect, timeAgo } from '$lib/utility';
  import { adminIcon, approveIcon, removeIcon } from '$lib/icons';
  import { successNotifier, warningNotifier } from '$lib/notifier';
  import { generateUrl } from '$lib/generate';
  import Dialog from '$lib/components/Dialog.svelte';

  export let notes;
  export let pathname: string;

  const emptyNote = {
    id: null,
    paint: {
      uuid: null,
    },
  };

  let updateNote = emptyNote;

  let showDeleteNoteDialog = false;

  $: formData = {
    approved: true,
    id: updateNote.id,
  };

  async function deleteNote() {
    const response = await connect({
      method: 'DELETE',
      endpoint: `/paint/${updateNote.paint.uuid}/note.json`,
      data: updateNote.id,
    });

    showDeleteNoteDialog = false;

    if (response.ok) {
      successNotifier('Deleted!');
    } else {
      warningNotifier(
        `Uh oh, there was a problem deleting note. ${response.statusText}.`,
      );
    }
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/paint/${updateNote.paint.uuid}/note.json`,
      data: formData,
    });

    if (response.status === 200) {
      return response.json();
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function updateApproved() {
    const promise = await handlePost();

    if (promise.id) {
      successNotifier('Approved!');
      updateNote = emptyNote;
    }
  }
</script>

{#if showDeleteNoteDialog}
  <Dialog
    on:close={() => (showDeleteNoteDialog = false)}
    on:close={() => (updateNote = emptyNote)}
    on:confirm={deleteNote}>
    <span slot="title">Are you sure you want to delete this note?</span>
    <p slot="confirmationText"> This cannot be undone.</p>
  </Dialog>
{/if}

<Header title="Notes Pending Approval" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1">Author</td>
        <td class="font-bold p-1">Paint</td>
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
            <a href="/@{note.author.username}" class="decorate-link"
              >@<pre class="inline-block">{note.author.username}</pre></a>
            {#if note.author.role === 'ADMIN'}
              {@html adminIcon('h-5 w-5 inline-block')}
            {/if}
          </td>
          <td class="p-1 whitespace-nowrap align-top">
            <a
              href="{generateUrl({
                prefix: 'paint',
                target: note.paint,
              })}#note-{note.id}"
              class="decorate-link">{note.paint.name}</a>
          </td>
          <td class="p-1 w-full text-base align-top">{note.content}</td>
          <td class="p-1 whitespace-nowrap align-top"
            >{timeAgo(note.createdAt)}</td>
          <td class="p-1 whitespace-nowrap align-top">
            <button
              type="button"
              class="pop p-1 text-xs"
              on:click={() => (updateNote = note)}
              on:click={updateApproved}>
              {@html approveIcon('h-4 w-4')}
            </button>
            <button
              type="button"
              class="pop inline-flex items-center px-2 py-1 text-xs"
              on:click={() => (updateNote = note)}
              on:click={() => (showDeleteNoteDialog = true)}>
              {@html removeIcon('h-4 w-4 mr-1')}
              <span>Delete</span>
            </button>
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
